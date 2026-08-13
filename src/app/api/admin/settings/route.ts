import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSettings } from "@/lib/settings";

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (typeof body.restaurantName === "string" && !body.restaurantName.trim()) {
    return NextResponse.json(
      { error: "Название ресторана не может быть пустым" },
      { status: 400 }
    );
  }

  const settings = await updateSettings(body);
  return NextResponse.json({ ok: true, settings });
}
