"use client";

import { useState } from "react";
import { CreditCard as CreditCardType } from "@/app/lib/definitions";
import { deleteCreditCard, setDefaultCard } from "@/app/lib/actions";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useRouter } from "next/navigation";

import {
  CreditCard,
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
        <CardFlipper
          key={card.id}
          card={card}
          loading={loading}
          onDelete={() => handleDelete(card.id)}
          onSetDefault={() => handleSetDefault(card.id)}
          getCardColor={getCardColor}
        />
      ))}
    </Box>
  );
}

// --- CardFlipper component ---
type CardFlipperProps = {
  card: CreditCardType;
  loading: string | null;
  onDelete: () => void;
  onSetDefault: () => void;
  getCardColor: (brand: string) => string;
};

function CardFlipper({
  card,
  loading,
  onDelete,
  onSetDefault,
  getCardColor,
}: CardFlipperProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <Box sx={{ position: "relative", minWidth: 320, minHeight: 200 }}>
      {card.is_default && (
        <Chip
          label="Default"
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 8, left: 8, zIndex: 10 }}
        />
      )}

      <Box
        className="perspective"
        sx={{ cursor: "pointer" }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={() => setFlipped(!flipped)}
      >
        <Box
          className={`duration-500 transform-style-preserve-3d relative`}
          sx={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <CreditCardFront
            className={`${getCardColor(
              card.card_brand
            )} absolute w-80 h-52 backface-hidden`}
          >
            <CreditCardChip />
            <CreditCardNumber className="absolute top-20 left-0">
              •••• •••• •••• {card.card_number_last4}
            </CreditCardNumber>
            <CreditCardName className="absolute bottom-8 left-0">
              {card.card_holder_name}
            </CreditCardName>
            <CreditCardExpiry className="absolute bottom-3 left-6">
              {card.expiry_month}/{card.expiry_year.slice(-2)}
            </CreditCardExpiry>
            <CreditCardServiceProvider
              type={card.card_brand as any}
              format="logo"
              className="brightness-0 invert"
            />
          </CreditCardFront>

          <CreditCardBack
            className={`${getCardColor(
              card.card_brand
            )} absolute w-80 h-52 backface-hidden`}
          >
            <CreditCardMagStripe />
            <CreditCardNumber className="absolute bottom-8 left-0">
              •••• •••• •••• {card.card_number_last4}
            </CreditCardNumber>
            <Box className="absolute top-1/2 -translate-y-1/2 flex gap-4">
              <CreditCardExpiry>
                {card.expiry_month}/{card.expiry_year.slice(-2)}
              </CreditCardExpiry>
              <CreditCardCvv>•••</CreditCardCvv>
            </Box>
          </CreditCardBack>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Button
          size="small"
          startIcon={card.is_default ? <StarIcon /> : <StarOutlineIcon />}
          onClick={onSetDefault}
          disabled={card.is_default || loading === card.id}
          fullWidth
          className="-top-3"
        >
          {card.is_default ? "Default" : "Set Default"}
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={onDelete}
          disabled={loading === card.id}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
