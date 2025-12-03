'use server'
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { Article, Tag, ArticleWithTags } from './definitions';

import { put } from '@vercel/blob';
import { MOCK_ARTICLES, MOCK_TAGS } from './placeholder-data';
import postgres from 'postgres';

const USE_MOCK = process.env.USE_MOCK_DATA === 'true';

let sql : any ;

if ((!USE_MOCK ) && process.env.POSTGRES_URL) {
  try {
    sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });
    console.log('Database connection established');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
} else{
    console.log('Using mock data in development');
  }

export type ArticleState = {
  errors?: {
    title?: string[];
    content?: string[];
    excerpt?: string[];
    tags?: string[];
  };
  message?: string | null;
};

const ArticleSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  content: z.string().min(10, { message: 'Content is required.' }),
  excerpt: z.string().optional(),
  cover_image_url: z.string().optional(),
  status: z.enum(['draft', 'published']),
  is_public: z.boolean(),
  tags: z.string(), // Comma-separated tag names
});

// Create or update article
export async function saveArticle(
  userId: string,
  articleId: string | null,
  prevState: ArticleState,
  formData: FormData
) {
  const validatedFields = ArticleSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt'),
    cover_image_url: formData.get('cover_image_url'),
    status: formData.get('status'),
    is_public: formData.get('is_public') === 'true',
    tags: formData.get('tags'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to save article.',
    };
  }

  const { title, content, excerpt, cover_image_url, status, is_public, tags } = validatedFields.data;

  // Handle cover image upload
  let imageUrl = cover_image_url || null;
  const imageFile = formData.get('cover_image') as File | null;

  if (imageFile && imageFile.size > 0) {
    try {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + imageFile.name;
      const blob = await put(uniqueName, imageFile, { access: 'public' });
      imageUrl = blob.url;
    } catch (error) {
      console.error('Blob upload error:', error);
      return {
        errors: { title: ['Failed to upload image.'] },
        message: 'Image upload failed.',
      };
    }
  }

  const published_at = status === 'published' ? new Date().toISOString() : null;
  const tagNames = tags.split(',').map((t) => t.trim()).filter(Boolean);

  if (!USE_MOCK) {
    try {
      let savedArticleId = articleId;

      if (articleId) {
        // Update existing article
        await sql`
          UPDATE articles
          SET
            title = ${title},
            content = ${content},
            excerpt = ${excerpt || null},
            cover_image_url = ${imageUrl},
            status = ${status},
            is_public = ${is_public},
            published_at = ${published_at},
            updated_at = NOW()
          WHERE id = ${articleId} AND author_id = ${userId}
        `;
      } else {
        // Create new article
        const result = await sql`
          INSERT INTO articles (title, content, excerpt, author_id, cover_image_url, status, is_public, published_at)
          VALUES (${title}, ${content}, ${excerpt || null}, ${userId}, ${imageUrl}, ${status}, ${is_public}, ${published_at})
          RETURNING id
        `;
        savedArticleId = result.rows[0].id;
      }

      // Handle tags
      if (savedArticleId) {
        // Remove old tags
        await sql`DELETE FROM article_tags WHERE article_id = ${savedArticleId}`;

        // Add new tags
        for (const tagName of tagNames) {
          const slug = tagName.toLowerCase().replace(/\s+/g, '-');

          // Insert or get tag
          const tagResult = await sql`
            INSERT INTO tags (name, slug)
            VALUES (${tagName}, ${slug})
            ON CONFLICT (slug) DO UPDATE SET name = ${tagName}
            RETURNING id
          `;
          const tagId = tagResult.rows[0].id;

          // Link tag to article
          await sql`
            INSERT INTO article_tags (article_id, tag_id)
            VALUES (${savedArticleId}, ${tagId})
            ON CONFLICT DO NOTHING
          `;
        }
      }
    } catch (error) {
      console.error('Database error:', error);
      return {
        message: 'Database error: failed to save article.',
      };
    }
  }

  revalidatePath('/dashboard/articles');
  return { message: 'Article saved successfully!' };
}

