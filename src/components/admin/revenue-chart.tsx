"use client";

import dynamic from "next/dynamic";

import type { RevenuePoint } from "@/types/admin";

// Recharts อ้างอิง window/ResizeObserver → ต้องปิด SSR ด้วย { ssr: false }
const RevenueChartInner = dynamic(() => import("./revenue-chart-inner"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full animate-pulse rounded-3xl bg-muted" />
  ),
});

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return <RevenueChartInner data={data} />;
}
