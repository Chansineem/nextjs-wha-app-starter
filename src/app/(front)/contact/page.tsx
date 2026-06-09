import type { Metadata } from "next"
import { RiMailLine, RiPhoneLine, RiTimeLine } from "@remixicon/react"

import { Separator } from "@/components/ui/separator"
import ContactForm from "./contact-form"

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ส่งข้อความถึงเรา เรายินดีตอบทุกคำถาม",
}

// http://localhost:3000/contact
export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          ติดต่อเรา
        </h1>
        <p className="mt-3 text-muted-foreground">
          มีคำถามหรือข้อเสนอแนะ? กรอกแบบฟอร์มด้านล่าง แล้วเราจะติดต่อกลับโดยเร็วที่สุด
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12">
        {/* คอลัมน์ซ้าย — ข้อมูลติดต่อ */}
        <section aria-label="ข้อมูลติดต่อ" className="flex flex-col gap-6">
          <ul className="flex flex-col gap-5">
            <li className="flex items-start gap-3">
              <RiMailLine className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">อีเมล</p>
                <p className="text-sm text-muted-foreground">support@example.com</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <RiPhoneLine className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">เบอร์โทร</p>
                <p className="text-sm text-muted-foreground">02-123-4567</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <RiTimeLine className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium">เวลาทำการ</p>
                <p className="text-sm text-muted-foreground">
                  จันทร์ – ศุกร์ 9:00 – 18:00 น.
                </p>
              </div>
            </li>
          </ul>

          <Separator />

          <p className="text-sm leading-relaxed text-muted-foreground">
            ทีมงานของเรายินดีให้คำปรึกษาเกี่ยวกับหลักสูตรและสินค้าทุกชนิด
            หากต้องการความช่วยเหลือเร่งด่วน สามารถโทรติดต่อในเวลาทำการได้โดยตรง
          </p>
        </section>

        {/* คอลัมน์ขวา — ฟอร์ม */}
        <section aria-label="แบบฟอร์มติดต่อ">
          <ContactForm />
        </section>
      </div>
    </main>
  )
}
