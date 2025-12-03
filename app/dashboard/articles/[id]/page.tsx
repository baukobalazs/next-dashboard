import { auth } from "@/auth";
import { fetchArticleById } from "@/app/lib/articles-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDateToLocal } from "@/app/lib/utils";
import DeleteArticleButton from "@/app/ui/articles/delete-article-button";
import ArticleViewClient from "@/app/ui/articles/article-view-client";

type ArticlePageProps = {
  params: {
    id: string;
  };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await fetchArticleById(params.id);

  if (!article) {
    notFound();
  }

  const session = await auth();
  const isAuthor = session?.user?.id === article.author_id;

  return (
    <ArticleViewClient
      article={article}
      isAuthor={isAuthor}
      userId={session?.user?.id}
    />
  );
}
