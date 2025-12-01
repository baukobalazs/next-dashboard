"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import PayInvoiceButton from "./pay-invoice-button";
import { CreditCard, InvoicesTable } from "@/app/lib/definitions";

type PendingInvoicesProps = {
  invoices: InvoicesTable[];
  cards: CreditCard[];
};

export default function PendingInvoices({
  invoices,
  cards,
}: PendingInvoicesProps) {
  // Fetch only pending invoices
  const hasCards = cards.length > 0;
  const pendingInvoices = invoices.filter(
    (invoice: InvoicesTable) => invoice.status === "pending"
  );

  if (pendingInvoices.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
        No pending invoices. You're all caught up!
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {pendingInvoices.map((invoice: InvoicesTable) => (
        <Box
          key={invoice.id}
          sx={{
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "action.hover",
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Invoice #{invoice.id}
              </Typography>
              <Chip label={invoice.status} color="warning" size="small" />
            </Box>

            <Typography color="text.secondary">
              Customer: {invoice.name}
            </Typography>

            <Typography color="text.secondary">
              Date: {formatDateToLocal(invoice.date)}
            </Typography>

            {invoice.deadline && (
              <Typography color="error">
                Due: {formatDateToLocal(invoice.deadline)}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              {formatCurrency(invoice.amount)}
            </Typography>

            {hasCards ? (
              <PayInvoiceButton
                invoiceId={invoice.id}
                amount={invoice.amount}
              />
            ) : (
              <Chip label="Add card to pay" color="default" />
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
