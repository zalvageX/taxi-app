// import { NextResponse } from "next/server"
// import Stripe from "stripe"
// import { Resend } from "resend"

// export const runtime = "nodejs"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// const resend = new Resend(process.env.RESEND_API_KEY!)

// export async function POST(req: Request): Promise {
// try {
// const body: {
// name: string
// email: string
// phone: string
// pickup: string
// dropoff: string
// date: string
// time: string
// price: string | number
// distance?: number
// duration?: number
// } = await req.json()

// const {
//   name,
//   email,
//   phone,
//   pickup,
//   dropoff,
//   date,
//   time,
//   price,
//   distance,
//   duration,
// } = body

// const amount = Math.round(Number(price) * 100)

// if (!amount || isNaN(amount)) {
//   throw new Error("Invalid price")
// }

// // 💳 Create Payment Link (UNCHANGED CORE)
// const paymentLink = await stripe.paymentLinks.create({
//   line_items: [
//     {
//       price_data: {
//         currency: "eur",
//         product_data: {
//           name: `Taxi Ride: ${pickup} to ${dropoff}`,
//         },
//         unit_amount: amount,
//       },
//       quantity: 1,
//     },
//   ],
//   metadata: {
//     name: String(name),
//     email: String(email),
//     pickup: String(pickup),
//     dropoff: String(dropoff),
//     date: String(date),
//     time: String(time),
//     price: String(price),
//   },
// } as any)

// // 📩 ADMIN EMAIL (NEW)
// await resend.emails.send({
//   from: "noreply@taxidevoc.com",
//   to: "taxidevoc@gmail.com",
//   subject: "🚗 New Ride Booking",
//   html: `
//     <div style="font-family: Arial; padding:20px;">
//       <h2>🚗 New Ride Booking</h2>

//       <p><strong>Name:</strong> ${name}</p>
//       <p><strong>Phone:</strong> ${phone}</p>
//       <p><strong>Email:</strong> ${email}</p>
//       <p><strong>Pickup:</strong> ${pickup}</p>
//       <p><strong>Dropoff:</strong> ${dropoff}</p>
//       <p><strong>Date:</strong> ${date}</p>
//       <p><strong>Time:</strong> ${time}</p>

//       ${
//         distance
//           ? `<p><strong>Distance:</strong> ${distance} km</p>`
//           : ""
//       }
//       ${
//         duration
//           ? `<p><strong>Duration:</strong> ${duration} mins</p>`
//           : ""
//       }

//       <p><strong>Price:</strong> €${price}</p>

//       <p style="margin-top:10px;">
//         <strong>Payment Link:</strong><br/>
//         <a href="${paymentLink.url}">${paymentLink.url}</a>
//       </p>
//     </div>
//   `,
// })

// // 📩 CUSTOMER EMAIL (UPGRADED)
// await resend.emails.send({
//   from: "noreply@taxidevoc.com",
//   to: [email],
//   subject: "💳 Complete Your Ride Payment",
//   html: `
//     <div style="font-family: Arial; padding:20px;">
//       <h2>🚗 Ride Booked</h2>

//       <p>Hello ${name},</p>
//       <p>Your ride has been scheduled successfully.</p>

//       <p><strong>Pickup:</strong> ${pickup}</p>
//       <p><strong>Dropoff:</strong> ${dropoff}</p>
//       <p><strong>Date:</strong> ${date}</p>
//       <p><strong>Time:</strong> ${time}</p>

//       <p><strong>Amount:</strong> €${price}</p>

//       <div style="margin-top:20px;">
//         <a href="${paymentLink.url}" 
//            style="background:#0ea5e9; color:white; padding:12px 20px; text-decoration:none; border-radius:6px;">
//            💳 Pay Now
//         </a>
//       </div>

//       <p style="margin-top:20px;">
//         Please complete your payment before your ride.
//       </p>
//     </div>
//   `,
// })

// return NextResponse.json({ success: true })

// } catch (err: any) {
// console.error("❌ ERROR:", err.message)

// return NextResponse.json(
//   { error: err.message },
//   { status: 500 }
// )

// }

// return NextResponse.json({ error: "Unexpected flow" }, { status: 500 })
// }