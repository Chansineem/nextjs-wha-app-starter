import Image from "next/image";

export const Logo = () => (
  <Image
    src="/next.svg"
    alt="โลโก้ Next.js"
    width={0}
    height={0}
    className="shrink-0 dark:invert"
    style={{
      width: 124,
      height: 32
    }}
    loading="eager"
  />
);
