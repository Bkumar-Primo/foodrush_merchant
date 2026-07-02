import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

function extensionFromMimeType(mimeType: string): "png" | "jpg" {
  return mimeType.toLowerCase().includes("png") ? "png" : "jpg";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Image storage is not configured. Create a free Vercel Blob store and add BLOB_READ_WRITE_TOKEN.",
      },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const itemId = formData.get("itemId");

  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  if (typeof itemId !== "string" || !itemId.trim()) {
    return NextResponse.json({ error: "Missing menu item id" }, { status: 400 });
  }

  const safeItemId = itemId.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safeItemId) {
    return NextResponse.json({ error: "Invalid menu item id" }, { status: 400 });
  }

  try {
    const contentType = file.type || "image/jpeg";
    const extension = extensionFromMimeType(contentType);

    const blob = await put(`menu-items/${safeItemId}/${Date.now()}.${extension}`, file, {
      access: "public",
      contentType,
      cacheControlMaxAge: 31_536_000,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("[menu-images] upload failed", error);
    return NextResponse.json({ error: "Could not upload image" }, { status: 500 });
  }
}
