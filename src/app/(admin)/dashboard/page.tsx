import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

// page.tsx ทำหน้าที่เดียว: ตรวจ role ฝั่ง server แล้ว gate การเข้าถึง
// ไม่ดึงข้อมูล dashboard ที่นี่ — ปล่อยให้ DashboardClient fetch เองทั้งหมด
export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  return <DashboardClient />;
}
