import { NextResponse } from "next/server"
import { Resend } from "resend"

import { contactSchema } from "@/lib/validations/contact"

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

// POST /api/contact — public (no auth guard): validate + ส่ง email ผ่าน Resend
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "รูปแบบข้อมูลไม่ถูกต้อง" },
      { status: 400 },
    )
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: firstIssue?.message ?? "ข้อมูลไม่ถูกต้อง" },
      { status: 400 },
    )
  }

  const { name, email, message } = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_RECEIVER_EMAIL
  if (!apiKey || !to) {
    console.error("Contact form: missing RESEND_API_KEY or CONTACT_RECEIVER_EMAIL")
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "ระบบส่งอีเมลยังไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลัง" },
      { status: 500 },
    )
  }

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
    to,
    replyTo: email,
    subject: `ข้อความติดต่อใหม่จาก ${name}`,
    text: `ชื่อ: ${name}\nEmail: ${email}\n\nข้อความ:\n${message}`,
  })

  if (error) {
    console.error("Contact form: Resend error", error)
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 502 },
    )
  }

  return NextResponse.json<ApiResponse<{ id: string | null }>>({
    success: true,
    data: { id: data?.id ?? null },
  })
}
