"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AdminProduct, ApiResponse } from "@/types/admin";

interface DeleteConfirmDialogProps {
  product: AdminProduct | null; // null = ปิด dialog
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteConfirmDialog({
  product,
  onOpenChange,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!product) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as ApiResponse<{ id: number }>;
      if (!res.ok || !json.success) {
        throw new Error(json.success ? "ลบไม่สำเร็จ" : json.error);
      }
      toast.success(`ลบ "${product.name}" เรียบร้อย`);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
      onOpenChange(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AlertDialog
      open={product !== null}
      onOpenChange={(next) => !deleting && onOpenChange(next)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบสินค้า</AlertDialogTitle>
          <AlertDialogDescription>
            ต้องการลบ{" "}
            <span className="font-medium text-foreground">
              &quot;{product?.name}&quot;
            </span>{" "}
            ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            disabled={deleting}
            onClick={(e) => {
              // จัดการ fetch เอง — กัน dialog ปิดก่อนรู้ผล
              e.preventDefault();
              handleDelete();
            }}
            className={cn(
              buttonVariants({ variant: "destructive" }),
              "bg-destructive text-white hover:bg-destructive/90",
            )}
          >
            {deleting && <Spinner data-icon="inline-start" />}
            ลบสินค้า
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
