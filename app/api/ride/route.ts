// import { NextResponse } from "next/server"
// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY)

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()
//     const { luggage, date, time, from, to, name, phone, email, comment, previewPrice } = body

//     const data = await resend.emails.send({
//       from: "onboarding@resend.dev", // replace with your verified domain later
//       to: "chikechrisokeke@gmail.com", // main recipient
//       bcc: [email], // ✅ use the passenger’s email from the form as BCC
//       replyTo: email, // reply goes to passenger
//       subject: "🚖 New Scheduled-Ride Booking Request",
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
//           <div style="background: #62B3BF; color: white; padding: 16px; text-align: center;">
//             <h2 style="margin: 0;">De Vock Taxi</h2>
//             <p style="margin: 0;">New Ride Booking</p>
//           </div>
//           <div style="padding: 20px; background: #f9fafb;">
//             <p><strong>Name:</strong> ${name}</p>
//             <p><strong>Email:</strong> ${email}</p>
//             <p><strong>Phone:</strong> ${phone}</p>
//             <p><strong>Luggage:</strong> ${luggage ? "Yes" : "No"}</p>
//             <p><strong>Date:</strong> ${date}</p>
//             <p><strong>Time:</strong> ${time}</p>
//             <p><strong>Pickup:</strong> ${from}</p>
//             <p><strong>Drop-off:</strong> ${to}</p>
//             <p><strong>Price:</strong> €${previewPrice ? previewPrice.toFixed(2) : "N/A"}</p>
//             <p><strong>Comment:</strong></p>
//             <div style="background: #fff; border: 1px solid #ddd; padding: 12px; border-radius: 6px; margin-top: 8px;">
//               ${comment}
//             </div>
//           </div>
//           <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
//             This is a scheduled request made via the De Vock taxi website.
//           </div>
//         </div>
//       `,
//     })

//     return NextResponse.json({ success: true, data })
//   } catch (error) {
//     return NextResponse.json({ success: false, error })
//   }
// }

import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { luggage, date, time, from, to, name, phone, email, comment, previewPrice } = body



    // 1️⃣ Admin copy (goes to you)
    const adminEmail = await resend.emails.send({
      from: "noreply@taxidevoc.com", // replace with verified domain later
      to: "chikechrisokeke@gmail.com", // your main inbox
      subject: "🚖 New Schedule-Ride Booking Request",
      replyTo: email,
      html: `
        <h2>New Ride Booking</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Luggage:</strong> ${luggage ? "Yes" : "No"}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Pickup:</strong> ${from}</p>
        <p><strong>Drop-off:</strong> ${to}</p>
        <p><strong>Price:</strong> €${previewPrice ? Number(previewPrice).toFixed(2) : "N/A"}</p>
        <p><strong>Comment:</strong> ${comment}</p>
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
        
        <!-- Footer -->
        <tr>
          <td align="center" bgcolor="#f1f1f1" style="padding:12px; font-size:12px; color:#666666;">
            De Vock Taxi • Reliable rides, every time
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
