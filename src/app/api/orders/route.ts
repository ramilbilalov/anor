import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type IncomingItem = { id: string; quantity: number };

export async function POST(request: NextRequest) {
  let body: {
    customerName?: string;
    phone?: string;
    address?: string;
    comment?: string;
    items?: IncomingItem[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const customerName = (body.customerName ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const address = (body.address ?? "").trim();
  const comment = (body.comment ?? "").trim();
  const items = Array.isArray(body.items) ? body.items : [];

  if (!customerName || !phone || !address) {
    return NextResponse.json(
      { error: "Укажите имя, телефон и адрес доставки" },
      { status: 400 }
    );
  }
  if (items.length === 0) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }

  // Fetch authoritative prices from the DB (never trust client prices).
  const productIds = items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isAvailable: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const orderItems = [];
  let totalPrice = 0;
  for (const item of items) {
    const product = productMap.get(item.id);
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 0));
    if (!product) continue;
    totalPrice += product.price * quantity;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  if (orderItems.length === 0) {
    return NextResponse.json(
      { error: "Выбранные товары недоступны" },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      address,
      comment,
      totalPrice,
      items: { create: orderItems },
    },
  });

  return NextResponse.json({ ok: true, orderId: order.id });
}
