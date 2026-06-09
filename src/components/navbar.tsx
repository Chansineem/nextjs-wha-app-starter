import { Logo } from "@/components/logo";
import { NavMenu } from "@/components/nav-menu";
import { NavigationSheet } from "@/components/navigation-sheet";
import Link from "next/link";
import { RiShoppingCart2Line } from "@remixicon/react";
import CountCartItem from "@/app/(front)/components/CountCartItem";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import LogoutButton from "./logout-button";
import ThemeToggle from "./theme-toggle";
import AppSearch from "./app-search";
import { Button } from "./ui/button";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        {/* Left — logo + primary nav */}
        <Logo />
        <NavMenu className="ml-1 hidden lg:flex" />

        {/* Center — search */}
        <AppSearch className="mx-auto hidden w-full max-w-md md:flex" />

        {/* Right — actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-0">
          <ThemeToggle />

          <Button asChild variant="ghost" size="icon">
            <Link href="/cart" aria-label="ตะกร้าสินค้า" className="relative">
              <RiShoppingCart2Line />
              <CountCartItem />
            </Link>
          </Button>

          {!session && (
            <>
              <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex">
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/signup">สมัครสมาชิก</Link>
              </Button>
            </>
          )}

          {session && (
            <>
              <span className="hidden text-sm text-muted-foreground lg:inline">
                สวัสดี, {session.user.name}
              </span>
              <LogoutButton />
            </>
          )}

          {/* Mobile menu */}
          <div className="lg:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
