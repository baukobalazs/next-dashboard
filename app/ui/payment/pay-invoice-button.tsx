"use client";

import { useState } from "react";
import { CreditCard } from "@/app/lib/definitions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PaymentIcon from "@mui/icons-material/Payment";
import { formatCurrency } from "@/app/lib/utils";

type PayInvoiceButtonProps = {
  invoiceId: string;
  amount: number;
  cards: CreditCard[];
};

export default function PayInvoiceButton({
  invoiceId,
  amount,
  cards,
}: PayInvoiceButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(
    cards.find((c) => c.is_default)?.id || cards[0]?.id || ""
  );
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    setPaying(true);

    // TODO: Implement actual payment logic with Stripe/PayPal
    // For now, just simulate payment
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert(
      `Payment successful! Invoice #${invoiceId} paid with card ending in ${
        cards.find((c) => c.id === selectedCard)?.card_number_last4
      }`
    );

    setPaying(false);
    setOpen(false);
  };

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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Pay Invoice #{invoiceId}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight="bold">
              Amount: {formatCurrency(amount)}
            </Typography>
          </Box>

          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Select Payment Method</FormLabel>
            <RadioGroup
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
            >
              {cards.map((card) => (
                <FormControlLabel
                  key={card.id}
                  value={card.id}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography>
                        {card.card_brand} •••• {card.card_number_last4}
                      </Typography>
                      {card.is_default && (
                        <Chip label="Default" size="small" color="primary" />
                      )}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Your payment will be processed securely. This is a demo - no actual
            charges will be made.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={paying}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePay}
            disabled={!selectedCard || paying}
          >
            {paying ? "Processing..." : `Pay ${formatCurrency(amount)}`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
