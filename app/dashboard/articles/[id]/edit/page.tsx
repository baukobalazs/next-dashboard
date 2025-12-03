import { auth } from "@/auth";
import { fetchArticleById } from "@/app/lib/articles-actions";
import { redirect, notFound } from "next/navigation";

import Typography from "@mui/material/Typography";
import ArticleForm from "@/app/ui/articles/articles-form";

type EditArticlePageProps = {
  params: {
    id: string;
  };
};

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound();
  }

  // Only author can edit
  if (article.author_id !== session.user.id) {
    redirect(`/dashboard/articles/${params.id}`);
  }

  return (
    <div className="w-full">
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Edit Article
      </Typography>
      <ArticleForm userId={session.user.id} article={article} />
    </div>
  );
}
