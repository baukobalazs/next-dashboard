"use client";

import { ArticleWithTags } from "@/app/lib/definitions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { formatDateToLocal } from "@/app/lib/utils";
import DeleteArticleButton from "./delete-article-button";

type ArticleViewClientProps = {
  article: ArticleWithTags;
  isAuthor: boolean;
  userId?: string;
};

export default function ArticleViewClient({
  article,
  isAuthor,
  userId,
}: ArticleViewClientProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Box sx={{ mb: 3 }}>
        <Link href="/dashboard/articles">
          <Button startIcon={<ArrowBackIcon />}>Back to all Articles</Button>
        </Link>
      </Box>

      <Card>
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
          <Typography variant="h6" component="h2">
            {article.excerpt}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
            {article.tags?.map((tag) => (
              <Chip key={tag.id} label={tag.name} />
            ))}
          </Box>
          {article.cover_image_url && (
            <CardMedia
              component="img"
              image={article.cover_image_url}
              alt={article.title}
              sx={{
                objectFit: "cover",
                borderRadius: 1,
                mb: 5,
              }}
            />
          )}
          {/* Article Content */}
          <Box
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none"
            sx={{ mb: 4 }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Author Actions */}
          {isAuthor && userId && (
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
              <DeleteArticleButton articleId={article.id} userId={userId} />
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
