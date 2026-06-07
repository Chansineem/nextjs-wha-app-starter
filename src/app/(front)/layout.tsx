import { Suspense } from "react";
import type { Metadata } from "next";
import FrontNavbar from "@/components/front-navbar";
import "../globals.css";

export const metadata: Metadata = {
  title: "ระบบ E-Commerce COSCI",
  description: "เรียนรู้การเขียน Nex.tjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="font-sans">
      <body>
        <Suspense fallback={<div className="h-16 border-b bg-background" />}>
          <FrontNavbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
