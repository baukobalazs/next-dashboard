import { fetchTags } from "@/app/lib/articles-actions";
import ArticleForm from "@/app/ui/articles/articles-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewArticlePage() {
  const session = await auth();
  const tags = await fetchTags();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Create New Article</h1>
      <ArticleForm userId={session.user.id} existingTags={tags} />
    </div>
  );
}