// Delete article
export async function deleteArticle(articleId: string, userId: string) {
  if (!USE_MOCK) {
    try {
      await sql`
        DELETE FROM articles
        WHERE id = ${articleId} AND author_id = ${userId}
      `;
    } catch (error) {
      console.error('Database error:', error);
      return { message: 'Failed to delete article.' };
    }
  }

  revalidatePath('/dashboard/articles');
  return { message: 'Article deleted successfully!' };
}

// Fetch articles with pagination and filters
export async function fetchArticles(
  page: number = 1,
  query: string = '',
  tagSlug: string = '',
  userId?: string,
  limit: number = 9
): Promise<{ articles: ArticleWithTags[]; total: number }> {
  const offset = (page - 1) * limit;

  if (USE_MOCK) {
    let filtered = MOCK_ARTICLES;

    if (query) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query.toLowerCase()) ||
          a.excerpt?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (userId) {
      filtered = filtered.filter((a) => a.author_id === userId);
    }

    return {
      articles: filtered.slice(offset, offset + limit) as ArticleWithTags[],
      total: filtered.length,
    };
  }

  try {
    const whereConditions = ['status = \'published\''];
    
    if (query) {
      whereConditions.push(`(title ILIKE '%${query}%' OR excerpt ILIKE '%${query}%')`);
    }

    if (userId) {
      whereConditions.push(`author_id = '${userId}'`);
    }

    if (tagSlug) {
      whereConditions.push(`id IN (
        SELECT article_id FROM article_tags
        JOIN tags ON article_tags.tag_id = tags.id
        WHERE tags.slug = '${tagSlug}'
      )`);
    }

    const whereClause = whereConditions.join(' AND ');

    const articlesResult = await sql`
      SELECT
        articles.*,
        users.name as author_name,
        users.email as author_email
      FROM articles
      JOIN users ON articles.author_id = users.id
      WHERE ${sql.raw(whereClause)}
      ORDER BY articles.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM articles
      WHERE ${sql.raw(whereClause)}
    `;

    const articles = articlesResult.rows as Article[];
    const total = parseInt(countResult.rows[0].total);

    // Fetch tags for each article
    const articlesWithTags: ArticleWithTags[] = await Promise.all(
      articles.map(async (article) => {
        const tagsResult = await sql`
          SELECT tags.*
          FROM tags
          JOIN article_tags ON tags.id = article_tags.tag_id
          WHERE article_tags.article_id = ${article.id}
        `;
        return { ...article, tags: tagsResult.rows as Tag[] };
      })
    );

    return { articles: articlesWithTags, total };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch articles.');
  }
}

// Fetch single article
export async function fetchArticleById(id: string): Promise<ArticleWithTags | null> {
  if (USE_MOCK) {
    const article = MOCK_ARTICLES.find((a) => a.id === id);
    return article ? { ...article, tags: [] } : null;
  }

  try {
    const result = await sql`
      SELECT
        articles.*,
        users.name as author_name,
        users.email as author_email
      FROM articles
      JOIN users ON articles.author_id = users.id
      WHERE articles.id = ${id}
    `;

    if (result.rowCount === 0) return null;

    const article = result.rows[0] as Article;

    const tagsResult = await sql`
      SELECT tags.*
      FROM tags
      JOIN article_tags ON tags.id = article_tags.tag_id
      WHERE article_tags.article_id = ${id}
    `;

    return { ...article, tags: tagsResult.rows as Tag[] };
  } catch (error) {
    console.error('Database error:', error);
    return null;
  }
}

// Fetch all tags
export async function fetchTags(): Promise<Tag[]> {
  if (USE_MOCK) {
    return MOCK_TAGS;
  }

  try {
    const result = await sql`
      SELECT * FROM tags ORDER BY name ASC
    `;
    return result.rows as Tag[];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

