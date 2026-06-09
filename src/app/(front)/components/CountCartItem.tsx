/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useCartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

export default function CountCartItem() {
  const totalItems = useCartStore((state) => state.totalItems());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  },[])

  if (!isMounted || totalItems === 0) return null;

  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-medium leading-none text-brand-foreground">
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}
