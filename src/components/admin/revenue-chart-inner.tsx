"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatTHB } from "@/lib/admin-format";
import type { RevenuePoint } from "@/types/admin";

const compact = new Intl.NumberFormat("th-TH", { notation: "compact" });

export default function RevenueChartInner({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(value) => compact.format(Number(value))}
        />
        <Tooltip
          cursor={{ stroke: "var(--border)" }}
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            color: "var(--popover-foreground)",
            fontSize: 12,
          }}
          formatter={(value) => [formatTHB(Number(value)), "รายได้"]}
        />
        {/* รายได้ = เงิน → เขียว (chart-3) ไม่ใช้แดงธีมซึ่งชนกับความหมาย error */}
        <Line
          type="monotone"
          dataKey="revenue"
          name="รายได้"
          stroke="var(--chart-3)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
