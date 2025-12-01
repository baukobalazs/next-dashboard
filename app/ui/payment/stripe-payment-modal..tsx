"use client";

import { useState, useEffect, useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { formatCurrency } from "@/app/lib/utils";
import { ThemeContext } from "@/app/ThemeRegistry";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type StripePaymentModalProps = {
  open: boolean;
  onClose: () => void;
  amount: number;
  invoiceId: string;
};

export default function StripePaymentModal({
  open,
  onClose,
  amount,
  invoiceId,
}: StripePaymentModalProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { mode } = useContext(ThemeContext);
  const isDark = mode === "dark";

  useEffect(() => {
    if (open && amount) {
      // Create PaymentIntent as soon as the modal opens
      fetch("/api/stripe/payment-intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          metadata: {
            invoiceId,
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((err) => {
          setError("Failed to initialize payment");
          console.error(err);
        });
    }
  }, [open, amount, invoiceId]);

  const appearance = isDark
    ? {
        theme: "night" as const,
      }
    : {
        theme: "stripe" as const,
      };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pay Invoice #{invoiceId}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Amount: {formatCurrency(amount)}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!clientSecret && !error && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm
              amount={amount}
              invoiceId={invoiceId}
              onSuccess={onClose}
            />
          </Elements>
        )}
      </DialogContent>
      <Button onClick={onClose}>Cancel</Button>
    </Dialog>
  );
}

type CheckoutFormProps = {
  amount: number;
  invoiceId: string;
  onSuccess: () => void;
};

function CheckoutForm({ amount, invoiceId, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/payment?payment_success=true`,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else {
      // Payment succeeded
      setMessage("Payment successful!");
      setIsLoading(false);

      // TODO: Update invoice status in database

      setTimeout(() => {
        onSuccess();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      {message && (
        <Alert
          severity={message.includes("successful") ? "success" : "error"}
          sx={{ mt: 2 }}
        >
          {message}
        </Alert>
      )}

      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading || !stripe || !elements}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            `Pay ${formatCurrency(amount)}`
          )}
        </Button>
      </Box>
    </form>
  );
}
