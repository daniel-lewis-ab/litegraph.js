type ImgOptions = {
  width?: number;
  height?: number;
};

export const getAssetUrl = (filePath: string, { width, height }: ImgOptions = {}) => {
  const widthParam = width ? `w-${width}` : '';
  const heightParam = height ? `,h-${height}` : '';

  return `${import.meta.env.VITE_IMAGE_SERVICE_URL}/${filePath}?tr=${widthParam}${heightParam}`;
};
