import { NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"


export const runtime = "nodejs"

const resend = new Resend(process.env.RESEND_API_KEY!)

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
    try {
      const session = event.data.object as Stripe.Checkout.Session
      const data = session.metadata || {}

      const {
        name,
        email,
        phone,
        pickup,
        dropoff,
        date,
        time,
        luggage,
        comment,
        price,
      } = data

      console.log("📦 Booking data:", data)

      await resend.emails.send({
        from: "noreply@taxidevoc.com",
        to: "chikechrisokeke@gmail.com",
        subject: "🚖 New Paid Booking",
        replyTo: email,
        html: `
          <h2>New Paid Ride</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Pickup:</strong> ${pickup}</p>
          <p><strong>Drop-off:</strong> ${dropoff}</p>
          <p><strong>Price:</strong> €${price}</p>
        `,
        
      })

      await resend.emails.send({
        from: "noreply@taxidevoc.com",
        to: [email],
        subject: "✅ Your Ride is Confirmed",
        html: `
          <h2>Hello ${name},</h2>
          <p>Your ride has been successfully booked and paid 🚖</p>

          <ul>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Pickup:</strong> ${pickup}</li>
            <li><strong>Drop-off:</strong> ${dropoff}</li>
            <li><strong>Amount Paid:</strong> €${price}</li>
          </ul>

          <p>Thank you for choosing us.</p>
        `,
      })

    } catch (error) {
      console.error("❌ Webhook processing error:", error)
    }
  }

  return NextResponse.json({ received: true })
}

