"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RiDeleteBinLine, RiImageAddLine, RiImageLine } from "@remixicon/react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import type { AdminProduct, AdminProductImage, ApiResponse } from "@/types/admin";

const IMAGE_BASE = "/product-image";

interface ProductImagesModalProps {
  product: AdminProduct | null; // null = ปิด modal
  onOpenChange: (open: boolean) => void;
  onChanged: () => void; // ให้ parent refetch list (thumbnail ในตารางจะได้อัปเดต)
}

export function ProductImagesModal({
  product,
  onOpenChange,
  onChanged,
}: ProductImagesModalProps) {
  const [images, setImages] = useState<AdminProductImage[]>([]);
  const [syncedProductId, setSyncedProductId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // sync รูปจาก product ตอนเปิด/สลับสินค้า — ปรับ state ระหว่าง render
  // (ตาม pattern "adjusting state when props change" ของ React แทนการใช้ effect)
  if (product && product.id !== syncedProductId) {
    setSyncedProductId(product.id);
    setImages(product.images);
  } else if (!product && syncedProductId !== null) {
    setSyncedProductId(null);
  }

  const busy = uploading || deletingId !== null;

  async function handleUpload(fileList: FileList | null) {
    if (!product || !fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of Array.from(fileList)) formData.append("files", file);

      const res = await fetch(`/api/admin/products/${product.id}/images`, {
        method: "POST",
        body: formData,
      });
      const json = (await res.json()) as ApiResponse<AdminProductImage[]>;
      if (!res.ok || !json.success) {
        throw new Error(json.success ? "อัปโหลดไม่สำเร็จ" : json.error);
      }
      setImages((prev) => [...prev, ...json.data]);
      toast.success(`อัปโหลดรูปสำเร็จ ${json.data.length} รูป`);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(image: AdminProductImage) {
    if (!product) return;
    setDeletingId(image.id);
    try {
      const res = await fetch(
        `/api/admin/products/${product.id}/images/${image.id}`,
        { method: "DELETE" },
      );
      const json = (await res.json()) as ApiResponse<{ id: number }>;
      if (!res.ok || !json.success) {
        throw new Error(json.success ? "ลบรูปไม่สำเร็จ" : json.error);
      }
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      toast.success("ลบรูปเรียบร้อย");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ลบรูปไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Dialog
      open={product !== null}
      onOpenChange={(next) => !busy && onOpenChange(next)}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>รูปสินค้า</DialogTitle>
          <DialogDescription>
            จัดการรูปของ &quot;{product?.name}&quot; — รูปแรกคือรูปหลักที่แสดงหน้าร้าน
          </DialogDescription>
        </DialogHeader>

        {images.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-border py-10 text-center">
            <RiImageLine className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              ยังไม่มีรูป — หน้าร้านจะแสดงรูป fallback
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5"
              >
                <Image
                  src={`${IMAGE_BASE}/${image.name}`}
                  alt={image.name}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
                {index === 0 && (
                  <Badge className="absolute top-1.5 left-1.5 border-transparent bg-emerald-500/90 text-white">
                    รูปหลัก
                  </Badge>
                )}
                <Button
                  variant="destructive"
                  size="icon-xs"
                  aria-label={`ลบรูป ${image.name}`}
                  disabled={busy}
                  onClick={() => handleDelete(image)}
                  className="absolute top-1.5 right-1.5 bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-destructive focus-visible:opacity-100"
                >
                  {deletingId === image.id ? <Spinner /> : <RiDeleteBinLine />}
                </Button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => handleUpload(e.target.files)}
        />

        <DialogFooter className="sm:justify-between">
          <p className="self-center text-xs text-muted-foreground">
            JPG / PNG / WebP ไม่เกิน 5MB ต่อรูป
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => onOpenChange(false)}
            >
              ปิด
            </Button>
            <Button
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <RiImageAddLine data-icon="inline-start" />
              )}
              อัปโหลดรูป
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
