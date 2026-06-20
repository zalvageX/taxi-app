import { NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request): Promise<Response> {
try {
const body: {
  name: string
  email: string
  pickup: string
  dropoff: string
  date: string
  time: string
  price: string | number
} = await req.json()

const { name, email, pickup, dropoff, date, time, price } = body

const amount = Math.round(Number(price) * 100)

const paymentLink = await stripe.paymentLinks.create({
  line_items: [
    {
      price_data: {
        currency: "eur",
        product_data: {
          name: `Taxi Ride: ${pickup} to ${dropoff}`,
        },
        unit_amount: amount,
      },
      quantity: 1,
    },
  ],
  metadata: {
    name: String(name),
    email: String(email),
    pickup: String(pickup),
    dropoff: String(dropoff),
    date: String(date),
    time: String(time),
    price: String(price),
  },
} as any)

// 2️⃣ Send Email
await resend.emails.send({
  from: "noreply@taxidevoc.com",
  to: email,
  subject: "💳 Complete Your Ride Payment",
  html: `
    <div style="font-family: Arial; padding:20px;">
      <h2>Complete Your Payment</h2>
      <p>Hello ${name},</p>
      <p>Please complete your ride payment below:</p>

      <p>
        <a href="${paymentLink.url}" 
           style="background:#0ea5e9; color:white; padding:12px 20px; text-decoration:none; border-radius:6px;">
           Pay Now
        </a>
      </p>

      <p><strong>Route:</strong> ${pickup} → ${dropoff}</p>
      <p><strong>Amount:</strong> €${price}</p>
    </div>
  `,
})

return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("❌ ERROR:", err.message)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }

  // 👇 this silences TypeScript completely
  return NextResponse.json({ error: "Unexpected flow" }, { status: 500 })
}