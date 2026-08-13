import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const name = (body.name ?? "").trim();
  const categoryId = (body.categoryId ?? "").trim();
  const price = Math.max(0, Math.floor(Number(body.price) || 0));

  if (!name) {
    return NextResponse.json({ error: "Укажите название" }, { status: 400 });
  }
  if (!categoryId) {
    return NextResponse.json({ error: "Выберите категорию" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name,
      categoryId,
      price,
      description: (body.description ?? "").trim(),
      composition: (body.composition ?? "").trim(),
      weight: (body.weight ?? "").trim(),
      imageUrl: body.imageUrl ? String(body.imageUrl) : null,
      isAvailable: body.isAvailable !== false,
      sortOrder: Number(body.sortOrder) || 0,
    },
  });
  return NextResponse.json({ ok: true, product });
}
