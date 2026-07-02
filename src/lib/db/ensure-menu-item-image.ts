import type { MenuItem } from "@/types";
import { resolveFoodCategoryImagePath } from "@/lib/constants/food-category-images";
import {
  isDataImageUrl,
  uploadDataUrlMenuItemImage,
} from "@/lib/db/menu-image-storage";

const MERCHANT_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://foodrush-merchant.vercel.app";

function isOurBlobUrl(url: string): boolean {
  return url.includes("blob.vercel-storage.com");
}

function needsImageResolve(image: string | undefined): boolean {
  const value = image?.trim() ?? "";
  if (!value) {
    return true;
  }
  if (isDataImageUrl(value) || value.startsWith("/food/")) {
    return true;
  }
  if (value.startsWith("http") && !isOurBlobUrl(value)) {
    return true;
  }
  return false;
}

export async function importRemoteMenuItemImage(
  itemId: string,
  sourceUrl: string,
): Promise<string> {
  const response = await fetch("/api/menu-images/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, sourceUrl }),
  });

  const body = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!response.ok || !body.url) {
    throw new Error(body.error || "Could not import image");
  }

  return body.url;
}

function categoryFallbackSourceUrl(categoryName: string): string {
  const path = resolveFoodCategoryImagePath(categoryName);
  return `${MERCHANT_ORIGIN}${path}`;
}

/**
 * Ensures every menu item has a fast Vercel Blob URL.
 * - Keeps existing Blob uploads
 * - Imports existing remote URLs into Blob
 * - Falls back to the category PNG art
 */
export async function ensureMenuItemImage(item: MenuItem): Promise<string> {
  const current = item.image?.trim() ?? "";
  if (!needsImageResolve(current)) {
    return current;
  }

  if (isDataImageUrl(current)) {
    return uploadDataUrlMenuItemImage(item.id, current);
  }

  const categoryUrl = categoryFallbackSourceUrl(item.category);
  try {
    return await importRemoteMenuItemImage(item.id, categoryUrl);
  } catch (error) {
    console.warn("[menu] category import failed, using hosted category art", error);
    return categoryUrl;
  }
}
