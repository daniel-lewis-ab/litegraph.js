type ImgOptions = {
  width?: number;
  height?: number;
  extension?: 'jpg' | 'png';
};

export const getImageUrl = (
  executionId: string,
  fileName: string,
  { width, height, extension = 'png' }: ImgOptions = {},
) => {
  const widthParam = width ? `w-${width}` : '';
  const heightParam = height ? `,h-${height}` : '';

  return `${import.meta.env.VITE_IMAGE_SERVICE_URL}/workflow_executions/outputs/${executionId}/${fileName}.${extension}?tr=${widthParam}${heightParam}`;
};
