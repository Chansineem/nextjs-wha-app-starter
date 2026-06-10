import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import prisma from "@/lib/prisma";

// รูปสินค้าเก็บเป็นไฟล์ใน public/product-image/ และ DB เก็บเฉพาะชื่อไฟล์
// (ตรงกับที่หน้าร้านอ่านจาก /product-image/<image_name>)
const IMAGE_DIR = path.join(process.cwd(), "public", "product-image");

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export function imageExtFor(mime: string): string | null {
  return MIME_TO_EXT[mime] ?? null;
}

/** เขียนไฟล์รูปลง public/product-image แล้วคืนชื่อไฟล์ที่ปลอดภัย + ไม่ชนกัน */
export async function saveImageFile(file: File, ext: string): Promise<string> {
  const base = path
    .parse(file.name)
    .name.toLowerCase()
    .replace(/[^a-z0-9ก-๙-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const filename = `${base || "product"}-${randomUUID().slice(0, 8)}${ext}`;

  await mkdir(IMAGE_DIR, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(IMAGE_DIR, filename), bytes);
  return filename;
}

/**
 * ลบไฟล์รูปออกจาก disk เมื่อไม่มีแถวใน product_images อ้างถึงแล้วเท่านั้น
 * (กันลบไฟล์ที่สินค้าอื่นยังใช้ และไม่แตะ nopic.png ซึ่งเป็นรูป fallback)
 */
export async function deleteImageFileIfUnused(imageName: string): Promise<void> {
  const safeName = path.basename(imageName); // กัน path traversal
  if (safeName === "nopic.png") return;

  const stillUsed = await prisma.product_images.count({
    where: { image_name: safeName },
  });
  if (stillUsed > 0) return;

  await unlink(path.join(IMAGE_DIR, safeName)).catch(() => {
    // ไฟล์ไม่อยู่แล้วก็ถือว่าจบงาน
  });
}
