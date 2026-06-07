"use client"

import { Button } from "@/components/ui/button";
import type { ProductCardItem } from "@/components/features-product";
import { useCartStore } from "@/lib/cart-store";
import { ChevronRight } from "lucide-react";

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
    <>
        <Button className="mt-6 shadow-none" onClick={handleAddItem}>
            หยิบใส่ตะกร้า <ChevronRight />
        </Button> 
    </>
  );
}
