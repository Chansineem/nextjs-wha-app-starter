import CartButton from "@/app/(front)/components/CartButton";
import Image from "next/image";
import { avatarColor } from "@/lib/avatar";
import { Chip } from "@/components/chip";

export type ProductCardItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  imageName: string | null;
};

type Props = {
  products: ProductCardItem[];
  categories?: string[];
  activeCat?: string;
  query?: string;
};

function getProductImage(product: ProductCardItem) {
  return product.imageName
    ? `/product-image/${product.imageName}`
    : "/product-image/nopic.png";
}

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const FeaturesProduct = ({ products, categories = [], activeCat, query }: Props) => {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight">สินค้าทั้งหมด</h1>
        <span className="text-sm text-muted-foreground">{products.length} รายการ</span>
      </div>

      {/* Category chip bar */}
      {categories.length > 0 && (
        <nav className="-mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
          <Chip href="/product" active={!activeCat}>
            ทั้งหมด
          </Chip>
          {categories.map((cat) => (
            <Chip
              key={cat}
              href={{ pathname: "/product", query: { cat } }}
              active={activeCat === cat}
            >
              {cat}
            </Chip>
          ))}
        </nav>
      )}

      {query && (
        <p className="mt-4 text-sm text-muted-foreground">
          ผลการค้นหาสำหรับ “<span className="font-medium text-foreground">{query}</span>”
        </p>
      )}

      {products.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-border px-6 py-16 text-center text-muted-foreground">
          ไม่พบสินค้าที่ตรงกับเงื่อนไข
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow duration-200 hover:shadow-[0_4px_32px_rgba(0,0,0,0.08)]"
              key={product.id}
            >
              {/* Thumbnail — products keep full aspect on a surface so nothing is cropped */}
              <div className="relative aspect-square w-full bg-secondary">
                <Image
                  alt={product.name}
                  className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  src={getProductImage(product)}
                />
                <span className="absolute left-2 top-2 rounded-md bg-foreground/80 px-1.5 py-0.5 text-[11px] font-medium text-background backdrop-blur">
                  #{product.id}
                </span>
              </div>

              {/* Body — channel-avatar + title + category + price + action, all inside the frame */}
              <div className="flex flex-1 flex-col p-3">
                <div className="flex gap-3">
                  <span
                    className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: avatarColor(product.categoryName) }}
                    aria-hidden
                  >
                    {product.categoryName.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3
                      className="line-clamp-2 min-h-10 text-[15px] font-medium leading-snug"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{product.categoryName}</p>
                    <p className="mt-1 text-base font-semibold">
                      {priceFormatter.format(product.price)}
                    </p>
                  </div>
                </div>

                <CartButton product={product} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturesProduct;
