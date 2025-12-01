"use client";

import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "../lib/stripe/stripe-client";

export default function StripeElementsProvider({ children, options }: any) {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
