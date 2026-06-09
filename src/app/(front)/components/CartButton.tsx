"use client"

import { Button } from "@/components/ui/button";
import type { ProductCardItem } from "@/components/features-product";
import { useCartStore } from "@/lib/cart-store";
import { RiShoppingCart2Line } from "@remixicon/react";

type Props = {
  product: ProductCardItem;
};

export default function CartButton({ product }: Props) {
  const addItem = useCartStore((state) => state.addItem);   

  const handleAddItem = () => {
     addItem({
        productId: String(product.id),
        name: product.name,
        price: product.price,
        qty: 1
     });   
  }

  return (
    <Button
      className="mt-3 w-full rounded-full shadow-none"
      onClick={handleAddItem}
    >
      <RiShoppingCart2Line /> หยิบใส่ตะกร้า
    </Button>
  );
}
