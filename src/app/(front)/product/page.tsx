import FeaturesProduct from "@/components/features-product";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
  description: "รายการสินค้าจากฐานข้อมูล eCommerce",
};

type SearchParams = Promise<{ q?: string; cat?: string }>;

// http://localhost:3000/product
export default async function ProductPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await connection(); // signals this is a dynamic route
  const { q, cat } = await searchParams;

  const products = await prisma.products.findMany({
    include: {
      categories: true,
      product_images: {
        orderBy: {
          id: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name ?? "ไม่ระบุชื่อสินค้า",
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    categoryName: product.categories?.name ?? "ไม่ระบุหมวดหมู่",
    imageName: product.product_images[0]?.image_name ?? null,
  }));

  const categories = [...new Set(serializedProducts.map((p) => p.categoryName))];

  const keyword = q?.trim().toLowerCase();
  const filtered = serializedProducts.filter((p) => {
    const matchesCat = !cat || p.categoryName === cat;
    const matchesQuery =
      !keyword ||
      p.name.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword);
    return matchesCat && matchesQuery;
  });

  return (
    <main>
      <FeaturesProduct
        products={filtered}
        categories={categories}
        activeCat={cat}
        query={q?.trim() || undefined}
      />
    </main>
  );
}
