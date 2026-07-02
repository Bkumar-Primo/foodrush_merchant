const MAX_EDGE_PX = 1024;
const JPEG_QUALITY = 0.86;

interface PreparedUpload {
  blob: Blob;
  contentType: "image/png" | "image/jpeg";
  fileName: string;
}

function preferredOutputType(file: File): "image/png" | "image/jpeg" {
  const inputType = file.type.toLowerCase();
  if (inputType === "image/png") {
    // Keep alpha channel for no-background images.
    return "image/png";
  }
  return "image/jpeg";
}

async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not read image file"));
      image.src = objectUrl;
    });
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Resize and compress uploads so the customer app loads images quickly. */
export async function compressImageFile(file: File): Promise<PreparedUpload> {
  const image = await loadImageFromFile(file);
  const longestEdge = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, MAX_EDGE_PX / longestEdge);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const outputType = preferredOutputType(file);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not prepare image for upload");
  }
  context.drawImage(image, 0, 0, width, height);

  return new Promise<PreparedUpload>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not compress image"));
          return;
        }
        resolve({
          blob,
          contentType: outputType,
          fileName: `menu-item.${outputType === "image/png" ? "png" : "jpg"}`,
        });
      },
      outputType,
      outputType === "image/jpeg" ? JPEG_QUALITY : undefined,
    );
  });
}

/** Upload via Vercel Blob (free on Hobby) — no Firebase Storage / Blaze plan needed. */
export async function uploadMenuItemImage(itemId: string, file: File): Promise<string> {
  const prepared = await compressImageFile(file);
  const formData = new FormData();
  formData.append("file", prepared.blob, prepared.fileName);
  formData.append("itemId", itemId);

  const response = await fetch("/api/menu-images/upload", {
    method: "POST",
    body: formData,
  });

  const body = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!response.ok || !body.url) {
    throw new Error(body.error || "Could not upload image");
  }

  return body.url;
}

export async function uploadDataUrlMenuItemImage(itemId: string, dataUrl: string): Promise<string> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const file = new File([blob], "menu-item.jpg", {
    type: blob.type || "image/jpeg",
  });
  return uploadMenuItemImage(itemId, file);
}

export function isDataImageUrl(value: string | undefined): boolean {
  return Boolean(value?.startsWith("data:image/"));
}
