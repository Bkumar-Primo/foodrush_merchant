import type { ImageSearchResult } from "@/types/api";

interface WikimediaPage {
  pageid: number;
  title?: string;
  imageinfo?: Array<{
    url?: string;
    thumburl?: string;
    mime?: string;
  }>;
}

interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const USER_AGENT = "DelivrnMerchant/1.0 (https://github.com/delivrn; menu-image-search)";

async function searchWikimedia(query: string): Promise<ImageSearchResult[]> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "20",
    prop: "imageinfo",
    iiprop: "url|thumburl|mime",
    iiurlwidth: "400",
    format: "json",
    origin: "*",
  });

  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!response.ok) return [];

  const data = (await response.json()) as {
    query?: { pages?: Record<string, WikimediaPage> };
  };

  return Object.values(data.query?.pages ?? {})
    .filter((page) => page.imageinfo?.[0]?.mime?.startsWith("image/"))
    .map((page): ImageSearchResult | null => {
      const info = page.imageinfo?.[0];
      if (!info?.url) return null;
      const name = (page.title ?? "Image").replace(/^File:/, "").replace(/\.[^.]+$/, "");
      return {
        id: `wikimedia-${page.pageid}`,
        name,
        url: info.url,
        thumbnail: info.thumburl ?? info.url,
      };
    })
    .filter((img): img is ImageSearchResult => img !== null);
}

async function searchTheMealDb(query: string): Promise<ImageSearchResult[]> {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) return [];

  const data = (await response.json()) as { meals: MealDbMeal[] | null };
  return (data.meals ?? [])
    .filter((meal) => meal.strMealThumb)
    .slice(0, 16)
    .map((meal) => ({
      id: `mealdb-${meal.idMeal}`,
      name: meal.strMeal,
      url: meal.strMealThumb,
      thumbnail: meal.strMealThumb,
    }));
}

function mergeResults(...lists: ImageSearchResult[][]): ImageSearchResult[] {
  const seen = new Set<string>();
  const merged: ImageSearchResult[] = [];
  for (const list of lists) {
    for (const img of list) {
      if (seen.has(img.url)) continue;
      seen.add(img.url);
      merged.push(img);
    }
  }
  return merged.slice(0, 24);
}

function foodEnhancedQuery(query: string): string | null {
  const lower = query.toLowerCase();
  const foodHints = ["food", "dish", "meal", "recipe", "cuisine", "drink", "coffee"];
  if (foodHints.some((hint) => lower.includes(hint))) return null;
  return `${query} food`;
}

export interface ImageSearchResponse {
  images: ImageSearchResult[];
  total: number;
  error?: string;
}

export async function searchImages(query: string): Promise<ImageSearchResponse> {
  const foodQuery = foodEnhancedQuery(query);
  const [mealDbImages, wikimediaImages, wikimediaFoodImages] = await Promise.all([
    searchTheMealDb(query),
    searchWikimedia(query),
    foodQuery ? searchWikimedia(foodQuery) : Promise.resolve([]),
  ]);

  const images = mergeResults(mealDbImages, wikimediaFoodImages, wikimediaImages);

  if (images.length === 0) {
    return {
      images: [],
      total: 0,
      error: "No images found for this search.",
    };
  }

  return { images, total: images.length };
}
