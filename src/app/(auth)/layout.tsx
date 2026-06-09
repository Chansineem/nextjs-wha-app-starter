import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Red Broadcast — Roboto everywhere, Roboto Mono for code
const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ระบบ ล็อกอิน",
  description: "เรียนรู้การเขียน Nex.tjs",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
