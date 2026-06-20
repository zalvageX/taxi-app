import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, message } = body

    const data = await resend.emails.send({
      from: "noreply@taxidevoc.com", // replace with your verified domain later
      to: "taxidevoc@gmailcom",
      subject: "🚖 New Contact Form Submission",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
          <div style="background: #dc2626; color: white; padding: 16px; text-align: center;">
            <h2 style="margin: 0;">De Voc Taxi</h2>
            <p style="margin: 0;">Hey De Vock, you just recieved a message</p>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #fff; border: 1px solid #ddd; padding: 12px; border-radius: 6px; margin-top: 8px;">
              ${message}
            </div>
          </div>
          <div style="background: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280;">
            This message was sent via your website contact form.
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error })
  }
}
