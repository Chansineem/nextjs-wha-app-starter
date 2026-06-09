'use client'

import * as React from "react";
import { useTheme } from "next-themes";
import { RiSunLine, RiMoonLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch: the resolved theme is only known on the client.
  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="สลับธีมสว่าง / มืด"
      title="สลับธีมสว่าง / มืด"
    >
      {mounted && isDark ? <RiSunLine /> : <RiMoonLine />}
      <span className="sr-only">สลับธีม</span>
    </Button>
  );
}
