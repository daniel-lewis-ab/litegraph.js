const DEFAULT_EXTENSION = 'png';

export const saveAsset = async (assetUrl: string, name: string) => {
  const response = await fetch(assetUrl);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const blob = await response.blob();

  let extension = DEFAULT_EXTENSION;
  const urlParts = assetUrl.split('?')[0];
  const urlSplit = urlParts.split('.');
  if (urlSplit.length > 1) {
    extension = urlSplit.pop()!;
  }
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${name}.${extension}`;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
