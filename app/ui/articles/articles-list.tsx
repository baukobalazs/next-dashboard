"use client";

import { ArticleWithTags } from "@/app/lib/definitions";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

import Link from "next/link";
import { formatDateToLocal } from "@/app/lib/utils";
import Grid from "@mui/material/Grid";

type ArticlesListProps = {
  articles: ArticleWithTags[];
  isAuthenticated: boolean;
};

export default function ArticlesList({
  articles,
  isAuthenticated,
}: ArticlesListProps) {
  if (articles.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
        <Typography variant="h6">No articles found</Typography>
        {isAuthenticated && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Create your first article to get started!
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {articles.map((article) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
          <Link
            href={`/dashboard/articles/${article.id}`}
            style={{ textDecoration: "none" }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              {article.cover_image_url && (
                <CardMedia
                  component="img"
                  height="200"
                  image={article.cover_image_url}
                  alt={article.title}
                  sx={{ objectFit: "cover" }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    mb: 2,
                  }}
                >
                  {article.title}
                </Typography>

                {article.excerpt && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      mb: 2,
                    }}
                  >
                    {article.excerpt}
                  </Typography>
                )}

                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}
                >
                  {article.tags?.slice(0, 8).map((tag) => (
                    <Chip key={tag.id} label={tag.name} size="small" />
                  ))}
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {article.author_name} •{" "}
                  {formatDateToLocal(
                    article.published_at || article.created_at
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
