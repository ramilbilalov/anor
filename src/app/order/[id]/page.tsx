import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, orderStatusLabel } from "@/lib/format";
import { Header } from "@/components/Header";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: PageProps<"/order/[id]">) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold">Заказ принят!</h1>
          <p className="mt-1 text-muted">
            Номер заказа: <span className="font-mono">{order.id.slice(-8)}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            Статус: {orderStatusLabel(order.status)}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-3 font-semibold">Состав заказа</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="text-muted">
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-3 font-semibold">
            <span>Итого</span>
            <span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card p-5 text-sm">
          <h2 className="mb-3 font-semibold">Доставка</h2>
          <dl className="space-y-1">
            <Row label="Имя" value={order.customerName} />
            <Row label="Телефон" value={order.phone} />
            <Row label="Адрес" value={order.address} />
            {order.comment && <Row label="Комментарий" value={order.comment} />}
          </dl>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            Вернуться в меню
          </Link>
        </div>
      </main>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-28 shrink-0 text-muted">{label}</dt>
      <dd className="flex-1">{value}</dd>
    </div>
  );
}
