import prisma from "@/lib/prisma";
import { adminGuardResponse, requireAdmin } from "@/lib/admin-guard";
import type { AdminStats } from "@/types/admin";

// GET /api/admin/stats — KPI สำหรับการ์ดด้านบนของ dashboard
export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [todayAgg, todayOrders, pendingOrders, totalProducts, totalUsers] =
    await Promise.all([
      prisma.orders.aggregate({
        _sum: { total_amount: true },
        where: { date: { gte: startOfToday } },
      }),
      prisma.orders.count({ where: { date: { gte: startOfToday } } }),
      prisma.orders.count({ where: { status: "processing" } }),
      prisma.products.count(),
      prisma.user.count(),
    ]);

  const stats: AdminStats = {
    todaySales: Number(todayAgg._sum.total_amount ?? 0),
    todayOrders,
    pendingOrders,
    totalProducts,
    totalUsers,
  };

  return Response.json(stats);
}
