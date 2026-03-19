type CloudinaryTransformOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "scale";
  quality?: string;
};

const CLOUDINARY_HOST = "res.cloudinary.com";

export const getOptimizedCloudinaryUrl = (
  url: string,
  options: CloudinaryTransformOptions = {},
) => {
  if (!url || !url.includes(CLOUDINARY_HOST) || !url.includes("/image/upload/")) {
    return url;
  }

  const {
    width,
    height,
    crop = height ? "fill" : "limit",
    quality = "auto:good",
  } = options;

  const transforms = [`f_auto`, `dpr_auto`, `q_${quality}`];

  if (width) transforms.push(`w_${Math.round(width)}`);
  if (height) transforms.push(`h_${Math.round(height)}`);
  if (width || height) transforms.push(`c_${crop}`, `g_auto`);

  const transformationSegment = transforms.join(",");
  return url.replace("/image/upload/", `/image/upload/${transformationSegment}/`);
};
