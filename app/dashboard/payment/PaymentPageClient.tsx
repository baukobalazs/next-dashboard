import { Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import AddCardForm from "@/app/ui/payment/add-card-form";

import SavedCards from "./saved-cards";
import { Suspense } from "react";
import { CreditCard, InvoicesTable } from "@/app/lib/definitions";

import PendingInvoices from "@/app/ui/payment/pending-invoices";

type PaymentPageProps = {
  invoices: InvoicesTable[];
  userId: string;
  userRole: string;
  cards: CreditCard[];
};

export default function PaymentPageClient({
  invoices,
  userId,
  userRole,
  cards,
}: PaymentPageProps) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between mb-6">
        <Typography variant="h4" component="h1">
          Payment
        </Typography>
      </div>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pending Invoices
            </Typography>

            <Suspense fallback={<InvoicesSkeleton />}>
              <PendingInvoices invoices={invoices} cards={cards} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Saved Payment Methods
            </Typography>

            <Suspense fallback={<CardsSkeleton />}>
              <SavedCards userId={userId} cards={cards} />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add New Card
            </Typography>

            <AddCardForm userId={userId} />
          </CardContent>
        </Card>
      </Box>
    </div>
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
