import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RiArrowRightLine,
  RiFireFill,
  RiPlayCircleFill,
  RiShoppingBag3Line,
} from "@remixicon/react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* subtle brand glow, kept faint so content stays dominant */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground">
          <RiFireFill className="size-4 text-brand" />
          แพลตฟอร์มเรียนรู้ &amp; ช้อปไอที อันดับ 1
        </span>

        <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
          เรียนเขียนโปรแกรม{" "}
          <span className="text-brand">ดูได้ทุกที่</span> ทุกเวลา
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          คอร์สออนไลน์คุณภาพและสินค้าไอทีครบจบในที่เดียว เริ่มต้นได้ทันที
          ไม่ต้องตั้งค่าอะไรให้ยุ่งยาก
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/course">
              <RiPlayCircleFill /> ดูคอร์สทั้งหมด
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/product">
              <RiShoppingBag3Line /> เลือกซื้อสินค้า
            </Link>
          </Button>
        </div>

        <Link
          href="/about"
          className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-link hover:underline"
        >
          เกี่ยวกับเรา <RiArrowRightLine className="size-4" />
        </Link>
      </div>
    </section>
  );
}
