import { type NextRequest, NextResponse } from "next/server";
import { searchImages } from "@/lib/api";
import type { ImageSearchResult } from "@/types/api";

export type { ImageSearchResult };

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ images: [], total: 0 });
  }

  try {
    const result = await searchImages(query);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { images: [], total: 0, error: "Failed to fetch images" },
      { status: 500 },
    );
  }
}
