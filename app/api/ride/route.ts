
import { NextResponse } from "next/server"
import { Resend } from "resend"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { luggage, date, time, from, to, name, phone, email, comment, previewPrice } = body
    const amount = previewPrice
      ? Math.round(Number(previewPrice) * 100)
      : 0

    if (!amount || isNaN(amount)) {
      throw new Error("Invalid price")
    }

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Taxi Ride: ${from} to ${to}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        name: String(name),
        email: String(email),
        pickup: String(from),
        dropoff: String(to),
        date: String(date),
        time: String(time),
        price: String(previewPrice),
      },
    } as any)


    // 1️⃣ Admin copy (goes to you)
    const adminEmail = await resend.emails.send({
      from: "noreply@taxidevoc.com", // replace with verified domain later
      to: "taxidevoc@gmail.com", //  email for admin
      subject: "🚖 New Schedule-Ride Booking Request",
      replyTo: email,
      html: `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb; padding:20px 0; font-family:Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border:1px solid #eee; border-radius:8px; overflow:hidden;">
              <tr>
                <td align="center" bgcolor="#60BD66" style="padding:16px; color:#ffffff; font-size:20px; font-weight:bold;">
                  🚖 New Ride Booking
                </td>
              </tr>
              <tr>
                <td style="padding:20px; color:#333333; font-size:14px; line-height:1.6;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Luggage:</strong>${luggage}</p>
                  <p><strong>Date:</strong> ${date}</p>
                  <p><strong>Time:</strong> ${time}</p>
                  <p><strong>Pickup:</strong> ${from}</p>
                  <p><strong>Drop-off:</strong> ${to}</p>
                  <p><strong>Price:</strong> €${previewPrice ? Number(previewPrice).toFixed(2) : "N/A"}
                  <p><strong>Comment:</strong> ${comment}</p>
                </td>
              </tr>
              <p><strong>Payment Link:</strong> 
              <a href="${paymentLink.url}">${paymentLink.url}</a></p>   
              <tr>
                <td align="center" bgcolor="#f1f1f1" style="padding:12px; font-size:12px; color:#666666;">
                  De Voc Taxi • Reliable rides, every time
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
      `,
    })

    // 2️⃣ Passenger confirmation (goes to them)
    const passengerEmail = await resend.emails.send({
      from: "noreply@taxidevoc.com", // same verified domain
      to: [email], // passenger’s email from the form
      subject: "✅ Your Ride Has Been Scheduled",
      html: `

      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f9fafb; padding:20px 0; font-family:Arial, sans-serif;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border:1px solid #eee; border-radius:8px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td align="center" bgcolor="#60BD66" style="padding:16px; color:#ffffff; font-size:20px; font-weight:bold;">
                  ✅ Your Ride Has Been Scheduled
                </td>
              </tr>
              
              <!-- Body -->
              <tr>
                <td style="padding:20px; color:#333333; font-size:14px; line-height:1.6;">
                  <p>Hello ${name},</p>
                  <p>Your ride has been scheduled successfully. Here are the details:</p>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">
                    <tr><td><strong>Passenger Name:</strong> ${name}</td></tr>
                    <tr><td><strong>Date:</strong> ${date}</td></tr>
                    <tr><td><strong>Time:</strong> ${time}</td></tr>
                    <tr><td><strong>Pickup:</strong> ${from}</td></tr>
                    <tr><td><strong>Drop-off:</strong> ${to}</td></tr>
                    <tr><td><strong>Price:</strong> €${previewPrice ? Number(previewPrice).toFixed(2) : "N/A"}</td></tr>
                  </table>
                  <p style="margin-top:15px;">We’ll be in touch if anything changes. Safe travels!</p>
                </td>
              </tr>

              <tr>
                <td align="center" style="padding:20px;">
                  <a href="${paymentLink.url}" 
                    style="background:#0ea5e9; color:white; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
                    💳 Pay for Your Ride
                  </a>
                </td>
              </tr>

              
              <!-- Footer -->
              <tr>
                <td align="center" bgcolor="#f1f1f1" style="padding:12px; font-size:12px; color:#666666;">
                  De Voc Taxi • Reliable rides, every time
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
      `,
    })

    return NextResponse.json({ success: true, adminEmail, passengerEmail })
  } catch (error) {
    return NextResponse.json({ success: false, error })
  }
}
