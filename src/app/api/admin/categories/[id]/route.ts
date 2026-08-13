import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/admin/categories/[id]">
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const data: { name?: string; sortOrder?: number } = {};
  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json({ error: "Укажите название" }, { status: 400 });
    }
    data.name = name;
  }
  if (body.sortOrder !== undefined) {
    data.sortOrder = Number(body.sortOrder) || 0;
  }

  const category = await prisma.category.update({ where: { id }, data });
  return NextResponse.json({ ok: true, category });
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext<"/api/admin/categories/[id]">
) {
  const { id } = await params;
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
