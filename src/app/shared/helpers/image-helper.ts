export function processImageToThumb(
  file: File,
  width = 320,
  height = 320,
  quality = 0.25,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const sw = img.naturalWidth * scale;
      const sh = img.naturalHeight * scale;
      const dx = (width - sw) / 2;
      const dy = (height - sh) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, dx, dy, sw, sh);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);

          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            resolve(dataUrl.split(',')[1]);
          };
          reader.onerror = () => reject(new Error('Failed to read blob as base64'));
          reader.readAsDataURL(blob);
        },
        'image/jpeg',
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
