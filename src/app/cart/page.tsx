"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, totalPrice, setQuantity, removeItem } = useCart();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Корзина</h1>

        {items.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-muted">Корзина пуста</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Перейти в меню
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-3"
                >
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-orange-50 text-2xl">
                      🍽️
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-sm text-muted">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-lg hover:bg-background"
                      aria-label="Уменьшить"
                    >
                      −
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-border text-lg hover:bg-background"
                      aria-label="Увеличить"
                    >
                      +
                    </button>
                  </div>

                  <div className="w-28 text-right font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-muted hover:text-primary"
                    aria-label="Удалить"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <span className="text-lg font-semibold">Итого</span>
              <span className="text-xl font-bold">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row-reverse">
              <Link
                href="/checkout"
                className="rounded-lg bg-primary px-6 py-3 text-center font-medium text-primary-foreground transition hover:bg-primary-hover"
              >
                Оформить заказ
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-border px-6 py-3 text-center font-medium transition hover:bg-card"
              >
                Продолжить покупки
              </Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}
