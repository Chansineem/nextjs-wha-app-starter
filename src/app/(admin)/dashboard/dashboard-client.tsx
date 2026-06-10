"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RiArchiveLine,
  RiErrorWarningLine,
  RiGroupLine,
  RiMoneyDollarCircleLine,
  RiRefreshLine,
  RiShoppingBag3Line,
  RiTimeLine,
} from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card";
import { PeriodSelector } from "@/components/admin/period-selector";
import { RecentOrdersTable } from "@/components/admin/recent-orders-table";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { formatTHB } from "@/lib/admin-format";
import type {
  AdminOrderItem,
  AdminOrdersResponse,
  AdminStats,
  RevenuePeriod,
  RevenuePoint,
} from "@/types/admin";

const REFRESH_INTERVAL_MS = 30_000;
const ORDERS_LIMIT = 5;

/** กล่องแสดง error + ปุ่มลองใหม่ ใช้ซ้ำทุก section */
function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <RiErrorWarningLine className="size-8 text-destructive" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RiRefreshLine />
        ลองใหม่
      </Button>
    </div>
  );
}

export function DashboardClient() {
  // ----- stats -----
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // ----- revenue -----
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState<string | null>(null);
  const [period, setPeriod] = useState<RevenuePeriod>("30d");

  // ----- orders -----
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // silent = true เมื่อ refresh เบื้องหลัง (ไม่โชว์ skeleton ซ้ำทุก 30 วิ)
  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      setStats((await res.json()) as AdminStats);
    } catch {
      setStatsError("ไม่สามารถโหลดสถิติได้");
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetch(`/api/admin/orders?limit=${ORDERS_LIMIT}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as AdminOrdersResponse;
      setOrders(data.orders);
    } catch {
      setOrdersError("ไม่สามารถโหลดคำสั่งซื้อล่าสุดได้");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchRevenue = useCallback(async (selected: RevenuePeriod) => {
    setRevenueLoading(true);
    setRevenueError(null);
    try {
      const res = await fetch(`/api/admin/revenue?period=${selected}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(String(res.status));
      setRevenue((await res.json()) as RevenuePoint[]);
    } catch {
      setRevenueError("ไม่สามารถโหลดข้อมูลรายได้ได้");
    } finally {
      setRevenueLoading(false);
    }
  }, []);

  // mount → fetch stats + orders พร้อมกัน
  // spec บังคับ fetch ใน useEffect + โชว์ loading/error → ต้อง setState ก่อน await
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    fetchOrders();
  }, [fetchStats, fetchOrders]);

  // period เปลี่ยน → fetch revenue ใหม่
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRevenue(period);
  }, [period, fetchRevenue]);

  // refresh stats + orders ทุก 30 วินาที (เบื้องหลัง) → cleanup
  useEffect(() => {
    const id = setInterval(() => {
      fetchStats(true);
      fetchOrders(true);
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchStats, fetchOrders]);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">แดชบอร์ด</h1>
        <p className="text-sm text-muted-foreground">
          ภาพรวมยอดขายและคำสั่งซื้อ (อัปเดตอัตโนมัติทุก 30 วินาที)
        </p>
      </div>

      {/* ===== KPI ===== */}
      <section>
        {statsError ? (
          <Card>
            <CardContent>
              <ErrorState message={statsError} onRetry={() => fetchStats()} />
            </CardContent>
          </Card>
        ) : statsLoading && !stats ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <KpiCardSkeleton key={i} />
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {/* สี KPI สื่อความหมาย: เขียว=รายได้, ฟ้า=งานปกติ,
                เหลือง=รอจัดการ (โผล่เฉพาะตอนมีจริง), เทา=ตัวเลขทั่วไป */}
            <KpiCard
              label="ยอดขายวันนี้"
              value={formatTHB(stats.todaySales)}
              icon={<RiMoneyDollarCircleLine />}
              tone="success"
            />
            <KpiCard
              label="ออเดอร์วันนี้"
              value={stats.todayOrders.toLocaleString("th-TH")}
              icon={<RiShoppingBag3Line />}
              tone="info"
            />
            <KpiCard
              label="รอดำเนินการ"
              value={stats.pendingOrders.toLocaleString("th-TH")}
              icon={<RiTimeLine />}
              tone={stats.pendingOrders > 0 ? "warning" : "neutral"}
              hint={stats.pendingOrders > 0 ? "มีออเดอร์รอจัดการ" : "ไม่มีงานค้าง"}
            />
            <KpiCard
              label="สินค้าทั้งหมด"
              value={stats.totalProducts.toLocaleString("th-TH")}
              icon={<RiArchiveLine />}
            />
            <KpiCard
              label="ผู้ใช้ทั้งหมด"
              value={stats.totalUsers.toLocaleString("th-TH")}
              icon={<RiGroupLine />}
            />
          </div>
        ) : null}
      </section>

      {/* ===== Revenue chart ===== */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <CardTitle>รายได้</CardTitle>
          <PeriodSelector
            value={period}
            onChange={setPeriod}
            disabled={revenueLoading}
          />
        </CardHeader>
        <CardContent>
          {revenueError ? (
            <ErrorState
              message={revenueError}
              onRetry={() => fetchRevenue(period)}
            />
          ) : revenueLoading ? (
            <div className="h-[300px] w-full animate-pulse rounded-3xl bg-muted" />
          ) : (
            <RevenueChart data={revenue} />
          )}
        </CardContent>
      </Card>

      {/* ===== Recent orders ===== */}
      <Card>
        <CardHeader>
          <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersError ? (
            <ErrorState message={ordersError} onRetry={() => fetchOrders()} />
          ) : ordersLoading && orders.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: ORDERS_LIMIT }).map((_, i) => (
                <div key={i} className="h-10 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : (
            <RecentOrdersTable orders={orders} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
