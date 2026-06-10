"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiArchiveLine, RiDashboardLine } from "@remixicon/react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "แดชบอร์ด", icon: RiDashboardLine, exact: true },
  { href: "/dashboard/products", label: "สินค้า", icon: RiArchiveLine, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="เมนูผู้ดูแลระบบ" className="flex items-center gap-1">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-3xl px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
