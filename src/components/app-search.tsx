import { RiSearchLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

// Red Broadcast — centered top-bar search: square-left input + attached pill button
export default function AppSearch({
  className,
  defaultValue,
}: {
  className?: string;
  defaultValue?: string;
}) {
  return (
    <form action="/product" role="search" className={cn("flex items-center", className)}>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="ค้นหาสินค้า..."
        aria-label="ค้นหาสินค้า"
        className="h-10 w-full min-w-0 rounded-l-full rounded-r-none border border-r-0 border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
      />
      <button
        type="submit"
        aria-label="ค้นหา"
        className="grid h-10 w-16 shrink-0 place-items-center rounded-r-full border border-border bg-secondary text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <RiSearchLine className="size-5" />
      </button>
    </form>
  );
}
