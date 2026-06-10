"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  RiAddLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiImageLine,
  RiInboxLine,
  RiPencilLine,
  RiRefreshLine,
  RiSearchLine,
} from "@remixicon/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTHB } from "@/lib/admin-format";
import type {
  AdminProduct,
  AdminProductsData,
  ApiResponse,
  CategoryOption,
} from "@/types/admin";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { ProductFormModal } from "./product-form-modal";
import { ProductImagesModal } from "./product-images-modal";

const IMAGE_BASE = "/product-image";

export function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [inputVal, setInputVal] = useState(""); // ค่าดิบจากช่องค้นหา
  const [search, setSearch] = useState(""); // ค่า debounce แล้ว → trigger fetch

  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null); // null = create
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [imagesTarget, setImagesTarget] = useState<AdminProduct | null>(null);

  // silent = refetch เบื้องหลัง (เช่นหลังแก้รูป) ไม่ต้องกระพริบ skeleton
  const fetchProducts = useCallback(async (q: string, p: number, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (q) params.set("search", q);
      const res = await fetch(`/api/admin/products?${params}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as ApiResponse<AdminProductsData>;
      if (!res.ok || !json.success) {
        throw new Error(json.success ? String(res.status) : json.error);
      }
      setProducts(json.data.products);
      setTotal(json.data.total);
      setPageSize(json.data.pageSize);
    } catch {
      setError("ไม่สามารถโหลดรายการสินค้าได้");
    } finally {
      setLoading(false);
    }
  }, []);

  // debounce: พิมพ์หยุด 300ms ค่อยยิงค้นหา + รีเซ็ตกลับหน้า 1
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [inputVal]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts(search, page);
  }, [search, page, fetchProducts]);

  // โหลดหมวดหมู่ครั้งเดียวตอน mount (ใช้ใน dropdown ของ form)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/categories", { cache: "no-store" })
      .then((res) => res.json() as Promise<ApiResponse<CategoryOption[]>>)
      .then((json) => {
        if (!cancelled && json.success) setCategories(json.data);
      })
      .catch(() => {
        // ปล่อยให้ dropdown ว่าง — form จะยังเปิดได้และ validate แจ้งเอง
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const openCreate = () => {
    setEditProduct(null);
    setFormOpen(true);
  };
  const openEdit = (product: AdminProduct) => {
    setEditProduct(product);
    setFormOpen(true);
  };

  // หลัง save/delete สำเร็จ → ปิด modal แล้ว refetch หน้าปัจจุบัน
  const handleSaved = () => {
    setFormOpen(false);
    fetchProducts(search, page);
  };
  const handleDeleted = () => {
    setDeleteTarget(null);
    // ถ้าลบแถวสุดท้ายของหน้า ให้ถอยกลับหน้าก่อน
    const lastPageAfterDelete = Math.max(1, Math.ceil((total - 1) / pageSize));
    const nextPage = Math.min(page, lastPageAfterDelete);
    if (nextPage !== page) setPage(nextPage);
    else fetchProducts(search, page);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">จัดการสินค้า</h1>
          <p className="text-sm text-muted-foreground">
            สินค้าทั้งหมด {total.toLocaleString("th-TH")} รายการ
          </p>
        </div>
        <Button onClick={openCreate}>
          <RiAddLine data-icon="inline-start" />
          เพิ่มสินค้า
        </Button>
      </div>

      <div className="relative max-w-sm">
        <RiSearchLine className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="ค้นหาชื่อสินค้า..."
          className="pl-9"
          aria-label="ค้นหาสินค้า"
        />
      </div>

      <Card>
        <CardContent>
          {error ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <RiErrorWarningLine className="size-8 text-destructive" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchProducts(search, page)}
              >
                <RiRefreshLine />
                ลองใหม่
              </Button>
            </div>
          ) : loading ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-11 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <RiInboxLine className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {search
                  ? `ไม่พบสินค้าที่ตรงกับ "${search}"`
                  : "ยังไม่มีสินค้า — กดปุ่ม เพิ่มสินค้า เพื่อเริ่มต้น"}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14">#</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead className="text-right">ราคา</TableHead>
                    <TableHead className="w-32 text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-muted-foreground">
                        {product.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              product.images[0]
                                ? `${IMAGE_BASE}/${product.images[0].name}`
                                : `${IMAGE_BASE}/nopic.png`
                            }
                            alt=""
                            width={40}
                            height={40}
                            className="size-10 shrink-0 rounded-xl bg-muted object-cover ring-1 ring-foreground/5"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{product.name}</p>
                            {product.description ? (
                              <p className="max-w-md truncate text-xs text-muted-foreground">
                                {product.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.categoryName}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatTHB(product.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`จัดการรูป ${product.name} (${product.images.length} รูป)`}
                            onClick={() => setImagesTarget(product)}
                          >
                            <RiImageLine />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`แก้ไข ${product.name}`}
                            onClick={() => openEdit(product)}
                          >
                            <RiPencilLine />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`ลบ ${product.name}`}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => setDeleteTarget(product)}
                          >
                            <RiDeleteBinLine />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  หน้า {page} จาก {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <RiArrowLeftSLine data-icon="inline-start" />
                    ก่อนหน้า
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    ถัดไป
                    <RiArrowRightSLine data-icon="inline-end" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        onSuccess={handleSaved}
      />
      <DeleteConfirmDialog
        product={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onSuccess={handleDeleted}
      />
      <ProductImagesModal
        product={imagesTarget}
        onOpenChange={(open) => {
          if (!open) setImagesTarget(null);
        }}
        onChanged={() => fetchProducts(search, page, true)}
      />
    </main>
  );
}
