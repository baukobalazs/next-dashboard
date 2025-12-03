import { auth } from "@/auth";
import { fetchArticles, fetchTags } from "@/app/lib/articles-actions";

import { Button } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { Suspense } from "react";
import Pagination from "@/app/ui/invoices/pagination";
import ArticlesList from "@/app/ui/articles/articles-list";
import ArticlesFilter from "@/app/ui/articles/articles-filter";

export default async function ArticlesPage(props: {
  searchParams?: Promise<{
    query?: string;
    tag?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const session = await auth();
  const query = searchParams?.query || "";
  const tagSlug = searchParams?.tag || "";
  const currentPage = Number(searchParams?.page) || 1;

  const { articles, total } = await fetchArticles(currentPage, query, tagSlug);
  const tags = await fetchTags();
  const totalPages = Math.ceil(total / 9);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Articles</h1>
        {session?.user && (
          <Link href="/dashboard/articles/new">
            <Button variant="contained" startIcon={<AddIcon />}>
              New Article
            </Button>
          </Link>
        )}
      </div>

      <ArticlesFilter tags={tags} />

      <ArticlesList articles={articles} isAuthenticated={!!session?.user} />

      <div className="mt-8 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
