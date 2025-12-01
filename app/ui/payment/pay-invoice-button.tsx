"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import PaymentIcon from "@mui/icons-material/Payment";
import StripePaymentModal from "./stripe-payment-modal.";

type PayInvoiceButtonProps = {
  invoiceId: string;
  amount: number;
};

export default function PayInvoiceButton({
  invoiceId,
  amount,
}: PayInvoiceButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PaymentIcon />}
        onClick={() => setOpen(true)}
      >
        Pay Now
      </Button>

      <StripePaymentModal
        open={open}
        onClose={() => setOpen(false)}
        amount={amount}
        invoiceId={invoiceId}
      />
    </>
  );
}
