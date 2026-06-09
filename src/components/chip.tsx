import Link from "next/link";
import { cn } from "@/lib/utils";

// Red Broadcast filter chip — pill, selected fills with primary (Broadcast Red).
export function Chip({
  href,
  active,
  children,
}: {
  href: React.ComponentProps<typeof Link>["href"];
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-foreground hover:bg-accent"
      )}
    >
      {children}
    </Link>
  );
}
