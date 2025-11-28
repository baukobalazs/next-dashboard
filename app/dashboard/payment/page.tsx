import { Suspense } from "react";
import PaymentPageClient from "./PaymentPageClient";
import { Box, Skeleton } from "@mui/material";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { fetchUserCreditCards } from "@/app/lib/actions";
import { fetchFilteredInvoices } from "@/app/lib/data";

export default async function PaymentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <Suspense fallback={<PaymentPageSkeleton />}>
      <PaymentPageContent session={session} />
    </Suspense>
  );
}

async function PaymentPageContent({ session }: { session: any }) {
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

function PaymentPageSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <InvoicesSkeleton />
      <CardsSkeleton />
    </Box>
  );
}

function CardsSkeleton() {
  return (
    <Box sx={{ display: "flex", gap: 2, overflowX: "auto" }}>
      {[1, 2].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          width={320}
          height={200}
          sx={{ borderRadius: 2 }}
        />
      ))}
    </Box>
  );
}

function InvoicesSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          height={80}
          sx={{ borderRadius: 1 }}
        />
      ))}
    </Box>
  );
}
