import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ProductsClient } from "./products-client";

// gate ด้วย role ฝั่ง server เท่านั้น — ข้อมูลทั้งหมดให้ ProductsClient fetch เอง
export default async function AdminProductsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  return <ProductsClient />;
}
