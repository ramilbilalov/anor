"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

const RESTAURANT_NAME = process.env.NEXT_PUBLIC_RESTAURANT_NAME ?? "Anor";

export function Header() {
  const { totalCount } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            A
          </span>
          <span className="text-lg font-semibold">{RESTAURANT_NAME}</span>
          <span className="hidden text-sm text-muted sm:inline">· доставка</span>
        </Link>

        <Link
          href="/cart"
          className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
        >
          Корзина
          {totalCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-xs font-bold text-primary">
              {totalCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
