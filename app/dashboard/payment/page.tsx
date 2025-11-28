import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchUserCreditCards } from "@/app/lib/actions";
import { fetchFilteredInvoices } from "@/app/lib/data";
import PaymentPageClient from "./PaymentPageClient";

export default async function PaymentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const userRole = session.user.role || "user";
  const invoices = await fetchFilteredInvoices("", 1, userId, userRole);
  const cards = await fetchUserCreditCards(userId);

  return (
    <PaymentPageClient
      invoices={invoices}
      userId={userId}
      userRole={userRole}
      cards={cards}
    />
  );
}
