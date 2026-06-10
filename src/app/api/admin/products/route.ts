import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { adminGuardResponse, requireAdmin } from "@/lib/admin-guard";
import { productSchema } from "@/lib/validations/product";
import type { AdminProduct, AdminProductsData, ApiResponse } from "@/types/admin";
import { productInclude, toAdminProduct } from "./product-mapper";

const PAGE_SIZE = 10;

// GET /api/admin/products?search=&page= — รายการสินค้า + ค้นหา + แบ่งหน้า
export async function GET(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const search = request.nextUrl.searchParams.get("search")?.trim() ?? "";
  const pageParam = Number(request.nextUrl.searchParams.get("page"));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const where = search ? { name: { contains: search } } : {};

  const [rows, total] = await Promise.all([
    prisma.products.findMany({
      where,
      include: productInclude,
      orderBy: { id: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.products.count({ where }),
  ]);

  const payload: ApiResponse<AdminProductsData> = {
    success: true,
    data: { products: rows.map(toAdminProduct), total, page, pageSize: PAGE_SIZE },
  };
  return Response.json(payload);
}

// POST /api/admin/products — สร้างสินค้าใหม่
export async function POST(request: NextRequest) {
  const guard = await requireAdmin();
  if (guard.error) return adminGuardResponse(guard);

  const body = await request.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    const payload: ApiResponse<never> = {
      success: false,
      error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง",
    };
    return Response.json(payload, { status: 400 });
  }

  const { name, description, price, categoryId } = parsed.data;
  const row = await prisma.products.create({
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
  return Response.json(payload, { status: 201 });
}
