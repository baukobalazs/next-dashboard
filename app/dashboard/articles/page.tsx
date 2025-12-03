import { auth } from "@/auth";
import { fetchArticles, fetchTags } from "@/app/lib/articles-actions";
import ArticlesList from "@/app/ui/articles/articles-list";
import ArticlesFilter from "@/app/ui/articles/articles-filter";
import Link from "next/link";
import { Suspense } from "react";
import Pagination from "@/app/ui/invoices/pagination";

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

  const { articles, total } = await fetchArticles(
    currentPage,
    query,
    tagSlug,
    session?.user?.id
  );
  const tags = await fetchTags();
  const totalPages = Math.ceil(total / 9);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Articles</h1>
        {session?.user && (
          <Link
            href="/dashboard/articles/new"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
          >
            <span>New Article</span>
          </Link>
        )}
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <ArticlesFilter tags={tags} />
      </Suspense>

      <Suspense fallback={<div>Loading articles...</div>}>
        <ArticlesList articles={articles} isAuthenticated={!!session?.user} />
      </Suspense>

      <div className="mt-8 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
