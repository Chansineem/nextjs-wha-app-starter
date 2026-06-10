import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { adminGuardResponse, requireAdmin } from "@/lib/admin-guard";
import type { ApiResponse } from "@/types/admin";
import { deleteImageFileIfUnused } from "../../../image-files";

function errorJson(error: string, status: number) {
  const payload: ApiResponse<never> = { success: false, error };
  return Response.json(payload, { status });
}

// DELETE /api/admin/products/[id]/images/[imageId] — ลบรูป (แถว DB + ไฟล์)
export async function DELETE(
  _request: NextRequest,
  ctx: RouteContext<"/api/admin/products/[id]/images/[imageId]">,
) {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const { id: idParam, imageId: imageIdParam } = await ctx.params;
  const productId = Number(idParam);
  const imageId = Number(imageIdParam);
  if (
    !Number.isInteger(productId) ||
    productId <= 0 ||
    !Number.isInteger(imageId) ||
    imageId <= 0
  ) {
    return errorJson("รหัสไม่ถูกต้อง", 400);
  }

  const image = await prisma.product_images.findUnique({ where: { id: imageId } });
  if (!image || image.product_id !== productId) {
    return errorJson("ไม่พบรูปนี้", 404);
  }

  await prisma.product_images.delete({ where: { id: imageId } });
  await deleteImageFileIfUnused(image.image_name);

  const payload: ApiResponse<{ id: number }> = {
    success: true,
    data: { id: imageId },
  };
  return Response.json(payload);
}
