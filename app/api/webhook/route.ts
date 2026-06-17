import { NextResponse } from "next/server"
import Stripe from "stripe"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error("Webhook signature verification failed.", err)
    return new NextResponse("Webhook Error", { status: 400 })
  }

  // 🎯 Handle event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    console.log("✅ Payment successful:", session.id)

    // 💡 THIS IS WHERE YOU:
    // - Save booking to DB
    // - Send email
    // - Trigger WhatsApp flow
    // - Mark ride as paid

    const customerEmail = session.customer_details?.email
    const amount = session.amount_total

    console.log({ customerEmail, amount })
  }

  return NextResponse.json({ received: true })
}