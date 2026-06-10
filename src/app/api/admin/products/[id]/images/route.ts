import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { adminGuardResponse, requireAdmin } from "@/lib/admin-guard";
import type { AdminProductImage, ApiResponse } from "@/types/admin";
import {
  imageExtFor,
  MAX_IMAGE_BYTES,
  saveImageFile,
} from "../../image-files";

function errorJson(error: string, status: number) {
  const payload: ApiResponse<never> = { success: false, error };
  return Response.json(payload, { status });
}

// POST /api/admin/products/[id]/images — อัปโหลดรูป (multipart, รับหลายไฟล์)
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/admin/products/[id]/images">,
) {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const { id: idParam } = await ctx.params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return errorJson("รหัสสินค้าไม่ถูกต้อง", 400);

  const product = await prisma.products.findUnique({ where: { id } });
  if (!product) return errorJson("ไม่พบสินค้านี้", 404);

  const formData = await request.formData().catch(() => null);
  if (!formData) return errorJson("รูปแบบข้อมูลไม่ถูกต้อง", 400);

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return errorJson("กรุณาเลือกไฟล์รูป", 400);

  // ตรวจทุกไฟล์ก่อนเริ่มเขียน — จะได้ไม่อัปโหลดสำเร็จครึ่งเดียว
  for (const file of files) {
    if (!imageExtFor(file.type)) {
      return errorJson(`"${file.name}" ไม่ใช่ไฟล์รูปที่รองรับ (JPG, PNG, WebP)`, 400);
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return errorJson(`"${file.name}" ใหญ่เกิน 5MB`, 400);
    }
  }

  const created: AdminProductImage[] = [];
  for (const file of files) {
    const filename = await saveImageFile(file, imageExtFor(file.type)!);
    const row = await prisma.product_images.create({
      data: { product_id: id, image_name: filename },
    });
    created.push({ id: row.id, name: row.image_name });
  }

  const payload: ApiResponse<AdminProductImage[]> = { success: true, data: created };
  return Response.json(payload, { status: 201 });
}
