import sharp from "sharp";

export const UPLOAD_MAX_WIDTH = 1920;
export const UPLOAD_MAX_HEIGHT = 1080;
export const UPLOAD_WEBP_QUALITY = 85;

type ProcessUploadImageOptions = {
  preserveDimensions?: boolean;
};

const rasterImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function isRasterUpload(mimeType: string) {
  return rasterImageTypes.has(mimeType);
}

export async function processUploadImage(
  input: Buffer,
  mimeType: string,
  options: ProcessUploadImageOptions = {},
) {
  let pipeline = sharp(input, mimeType === "image/gif" ? { animated: true } : undefined).rotate();

  if (!options.preserveDimensions) {
    pipeline = pipeline.resize(UPLOAD_MAX_WIDTH, UPLOAD_MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const { data, info } = await pipeline
    .webp({ quality: UPLOAD_WEBP_QUALITY })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: data,
    mimeType: "image/webp",
    width: info.width,
    height: info.height,
  };
}
