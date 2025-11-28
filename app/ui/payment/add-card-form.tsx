"use client";

import { useState, useActionState } from "react";
import { addCreditCard, CreditCardState } from "@/app/lib/actions";
import {
  CreditCard,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardBack,
  CreditCardChip,
  CreditCardNumber,
  CreditCardName,
  CreditCardExpiry,
  CreditCardCvv,
  CreditCardMagStripe,
  CreditCardServiceProvider,
} from "app/ui/credit-card";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

type AddCardFormProps = {
  userId: string;
};

export default function AddCardForm({ userId }: AddCardFormProps) {
  const [cardData, setCardData] = useState({
    card_holder_name: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
  });
  const addCard: (
    prevState: CreditCardState,
    formData: FormData
  ) => Promise<CreditCardState> = addCreditCard.bind(null, userId);

  const [state, formAction, isPending] = useActionState(addCard, {
    errors: {},
    message: null,
  });

  const detectCardBrand = (
    number: string
  ): "Visa" | "Mastercard" | "Amex" | "Discover" => {
    const firstDigit = number[0];
    const firstTwo = number.substring(0, 2);

    if (firstDigit === "4") return "Visa";
    if (parseInt(firstTwo) >= 51 && parseInt(firstTwo) <= 55)
      return "Mastercard";
    if (firstTwo === "34" || firstTwo === "37") return "Amex";
    if (firstTwo === "60" || firstTwo === "65") return "Discover";

    return "Visa";
  };

  const cardBrand = detectCardBrand(cardData.card_number);

  const getCardColor = (brand: string) => {
    switch (brand) {
      case "Visa":
        return "bg-gradient-to-br from-blue-600 to-blue-800";
      case "Mastercard":
        return "bg-gradient-to-br from-red-600 to-orange-600";
      case "Amex":
        return "bg-gradient-to-br from-green-600 to-teal-700";
      case "Discover":
        return "bg-gradient-to-br from-orange-500 to-orange-700";
      default:
        return "bg-gradient-to-br from-gray-700 to-gray-900";
    }
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  return (
    <Grid container spacing={4}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CreditCard>
            <CreditCardFlipper>
              <CreditCardFront className={getCardColor(cardBrand)}>
                <CreditCardChip />
                <CreditCardNumber className="absolute top-24 left-0">
                  {cardData.card_number
                    ? formatCardNumber(cardData.card_number)
                    : "•••• •••• •••• ••••"}
                </CreditCardNumber>
                <CreditCardName className="absolute bottom-12 left-0">
                  {cardData.card_holder_name || "CARDHOLDER NAME"}
                </CreditCardName>
                <CreditCardExpiry className="absolute bottom-6 left-6">
                  {cardData.expiry_month && cardData.expiry_year
                    ? `${cardData.expiry_month}/${cardData.expiry_year.slice(
                        -2
                      )}`
                    : "MM/YY"}
                </CreditCardExpiry>
                <CreditCardServiceProvider
                  type={cardBrand}
                  format="logo"
                  className="brightness-0 invert"
                />
              </CreditCardFront>

              <CreditCardBack className={getCardColor(cardBrand)}>
                <CreditCardMagStripe />
                <div className="absolute top-1/2 -translate-y-1/2 flex gap-4">
                  <CreditCardCvv>{cardData.cvv || "•••"}</CreditCardCvv>
                </div>
              </CreditCardBack>
            </CreditCardFlipper>
          </CreditCard>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <form action={formAction}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Card Holder Name"
              name="card_holder_name"
              value={cardData.card_holder_name}
              onChange={(e) =>
                setCardData({ ...cardData, card_holder_name: e.target.value })
              }
              disabled={isPending}
              required
              error={!!state.errors?.card_holder_name}
              helperText={state.errors?.card_holder_name?.[0]}
            />

            <TextField
              fullWidth
              label="Card Number"
              name="card_number"
              value={cardData.card_number}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  card_number: e.target.value.replace(/\s/g, ""),
                })
              }
              disabled={isPending}
              required
              inputProps={{ maxLength: 16 }}
              error={!!state.errors?.card_number}
              helperText={state.errors?.card_number?.[0] || "Enter 16 digits"}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Month"
                name="expiry_month"
                value={cardData.expiry_month}
                onChange={(e) =>
                  setCardData({ ...cardData, expiry_month: e.target.value })
                }
                disabled={isPending}
                required
                placeholder="MM"
                inputProps={{ maxLength: 2 }}
                error={!!state.errors?.expiry_month}
                helperText={state.errors?.expiry_month?.[0]}
              />

              <TextField
                label="Year"
                name="expiry_year"
                value={cardData.expiry_year}
                onChange={(e) =>
                  setCardData({ ...cardData, expiry_year: e.target.value })
                }
                disabled={isPending}
                required
                placeholder="YYYY"
                inputProps={{ maxLength: 4 }}
                error={!!state.errors?.expiry_year}
                helperText={state.errors?.expiry_year?.[0]}
              />

              <TextField
                label="CVV"
                name="cvv"
                value={cardData.cvv}
                onChange={(e) =>
                  setCardData({ ...cardData, cvv: e.target.value })
                }
                disabled={isPending}
                required
                type="password"
                inputProps={{ maxLength: 4 }}
                error={!!state.errors?.cvv}
                helperText={state.errors?.cvv?.[0]}
              />
            </Box>

            <FormControlLabel
              control={<Checkbox name="is_default" value="true" />}
              label="Set as default payment method"
              disabled={isPending}
            />

            {state.message && (
              <Alert
                severity={
                  state.errors && Object.keys(state.errors).length > 0
                    ? "error"
                    : "success"
                }
              >
                {state.message}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
              startIcon={isPending ? <CircularProgress size={20} /> : null}
            >
              {isPending ? "Adding Card..." : "Add Card"}
            </Button>
          </Box>
        </form>
      </Grid>
    </Grid>
  );
}
