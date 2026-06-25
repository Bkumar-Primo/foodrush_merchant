export interface ImageSearchResult {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}

export interface ImageSearchResponse {
  images: ImageSearchResult[];
  total: number;
  error?: string;
}
