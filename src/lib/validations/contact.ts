import * as z from "zod"

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อ")
    .max(100, "ชื่อต้องไม่เกิน 100 ตัวอักษร"),
  email: z
    .string()
    .min(1, "กรุณากรอก Email")
    .email("รูปแบบ Email ไม่ถูกต้อง"),
  message: z
    .string()
    .min(10, "ข้อความต้องมีอย่างน้อย 10 ตัวอักษร")
    .max(2000, "ข้อความต้องไม่เกิน 2000 ตัวอักษร"),
})

export type ContactFormValues = z.infer<typeof contactSchema>
