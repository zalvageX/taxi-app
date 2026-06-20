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
      to: "taxidevoc@gmail.com",
      subject: "🚗 New Ride Booking",
      html: `
        <!-- Header --> 

        <div style="background:#111827; color:#ffffff; padding:18px; text-align:center;"> 
          <h2 style="margin:0;">🚗 New Ride Booking</h2> 
        </div> 
        
        <!-- Body --> 
        
          <div style="padding:20px; color:#333;"> 
            <p style="margin-bottom:15px;">A new ride has been booked:</p> 
            <div style="background:#f9fafb; padding:15px; border-radius:8px;"> 
              <p><strong>Name:</strong> ${name}</p> 
              <p><strong>Phone:</strong> ${phone}</p> 
              <p><strong>Email:</strong> ${email}</p> 
              <p><strong>Pickup:</strong> ${pickup}</p> 
              <p><strong>Drop-off:</strong> ${dropoff}</p> 
              <p><strong>Distance:</strong> ${distance} km</p> 
              <p><strong>Duration:</strong> ${duration} mins</p> 
              <p style="margin-top:10px; font-size:18px;"> <strong>💰 Price:</strong> €${price} </p> 
            </div> 
          </div> 
        
        <!-- Footer --> 
          
        <div style="background:#f1f5f9; padding:12px; text-align:center; font-size:12px; color:#666;"> TaxiDevoc Admin Notification </div>
      `,
    })

    // 📩 Send to customer
    const customerEmail = await resend.emails.send({
      from: "noreply@taxidevoc.com",
      to: email,
      subject: "Your Ride is Confirmed 🚗",
      html: `
        <!-- Header --> 
        
      <div style="background:#0ea5e9; color:#ffffff; padding:20px; text-align:center;"> 
        <h2 style="margin:0;">✅ Ride Confirmed</h2> 
        <p style="margin:5px 0 0; font-size:14px;">Your booking is secured</p> 
      </div> 
      
        <!-- Body --> 
        
      <div style="padding:20px; color:#333;"> 
        <p>Hello <strong>${name}</strong>,</p> 
        <p>Your ride has been successfully scheduled 🚗</p> 
          <div style="background:#f9fafb; padding:15px; border-radius:8px; margin-top:15px;"> 
            <p><strong>📍 Pickup:</strong> ${pickup}</p> 
            <p><strong>🏁 Drop-off:</strong> ${dropoff}</p> 
            <p><strong>📏 Distance:</strong> ${distance} km</p> 
            <p><strong>⏱ Duration:</strong> ${duration} mins</p> 
            <p style="margin-top:10px; font-size:18px;"> <strong>💳 Price:</strong> €${price} </p> 
          </div> 
        <p style="margin-top:20px;"> Your driver will contact you before pickup. Sit back and relax. </p> 
      </div> 
      
        <!-- Footer --> 
      <div style="background:#f1f5f9; padding:12px; text-align:center; font-size:12px; color:#666;"> © ${new Date().getFullYear()} TaxiDevoc • Reliable rides, every time </div>
      `,
    })

    return NextResponse.json({ success: true, adminEmail, customerEmail })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}