"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, totalPrice, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phone: "+7",
    address: "",
    comment: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Keep the phone field masked as +7 (999) 123-45-67 and always starting with +7.
  function formatRuPhone(raw: string): string {
    let d = raw.replace(/\D/g, "");
    if (d.startsWith("8")) d = d.slice(1);
    else if (d.startsWith("7")) d = d.slice(1);
    d = d.slice(0, 10);

    const a = d.slice(0, 3);
    const b = d.slice(3, 6);
    const c = d.slice(6, 8);
    const e = d.slice(8, 10);

    let out = "+7";
    if (a) out += ` (${a}`;
    if (a.length === 3) out += ")";
    if (b) out += ` ${b}`;
    if (c) out += `-${c}`;
    if (e) out += `-${e}`;
    return out;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // +7 plus 10 national digits = 11 digits total
    if (form.phone.replace(/\D/g, "").length !== 11) {
      setError("Введите корректный номер телефона: +7 (999) 123-45-67");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Не удалось оформить заказ");
        return;
      }
      clear();
      router.push(`/order/${data.orderId}`);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-muted">Корзина пуста</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
            >
              Перейти в меню
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Оформление заказа</h1>

        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-xl border border-border bg-card p-5"
          >
            <Field
              label="Имя *"
              value={form.customerName}
              onChange={(v) => update("customerName", v)}
              placeholder="Как к вам обращаться"
              required
            />
            <Field
              label="Телефон *"
              value={form.phone}
              onChange={(v) => update("phone", formatRuPhone(v))}
              placeholder="+7 (999) 123-45-67"
              type="tel"
              required
            />
            <div>
              <label className="mb-1 block text-sm font-medium">
                Адрес доставки *
              </label>
              <textarea
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Улица, дом, квартира, подъезд, этаж"
                required
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Комментарий к заказу
              </label>
              <textarea
                value={form.comment}
                onChange={(e) => update("comment", e.target.value)}
                placeholder="Например: не звонить в дверь"
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
            >
              {submitting ? "Отправляем…" : "Подтвердить заказ"}
            </button>
            <p className="text-center text-xs text-muted">
              Оплата при получении (наличными или курьеру)
            </p>
          </form>

          <aside className="h-fit rounded-xl border border-border bg-card p-5">
            <h2 className="mb-3 font-semibold">Ваш заказ</h2>
            <ul className="space-y-2 text-sm">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="text-muted">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="whitespace-nowrap">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
              <span>Итого</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
      />
    </div>
  );
}
