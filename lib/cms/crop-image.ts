export type PixelCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CropImageOptions = {
  maxWidth?: number;
  mimeType?: "image/jpeg" | "image/webp" | "image/png";
  quality?: number;
  fileName?: string;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Failed to load image.")));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = src;
  });
}

function scaleCropDimensions(
  crop: PixelCrop,
  maxWidth?: number,
): { width: number; height: number } {
  if (!maxWidth || crop.width <= maxWidth) {
    return { width: Math.round(crop.width), height: Math.round(crop.height) };
  }

  const ratio = maxWidth / crop.width;
  return {
    width: maxWidth,
    height: Math.max(1, Math.round(crop.height * ratio)),
  };
}

export async function getCroppedImageFile(
  imageSrc: string,
  crop: PixelCrop,
  options: CropImageOptions = {},
): Promise<File> {
  const image = await loadImage(imageSrc);
  const mimeType = options.mimeType ?? "image/jpeg";
  const quality = options.quality ?? 0.92;
  const output = scaleCropDimensions(crop, options.maxWidth);

  const canvas = document.createElement("canvas");
  canvas.width = output.width;
  canvas.height = output.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not supported.");
  }

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    output.width,
    output.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => {
        if (value) resolve(value);
        else reject(new Error("Failed to export cropped image."));
      },
      mimeType,
      quality,
    );
  });

  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  const baseName = (options.fileName ?? "cropped-image").replace(/\.[^.]+$/, "");

  return new File([blob], `${baseName}.${extension}`, { type: mimeType });
}

export function shouldOpenCropEditor(file: File) {
  return file.type.startsWith("image/") && file.type !== "image/gif";
}
