// Types สำหรับ Admin Dashboard (ADMIN-CLIENT-01)
// ใช้ร่วมกันระหว่าง Route Handlers (/api/admin/*) และ DashboardClient

/** ช่วงเวลาสำหรับกราฟรายได้ */
export type RevenuePeriod = "7d" | "30d" | "90d";

/** สถานะคำสั่งซื้อ (ตรงกับ enum orders_status ใน DB) */
export type OrderStatus = "processing" | "received" | "delivered";

/** GET /api/admin/stats — KPI การ์ดด้านบน */
export interface AdminStats {
  todaySales: number; // ยอดขายวันนี้ (บาท)
  todayOrders: number; // จำนวนออเดอร์วันนี้
  pendingOrders: number; // ออเดอร์ที่ยังไม่ส่ง (processing)
  totalProducts: number; // จำนวนสินค้าทั้งหมด
  totalUsers: number; // จำนวนผู้ใช้ทั้งหมด
}

/** GET /api/admin/revenue — จุดข้อมูล 1 วันบนกราฟ */
export interface RevenuePoint {
  date: string; // 'DD/MM'
  revenue: number; // รายได้รวมของวันนั้น (บาท)
  orders: number; // จำนวนออเดอร์ของวันนั้น
}

/** GET /api/admin/orders — 1 แถวในตารางออเดอร์ล่าสุด */
export interface AdminOrderItem {
  id: number;
  customerName: string;
  total: number;
  status: OrderStatus;
  date: string; // ISO string
}

/** payload ของ GET /api/admin/orders */
export interface AdminOrdersResponse {
  orders: AdminOrderItem[];
  total: number;
}

// ---------- Product CRUD (ADMIN-CLIENT-02) ----------

/** รูปแบบ response มาตรฐานของ API ฝั่ง admin CRUD */
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/** รูปสินค้า 1 รูป — name คือชื่อไฟล์ใน public/product-image/ */
export interface AdminProductImage {
  id: number;
  name: string;
}

/** 1 แถวสินค้าในหน้า admin (id เป็น number ตาม DB, categoryId เป็น string เพื่อใช้กับ Select) */
export interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  categoryName: string;
  images: AdminProductImage[];
}

/** ตัวเลือกหมวดหมู่ใน dropdown */
export interface CategoryOption {
  id: string;
  name: string;
}

/** payload ของ GET /api/admin/products */
export interface AdminProductsData {
  products: AdminProduct[];
  total: number;
  page: number;
  pageSize: number;
}
