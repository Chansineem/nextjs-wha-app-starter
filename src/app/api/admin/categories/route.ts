import prisma from "@/lib/prisma";
import { adminGuardResponse, requireAdmin } from "@/lib/admin-guard";
import type { ApiResponse, CategoryOption } from "@/types/admin";

// GET /api/admin/categories — ตัวเลือกหมวดหมู่สำหรับ dropdown
export async function GET() {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const rows = await prisma.categories.findMany({ orderBy: { name: "asc" } });

  const payload: ApiResponse<CategoryOption[]> = {
    success: true,
    data: rows.map((row) => ({ id: String(row.id), name: row.name ?? "ไม่ระบุชื่อ" })),
  };
  return Response.json(payload);
}
