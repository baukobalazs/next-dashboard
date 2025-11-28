"use client";

import { useState } from "react";
import { CreditCard as CreditCardType } from "@/app/lib/definitions";
import { deleteCreditCard, setDefaultCard } from "@/app/lib/actions";
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
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useRouter } from "next/navigation";

type SavedCardsProps = {
  userId: string;
  cards: CreditCardType[];
};

export default function SavedCards({ userId, cards }: SavedCardsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDelete = async (cardId: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;

    setLoading(cardId);
    await deleteCreditCard(cardId, userId);
    setLoading(null);
    router.refresh();
  };

  const handleSetDefault = async (cardId: string) => {
    setLoading(cardId);
    await setDefaultCard(cardId, userId);
    setLoading(null);
    router.refresh();
  };

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

  if (cards.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
        No saved cards. Add a card to get started.
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", gap: 3, overflowX: "auto", pb: 2 }}>
      {cards.map((card) => (
        <Box key={card.id} sx={{ position: "relative", minWidth: 320 }}>
          {card.is_default && (
            <Chip
              label="Default"
              color="primary"
              size="small"
              sx={{ position: "absolute", top: -8, left: 8, zIndex: 10 }}
            />
          )}

          <CreditCard>
            <CreditCardFlipper>
              <CreditCardFront className={getCardColor(card.card_brand)}>
                <CreditCardChip />
                <CreditCardNumber className="absolute top-24 left-0">
                  •••• •••• •••• {card.card_number_last4}
                </CreditCardNumber>
                <CreditCardName className="absolute bottom-12 left-0">
                  {card.card_holder_name}
                </CreditCardName>
                <CreditCardExpiry className="absolute bottom-6 left-6">
                  {card.expiry_month}/{card.expiry_year.slice(-2)}
                </CreditCardExpiry>
                <CreditCardServiceProvider
                  type={card.card_brand as any}
                  format="logo"
                  className="brightness-0 invert"
                />
              </CreditCardFront>

              <CreditCardBack className={getCardColor(card.card_brand)}>
                <CreditCardMagStripe />
                <CreditCardNumber className="absolute bottom-12 left-0">
                  •••• •••• •••• {card.card_number_last4}
                </CreditCardNumber>
                <div className="absolute top-1/2 -translate-y-1/2 flex gap-4">
                  <CreditCardExpiry>
                    {card.expiry_month}/{card.expiry_year.slice(-2)}
                  </CreditCardExpiry>
                  <CreditCardCvv>•••</CreditCardCvv>
                </div>
              </CreditCardBack>
            </CreditCardFlipper>
          </CreditCard>

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              size="small"
              startIcon={card.is_default ? <StarIcon /> : <StarOutlineIcon />}
              onClick={() => handleSetDefault(card.id)}
              disabled={card.is_default || loading === card.id}
              fullWidth
            >
              {card.is_default ? "Default" : "Set Default"}
            </Button>
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(card.id)}
              disabled={loading === card.id}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
