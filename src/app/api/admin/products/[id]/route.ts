import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/admin/products/[id]">
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const data: Record<string, unknown> = {};
  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ error: "Укажите название" }, { status: 400 });
    }
    data.name = name;
  }
  if (typeof body.categoryId === "string" && body.categoryId.trim()) {
    data.categoryId = body.categoryId.trim();
  }
  if (body.price !== undefined) {
    data.price = Math.max(0, Math.floor(Number(body.price) || 0));
  }
  if (typeof body.description === "string")
    data.description = body.description.trim();
  if (typeof body.composition === "string")
    data.composition = body.composition.trim();
  if (typeof body.weight === "string") data.weight = body.weight.trim();
  if (body.imageUrl !== undefined)
    data.imageUrl = body.imageUrl ? String(body.imageUrl) : null;
  if (body.isAvailable !== undefined) data.isAvailable = Boolean(body.isAvailable);
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;

  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ ok: true, product });
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/admin/products/[id]">
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
