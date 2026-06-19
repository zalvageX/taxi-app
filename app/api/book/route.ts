// app/api/book-trip/route.ts

import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      name,
      email,
      phone,
      pickup,
      dropoff,
      price,
      distance,
      duration,
    } = body

    // 📩 Send to admin
    const adminEmail = await resend.emails.send({
      from: "noreply@taxidevoc.com",
      to: "chikechrisokeke@gmail.com",
      subject: "🚗 New Ride Booking",
      html: `
        <h2>New Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Pickup:</strong> ${pickup}</p>
        <p><strong>Dropoff:</strong> ${dropoff}</p>
        <p><strong>Distance:</strong> ${distance} km</p>
        <p><strong>Duration:</strong> ${duration} mins</p>
        <p><strong>Price:</strong> €${price}</p>
      `,
    })

    // 📩 Send to customer
    const customerEmail = await resend.emails.send({
      from: "noreply@taxidevoc.com",
      to: email,
      subject: "Your Ride is Confirmed 🚗",
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hi ${name},</p>
        <p>Your ride has been scheduled.</p>
        <p><strong>Pickup:</strong> ${pickup}</p>
        <p><strong>Dropoff:</strong> ${dropoff}</p>
        <p><strong>Price:</strong> €${price}</p>
      `,
    })

    return NextResponse.json({ success: true, adminEmail, customerEmail })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}