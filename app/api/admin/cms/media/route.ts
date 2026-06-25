import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { requireAdminSession } from "@/lib/auth/require-admin";
import { isRasterUpload, processUploadImage } from "@/lib/cms/process-upload-image";
import { getDb, hasDatabaseUrl, schema } from "@/lib/db";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/octet-stream",
  "application/json",
]);
const maxBytes = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (auth.response) return auth.response;

  const formData = await request.formData();
  const file = formData.get("file");
  const preserveDimensions = formData.get("preserveDimensions") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Image file is required." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type) || (!file.type.startsWith("image/") && !file.name.endsWith(".lottie"))) {
    return NextResponse.json({ ok: false, message: "Only JPG, PNG, WebP, GIF, and Lottie media are supported." }, { status: 400 });
  }

  if (file.size > maxBytes) {
    return NextResponse.json({ ok: false, message: "Image must be 8MB or smaller." }, { status: 400 });
  }

  const originalBytes = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();
  const baseName = slugify(file.name.replace(/\.[^.]+$/, "")) || "cms-image";
  const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");
  const now = new Date();

  let bytes: Buffer = originalBytes;
  let mimeType = file.type;
  let extension = extensionFor(file);
  let width: number | null = null;
  let height: number | null = null;

  if (isRasterUpload(file.type)) {
    try {
      const processed = await processUploadImage(originalBytes, file.type, {
        preserveDimensions,
      });
      bytes = Buffer.from(processed.buffer);
      mimeType = processed.mimeType;
      extension = "webp";
      width = processed.width;
      height = processed.height;
    } catch {
      return NextResponse.json({ ok: false, message: "Unable to process image upload." }, { status: 400 });
    }
  }

  const fileName = `${Date.now()}-${baseName}-${id.slice(0, 8)}.${extension}`;
  const absolutePath = path.join(uploadDir, fileName);
  const url = `/uploads/cms/${fileName}`;

  await mkdir(uploadDir, { recursive: true });
  await writeFile(absolutePath, bytes);

  if (hasDatabaseUrl()) {
    const db = getDb();
    await db
      .insert(schema.mediaAssets)
      .values({
        id,
        fileName,
        url,
        mimeType,
        sizeBytes: bytes.length,
        width,
        height,
        title: file.name,
        isDecorative: false,
        createdAt: now,
        updatedAt: now,
      })
      .onDuplicateKeyUpdate({
        set: {
          url,
          fileName,
          mimeType,
          sizeBytes: bytes.length,
          width,
          height,
          updatedAt: now,
        },
      });
  }

  return NextResponse.json({
    ok: true,
    asset: {
      id,
      fileName,
      url,
      mimeType,
      sizeBytes: bytes.length,
      width,
      height,
    },
  });
}

function extensionFor(file: File) {
  if (file.name.endsWith(".lottie")) return "lottie";

  return "bin";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
