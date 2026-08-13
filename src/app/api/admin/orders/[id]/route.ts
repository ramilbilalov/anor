import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/format";

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/admin/orders/[id]">
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const status = body.status as string;

  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Неверный статус" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
  });
  return NextResponse.json({ ok: true, order });
}
