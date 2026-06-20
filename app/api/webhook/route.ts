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
        to: "taxidevoc@gmailcom",
        subject: "🚖 New Paid Booking",
        replyTo: email,
        html: `
          <div style="background:#111827; color:#ffffff; padding:18px; text-align:center;"> 
          <h2 style="margin:0;">🚖 New Paid Booking</h2> 
            
          </div>
          <div style="padding:20px; color:#333;"> 
            <p style="margin:5px 0 0; font-size:14px;">
              A new ride has been booked and paid:
            </p> 
          <div style="background:#f9fafb; padding:15px; border-radius:8px;">
            <p><strong>Name:</strong> ${name}</p> 
            <p><strong>Email:</strong> ${email}</p> 
            <p><strong>Phone:</strong> ${phone}</p> 
            <p><strong>Date:</strong> ${date}</p> 
            <p><strong>Time:</strong> ${time}</p> 
            <p><strong>Pickup:</strong> ${pickup}</p> 
            <p><strong>Drop-off:</strong> ${dropoff}</p> 
            <p><strong>Luggage:</strong> ${luggage}</p>
            ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ""}
            <p style="margin-top:10px; font-size:18px;"><strong>💳 Paid:</strong> €${price}</p>
          </div>
          </div>
          <div style="background:#f1f5f9; padding:12px; text-align:center; font-size:12px; color:#666;">
             TaxiDevoc System Notification
          </div>
        `
        ,
        
      })

      await resend.emails.send({
        from: "noreply@taxidevoc.com",
        to: [email],
        subject: "✅ Your Ride is Confirmed",
        html: `
          <div style="background:#0ea5e9; color:#ffffff; padding:20px; text-align:center;"> 
          <h2 style="margin:0;">✅ Ride Confirmed</h2> 
            <p style="margin:5px 0 0; font-size:14px;">
              Your booking is secured
            </p> 
          </div>
          <div style="padding:20px; color:#333;"> 
            <p>Hello <strong>${name}</strong>,</p>
          <div style="background:#f9fafb; padding:15px; border-radius:8px; margin-top:15px;">
            <p><strong>📅 Date:</strong> ${date}</p> 
            <p><strong>⏰ Time:</strong> ${time}</p> 
            <p><strong>📍 Pickup:</strong> ${pickup}</p> 
            <p><strong>🏁 Drop-off:</strong> ${dropoff}</p> 
            <p><strong>💼 Luggage:</strong> ${luggage}</p>
            <p style="margin-top:10px; font-size:18px;"><strong>💳 Paid:</strong> €${price}</p>
          </div>
          ${comment ? ` <div style="margin-top:15px;"> <p><strong>📝 Note:</strong> ${comment}</p> </div> ` : ""}
            <p style="margin-top:20px;">Thank you for choosing us. Your driver will contact you shortly.</p> 
          </div>
          <div style="background:#f1f5f9; padding:12px; text-align:center; font-size:12px; color:#666;">
             © ${new Date().getFullYear()} TaxiDevoc 
          </div>
        `,
      })

    } catch (error) {
      console.error("❌ Webhook processing error:", error)
    }
  }

  return NextResponse.json({ received: true })
}

