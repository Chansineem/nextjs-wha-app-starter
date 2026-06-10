import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { adminGuardResponse, requireAdmin } from "@/lib/admin-guard";
import type { AdminOrderItem, AdminOrdersResponse, OrderStatus } from "@/types/admin";

// GET /api/admin/orders?limit=5 — ออเดอร์ล่าสุด + จำนวนทั้งหมด
export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const limitParam = Number(request.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.trunc(limitParam), 1), 50)
    : 5;

  const [rows, total] = await Promise.all([
    prisma.orders.findMany({
      orderBy: { date: "desc" },
      take: limit,
      include: { customers: { select: { name: true } } },
    }),
    prisma.orders.count(),
  ]);

  const orders: AdminOrderItem[] = rows.map((row) => ({
    id: row.id,
    customerName: row.customers?.name ?? "ไม่ระบุชื่อ",
    total: Number(row.total_amount ?? 0),
    status: (row.status ?? "processing") as OrderStatus,
    date: (row.date ?? new Date()).toISOString(),
  }));

  const payload: AdminOrdersResponse = { orders, total };
  return Response.json(payload);
}
