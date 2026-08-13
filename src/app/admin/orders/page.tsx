import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { OrderStatusSelect } from "./OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Заказы</h1>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-6 text-muted">
          Заказов пока нет.
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-muted">
                      #{order.id.slice(-8)}
                    </span>
                    <span className="text-sm text-muted">
                      {new Date(order.createdAt).toLocaleString("ru-RU")}
                    </span>
                  </div>
                  <h2 className="mt-1 text-lg font-semibold">
                    {order.customerName}
                  </h2>
                  <p className="text-sm">
                    <a
                      href={`tel:${order.phone}`}
                      className="text-primary hover:underline"
                    >
                      {order.phone}
                    </a>
                  </p>
                  <p className="mt-1 text-sm text-muted">📍 {order.address}</p>
                  {order.comment && (
                    <p className="mt-1 text-sm text-muted">💬 {order.comment}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-bold">
                    {formatPrice(order.totalPrice)}
                  </span>
                  <OrderStatusSelect
                    orderId={order.id}
                    status={order.status}
                  />
                </div>
              </div>

              <ul className="mt-4 divide-y divide-border border-t border-border text-sm">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between py-1.5"
                  >
                    <span>
                      {item.name}{" "}
                      <span className="text-muted">× {item.quantity}</span>
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
