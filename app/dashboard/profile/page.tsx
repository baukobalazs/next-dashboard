import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/app/ui/profile/profile-form";
import { getUser } from "@/auth";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await getUser(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>
      <div className="mt-4 flex items-center justify-center md:mt-8">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
