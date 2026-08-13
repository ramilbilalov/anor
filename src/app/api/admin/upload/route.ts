import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Accepted input formats. Whatever comes in is normalized to a square WebP.
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB input (output is re-compressed and small)
const OUTPUT_SIZE = 800; // final square side in px
const WEBP_QUALITY = 82;

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Недопустимый формат (только JPG, PNG, WEBP, GIF)" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Файл слишком большой (макс. 15 МБ)" },
      { status: 400 }
    );
  }

  const inputBytes = Buffer.from(await file.arrayBuffer());

  // Normalize any upload to a consistent square, optimized WebP:
  // - rotate(): honor EXIF orientation (fixes sideways phone photos)
  // - resize cover + attention: crop to square focusing on the main subject
  let outputBytes: Buffer;
  try {
    outputBytes = await sharp(inputBytes)
      .rotate()
      .resize(OUTPUT_SIZE, OUTPUT_SIZE, {
        fit: "cover",
        position: sharp.strategy.attention,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
  } catch {
    return NextResponse.json(
      { error: "Не удалось обработать изображение" },
      { status: 400 }
    );
  }

  const filename = `${randomUUID()}.webp`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), outputBytes);

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
