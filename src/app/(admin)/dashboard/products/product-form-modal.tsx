"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";
import type { AdminProduct, ApiResponse, CategoryOption } from "@/types/admin";

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  // ค่าเริ่มต้นเป็นช่องว่าง (runtime เป็น string) — zod coerce เป็น number ตอน validate
  price: "" as unknown as number,
  categoryId: "",
};

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AdminProduct | null; // null = โหมดสร้างใหม่
  categories: CategoryOption[];
  onSuccess: () => void;
}

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  categories,
  onSuccess,
}: ProductFormModalProps) {
  const isEdit = product !== null;

  const form = useForm<ProductFormValues>({
    // cast เพราะ input ของ coerce schema เป็น unknown — runtime ทำงานถูกต้อง
    resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
    defaultValues,
  });

  // reset ค่าใน form ทุกครั้งที่เปิด modal หรือสลับสินค้าที่แก้ไข
  useEffect(() => {
    if (open) {
      form.reset(
        product
          ? {
              name: product.name,
              description: product.description ?? "",
              price: product.price,
              categoryId: product.categoryId,
            }
          : defaultValues,
      );
    }
  }, [open, product, form]);

  async function onSubmit(values: ProductFormValues) {
    try {
      const res = await fetch(
        isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );
      const json = (await res.json()) as ApiResponse<AdminProduct>;
      if (!res.ok || !json.success) {
        throw new Error(json.success ? "บันทึกไม่สำเร็จ" : json.error);
      }
      toast.success(isEdit ? "แก้ไขสินค้าเรียบร้อย" : "เพิ่มสินค้าเรียบร้อย");
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "บันทึกไม่สำเร็จ");
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `แก้ไขข้อมูลของ "${product.name}"`
              : "กรอกข้อมูลสินค้าใหม่ให้ครบถ้วน"}
          </DialogDescription>
        </DialogHeader>

        <form id="form-product" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-name">ชื่อสินค้า</FieldLabel>
                  <Input
                    {...field}
                    id="product-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="เช่น เสื้อยืดสีขาว"
                    disabled={submitting}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-category">หมวดหมู่</FieldLabel>
                  {/* shadcn Select ไม่ใช่ native <select> — ต้องผูกผ่าน field.onChange */}
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={submitting}
                  >
                    <SelectTrigger
                      id="product-category"
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                    >
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-price">ราคา (บาท)</FieldLabel>
                  <Input
                    {...field}
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    aria-invalid={fieldState.invalid}
                    placeholder="0.00"
                    disabled={submitting}
                    value={field.value ?? ""}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-description">
                    คำอธิบาย (ไม่บังคับ)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="product-description"
                    rows={3}
                    aria-invalid={fieldState.invalid}
                    placeholder="รายละเอียดสินค้า..."
                    disabled={submitting}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            ยกเลิก
          </Button>
          <Button type="submit" form="form-product" disabled={submitting}>
            {submitting && <Spinner data-icon="inline-start" />}
            {isEdit ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
