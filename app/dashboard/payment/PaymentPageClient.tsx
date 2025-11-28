"use client";
import { Card, CardContent } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import AddCardForm from "@/app/ui/payment/add-card-form";

import SavedCards from "../../ui/payment/saved-cards";
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

            <PendingInvoices invoices={invoices} cards={cards} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Saved Payment Methods
            </Typography>

            <SavedCards userId={userId} cards={cards} />
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
