import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTHB, formatThaiDate } from "@/lib/admin-format";
import type { AdminOrderItem, OrderStatus } from "@/types/admin";

// สีตามความหมายของสถานะ ไม่อิงสีธีม:
// เหลือง = ยังไม่จบ รอจัดการ, ฟ้า = คืบหน้าแล้ว, เขียว = สำเร็จ
const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  processing: {
    label: "กำลังดำเนินการ",
    className:
      "border-transparent bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  },
  received: {
    label: "รับสินค้าแล้ว",
    className:
      "border-transparent bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400",
  },
  delivered: {
    label: "จัดส่งแล้ว",
    className:
      "border-transparent bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  },
};

export function RecentOrdersTable({ orders }: { orders: AdminOrderItem[] }) {
  if (orders.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        ยังไม่มีคำสั่งซื้อ
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead>วันที่</TableHead>
          <TableHead className="text-right">ยอดรวม</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const meta = STATUS_META[order.status] ?? STATUS_META.processing;
          return (
            <TableRow key={order.id}>
              <TableCell className="text-muted-foreground">{order.id}</TableCell>
              <TableCell className="font-medium">{order.customerName}</TableCell>
              <TableCell>
                <Badge variant="outline" className={meta.className}>
                  <span className="size-1.5 rounded-full bg-current" />
                  {meta.label}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatThaiDate(order.date)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatTHB(order.total)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
