import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { adminGuardResponse, requireAdmin } from "@/lib/admin-guard";
import type { RevenuePeriod, RevenuePoint } from "@/types/admin";

const PERIOD_DAYS: Record<RevenuePeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const pad = (n: number) => String(n).padStart(2, "0");
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// GET /api/admin/revenue?period=30d — รายได้/จำนวนออเดอร์รายวันสำหรับกราฟ
export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const periodParam = request.nextUrl.searchParams.get("period");
  const days =
    PERIOD_DAYS[(periodParam as RevenuePeriod) in PERIOD_DAYS ? (periodParam as RevenuePeriod) : "30d"];

  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - (days - 1),
  );

  const orders = await prisma.orders.findMany({
    where: { date: { gte: start } },
    select: { date: true, total_amount: true },
  });

  // รวมรายได้/จำนวนออเดอร์ลงถังตามวัน
  const buckets = new Map<string, { revenue: number; orders: number }>();
  for (const o of orders) {
    if (!o.date) continue;
    const key = dayKey(o.date);
    const bucket = buckets.get(key) ?? { revenue: 0, orders: 0 };
    bucket.revenue += Number(o.total_amount ?? 0);
    bucket.orders += 1;
    buckets.set(key, bucket);
  }

  // เติมทุกวันในช่วง (วันที่ไม่มีออเดอร์ = 0) เพื่อให้กราฟต่อเนื่อง
  const points: RevenuePoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const bucket = buckets.get(dayKey(d)) ?? { revenue: 0, orders: 0 };
    points.push({
      date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`,
      revenue: bucket.revenue,
      orders: bucket.orders,
    });
  }

  return Response.json(points);
}
