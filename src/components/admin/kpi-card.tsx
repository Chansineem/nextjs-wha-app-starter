import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * โทนสีของ KPI — ใช้สีตามความหมายของตัวเลข ไม่ใช่สีธีม:
 * success = เงิน/รายได้, info = ปริมาณงานปกติ, warning = สิ่งที่รอจัดการ/ผิดปกติ,
 * neutral = ตัวเลขเฉยๆ ไม่ต้องเรียกความสนใจ
 */
export type KpiTone = "neutral" | "success" | "info" | "warning";

const TONE_STYLES: Record<KpiTone, { icon: string; value?: string }> = {
  neutral: { icon: "bg-muted text-muted-foreground" },
  success: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  info: {
    icon: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  },
  warning: {
    icon: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    // warning เน้นตัวเลขด้วย — มีของรอจัดการต้องสะดุดตา
    value: "text-amber-600 dark:text-amber-400",
  },
};

interface KpiCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: KpiTone;
  className?: string;
}

export function KpiCard({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
  className,
}: KpiCardProps) {
  const styles = TONE_STYLES[tone];
  return (
    <Card size="sm" className={className}>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p
            className={cn(
              "mt-1 font-heading text-2xl font-semibold tabular-nums",
              styles.value,
            )}
          >
            {value}
          </p>
          {hint ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        {icon ? (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-3xl [&_svg]:size-5",
              styles.icon,
            )}
          >
            {icon}
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function KpiCardSkeleton({ className }: { className?: string }) {
  return (
    <Card size="sm" className={className}>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="w-full">
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-7 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="size-10 shrink-0 animate-pulse rounded-3xl bg-muted" />
      </CardContent>
    </Card>
  );
}
