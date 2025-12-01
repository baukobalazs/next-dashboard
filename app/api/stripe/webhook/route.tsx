import { updateInvoiceStatus } from "@/app/lib/actions";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const sig = req.headers.get("stripe-signature");
  const text = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      text,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;

    const invoiceId = intent.metadata?.invoiceId;

    if (invoiceId) {
      await updateInvoiceStatus(invoiceId, "paid");
    }
  }
  return NextResponse.json({ received: true });
}
