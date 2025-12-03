import { auth } from "@/auth";
import { fetchArticleById, deleteArticle } from "@/app/lib/articles-actions";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { formatDateToLocal } from "@/app/lib/utils";
import DeleteArticleButton from "@/app/ui/articles/delete-article-button";

export default async function ArticlePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound();
  }

  const session = await auth();
  const isAuthor = session?.user?.id === article.author_id;
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Box sx={{ mb: 3 }}>
        <Link href="/dashboard/articles">
          <Button startIcon={<ArrowBackIcon />}>Back to Articles</Button>
        </Link>
      </Box>

      <Card>
        {article.cover_image_url && (
          <CardMedia
            component="img"
            height="400"
            image={article.cover_image_url}
            alt={article.title}
            sx={{ objectFit: "cover" }}
          />
        )}

        <CardContent>
          <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
            {article.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              By {article.author_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              •
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDateToLocal(article.published_at || article.created_at)}
            </Typography>
            {!article.is_public && (
              <>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Chip label="Private" size="small" color="warning" />
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
            {article.tags?.map((tag) => (
              <Chip key={tag.id} label={tag.name} />
            ))}
          </Box>

          {/* Article Content */}
          <Box
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
            sx={{ mb: 4 }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author Actions */}
          {(isAuthor || session?.user?.role === "admin") && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
                pt: 4,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Link href={`/dashboard/articles/${article.id}/edit`}>
                <Button variant="contained" startIcon={<EditIcon />}>
                  Edit Article
                </Button>
              </Link>
              <DeleteArticleButton
                articleId={article.id}
                userId={session.user.id}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
