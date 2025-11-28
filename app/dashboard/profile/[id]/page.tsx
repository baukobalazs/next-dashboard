import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import ProfileForm from "@/app/ui/profile/profile-form";
import { auth, getUser, getUserByid } from "@/auth";
import { notFound } from "next/navigation";
import React from "react";

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const user = await getUserByid(id);

  if (!user || !user.id) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Profile", href: "/dashboard/profile" },
          {
            label: `Profile ${id}`,
            href: `/dashboard/profile/${id}`,
            active: true,
          },
        ]}
      />
      <ProfileForm user={user} />
    </main>
  );
};

export default Page;
