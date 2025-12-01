import Stripe from "stripe";

let stripe: any;

export const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover", // Use the latest API version
    });
  }
  return stripe;
};
