import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

function safeItemId(value: string): string | null {
  const normalized = value.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  return normalized || null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Image storage is not configured. Add BLOB_READ_WRITE_TOKEN." },
      { status: 503 },
    );
  }

  let itemId: string | undefined;
  let sourceUrl: string | undefined;

  try {
    const body = (await request.json()) as { itemId?: string; sourceUrl?: string };
    itemId = body.itemId;
    sourceUrl = body.sourceUrl;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const safeId = itemId ? safeItemId(itemId) : null;
  if (!safeId) {
    return NextResponse.json({ error: "Invalid menu item id" }, { status: 400 });
  }

  if (!sourceUrl?.startsWith("http")) {
    return NextResponse.json({ error: "Invalid source URL" }, { status: 400 });
  }

  try {
    const sourceResponse = await fetch(sourceUrl, {
      headers: {
        Accept: "image/*",
        "User-Agent": "DelivrnMerchant/1.0 (menu-image-import)",
      },
      signal: AbortSignal.timeout(20_000),
    });

    if (!sourceResponse.ok) {
      return NextResponse.json({ error: "Could not download source image" }, { status: 502 });
    }

    const contentType = sourceResponse.headers.get("content-type") ?? "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Source URL is not an image" }, { status: 400 });
    }

    const bytes = await sourceResponse.arrayBuffer();
    if (bytes.byteLength === 0) {
      return NextResponse.json({ error: "Source image is empty" }, { status: 400 });
    }

    const extension = contentType.includes("png") ? "png" : "jpg";
    const blob = await put(`menu-items/${safeId}/${Date.now()}.${extension}`, bytes, {
      access: "public",
      contentType,
      cacheControlMaxAge: 31_536_000,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("[menu-images] import failed", error);
    return NextResponse.json({ error: "Could not import image" }, { status: 500 });
  }
}
