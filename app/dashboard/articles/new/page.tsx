import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Typography from "@mui/material/Typography";
import ArticleForm from "@/app/ui/articles/articles-form";

export default async function NewArticlePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Create New Article
      </Typography>
      <ArticleForm userId={session.user.id} />
    </div>
  );
}
