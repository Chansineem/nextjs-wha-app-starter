import * as z from "zod";

// schema เดียวใช้ทั้ง zodResolver ฝั่ง form และ safeParse ฝั่ง Route Handler
// price ใช้ coerce เพราะ input ฝั่ง form ส่งมาเป็น string
export const productSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อสินค้า").max(255, "ชื่อสินค้ายาวเกิน 255 ตัวอักษร"),
  description: z.string().max(2000, "คำอธิบายยาวเกิน 2000 ตัวอักษร").optional().or(z.literal("")),
  price: z.coerce.number<number>("กรุณากรอกราคาเป็นตัวเลข").positive("ราคาต้องมากกว่า 0"),
  categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
