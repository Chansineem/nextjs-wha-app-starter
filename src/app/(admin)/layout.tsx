import type { Metadata } from "next";
import Link from "next/link";
import { Roboto, Roboto_Mono } from "next/font/google";
import { RiArrowLeftLine } from "@remixicon/react";

import { cn } from "@/lib/utils";
import { AdminNav } from "@/components/admin/admin-nav";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Admin — ระบบ E-Commerce",
  description: "แดชบอร์ดผู้ดูแลระบบ",
};

// route group (admin) เป็น root layout ของตัวเอง จึงต้องมี <html>/<body> เอง
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={cn(roboto.variable, robotoMono.variable, "font-sans")}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-muted/30">
            <header className="border-b border-border bg-background">
              <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
                <div className="flex items-center gap-6">
                  <span className="font-heading text-lg font-semibold">
                    ผู้ดูแลระบบ
                  </span>
                  <AdminNav />
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <RiArrowLeftLine className="size-4" />
                  กลับหน้าร้าน
                </Link>
              </div>
            </header>
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
