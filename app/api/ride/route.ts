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
      from: "onboarding@resend.dev", // replace with verified domain later
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
      from: "onboarding@resend.dev", // same verified domain
      to: [email], // passenger’s email from the form
      subject: "✅ Your Ride Has Been Scheduled",
      html: `
        <h2>Thank you for booking with De Vock Taxi!</h2>
        <p>Hello ${name},</p>
        <p>Your ride has been scheduled successfully. Here are the details:</p>
        <ul>
          <li><strong>Hi:</strong> ${name}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Pickup:</strong> ${from}</li>
          <li><strong>Drop-off:</strong> ${to}</li>
          <li><strong>Price:</strong> €${previewPrice ? Number(previewPrice).toFixed(2) : "N/A"}</li>
        </ul>
        <p>We’ll be in touch if anything changes. Safe travels!</p>
      `,
    })

    return NextResponse.json({ success: true, adminEmail, passengerEmail })
  } catch (error) {
    return NextResponse.json({ success: false, error })
  }
}
