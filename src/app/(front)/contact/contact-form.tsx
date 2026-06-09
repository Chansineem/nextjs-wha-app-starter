"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { RiCheckboxCircleFill } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  contactSchema,
  type ContactFormValues,
} from "@/lib/validations/contact"

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export default function ContactForm() {
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        const json: ApiResponse<unknown> = await res.json()

        if (!res.ok || !json.success) {
          toast.error(
            json.success === false
              ? json.error
              : "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
          )
          return
        }

        form.reset()
        setIsSuccess(true)
      } catch {
        toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง")
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <RiCheckboxCircleFill className="size-14 text-primary" />
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">ส่งข้อความเรียบร้อยแล้ว</h2>
          <p className="text-muted-foreground">
            ขอบคุณที่ติดต่อเรา ทีมงานจะตอบกลับโดยเร็วที่สุด
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsSuccess(false)}>
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    )
  }

  return (
    <form id="form-contact" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-name">ชื่อ</FieldLabel>
              <Input
                {...field}
                id="form-contact-name"
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกชื่อของคุณ"
                autoComplete="name"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-contact-email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@email.com"
                autoComplete="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-message">ข้อความ</FieldLabel>
              <Textarea
                {...field}
                id="form-contact-message"
                rows={5}
                aria-invalid={fieldState.invalid}
                placeholder="พิมพ์ข้อความที่ต้องการ..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" form="form-contact" className="w-full" disabled={isPending}>
          {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
        </Button>
      </FieldGroup>
    </form>
  )
}
