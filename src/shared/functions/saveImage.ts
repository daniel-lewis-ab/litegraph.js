export const saveImage = async (imageUrl: string, name: string) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
