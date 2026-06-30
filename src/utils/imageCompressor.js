// src/utils/imageCompressor.js

/**
 * Compresses an image file using HTML5 Canvas.
 * @param {File} file - Original file object
 * @param {number} maxWidth - Maximum allowed width
 * @param {number} maxHeight - Maximum allowed height
 * @param {number} quality - Target JPEG/PNG compression quality (0 to 1)
 * @returns {Promise<File>} Compressed File object
 */
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    // If the file is already under 300KB, skip canvas processing
    if (file.size <= 300 * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while checking maximum dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas compression failed to generate a blob.'));
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type || 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          file.type || 'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
