import { removeBackground } from "@imgly/background-removal";

export async function removeImageBackground(file: File): Promise<File> {
  const result = await removeBackground(file, {
    output: {
      format: "image/png",
      quality: 1,
    },
  });

  const outputBlob = result instanceof Blob ? result : new Blob([result], { type: "image/png" });
  const baseName = file.name.replace(/\.[^.]+$/, "") || "menu-item";
  return new File([outputBlob], `${baseName}-cutout.png`, { type: "image/png" });
}
