import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { adminGuardResponse, requireAdmin } from "@/lib/admin-guard";
import { productSchema } from "@/lib/validations/product";
import type { AdminProduct, ApiResponse } from "@/types/admin";
import { deleteImageFileIfUnused } from "../image-files";
import { productInclude, toAdminProduct } from "../product-mapper";

function errorJson(error: string, status: number) {
  const payload: ApiResponse<never> = { success: false, error };
  return Response.json(payload, { status });
}

async function parseId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const numeric = Number(id);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
}

// PUT /api/admin/products/[id] — แก้ไขสินค้า
export async function PUT(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/products/[id]">,
) {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const id = await parseId(ctx.params);
  if (id === null) return errorJson("รหัสสินค้าไม่ถูกต้อง", 400);

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return errorJson(parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง", 400);
  }

  const exists = await prisma.products.findUnique({ where: { id } });
  if (!exists) return errorJson("ไม่พบสินค้านี้", 404);

  const { name, description, price, categoryId } = parsed.data;
  const row = await prisma.products.update({
    where: { id },
    data: {
      name,
      description: description || null,
      price,
      category_id: Number(categoryId),
    },
    include: productInclude,
  });

  const payload: ApiResponse<AdminProduct> = {
    success: true,
    data: toAdminProduct(row),
  };
  return Response.json(payload);
}

// DELETE /api/admin/products/[id] — ลบสินค้า (กันลบถ้ามีออเดอร์อ้างถึง)
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/products/[id]">,
) {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const id = await parseId(ctx.params);
  if (id === null) return errorJson("รหัสสินค้าไม่ถูกต้อง", 400);

  const exists = await prisma.products.findUnique({
    where: { id },
    include: { product_images: { select: { image_name: true } } },
  });
  if (!exists) return errorJson("ไม่พบสินค้านี้", 404);

  const usedCount = await prisma.order_items.count({ where: { product_id: id } });
  if (usedCount > 0) {
    return errorJson(
      `ลบไม่ได้ — สินค้านี้ถูกใช้ในคำสั่งซื้อ ${usedCount} รายการ`,
      409,
    );
  }

  await prisma.products.delete({ where: { id } });

  // แถวรูปถูก cascade ใน DB แล้ว — ตามลบไฟล์บน disk ที่ไม่มีใครใช้ต่อ
  for (const img of exists.product_images) {
    await deleteImageFileIfUnused(img.image_name);
  }

  const payload: ApiResponse<{ id: number }> = { success: true, data: { id } };
  return Response.json(payload);
}
