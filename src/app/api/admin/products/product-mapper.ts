import type { AdminProduct } from "@/types/admin";

// include ที่ทุก endpoint ของ products ใช้ร่วมกัน — รูปเรียงตาม id (รูปแรก = รูปหลักหน้าร้าน)
export const productInclude = {
  categories: { select: { name: true } },
  product_images: {
    select: { id: true, image_name: true },
    orderBy: { id: "asc" as const },
  },
};

type ProductRow = {
  id: number;
  name: string | null;
  description: string | null;
  price: unknown;
  category_id: number | null;
  categories: { name: string | null } | null;
  product_images: { id: number; image_name: string }[];
};

export function toAdminProduct(row: ProductRow): AdminProduct {
  return {
    id: row.id,
    name: row.name ?? "",
    description: row.description,
    price: Number(row.price ?? 0), // Prisma Decimal → number ก่อน serialize
    categoryId: row.category_id != null ? String(row.category_id) : "",
    categoryName: row.categories?.name ?? "ไม่ระบุหมวดหมู่",
    images: row.product_images.map((img) => ({ id: img.id, name: img.image_name })),
  };
}
