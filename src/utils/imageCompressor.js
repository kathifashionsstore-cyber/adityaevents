// src/utils/imageCompressor.js

/**
 * Compress an image file to a maximum of 300KB using Canvas
 * @param {File} file - Original file object
 * @returns {Promise<{blob: Blob, previewUrl: string, originalSize: number, compressedSize: number}>}
 */
export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    // If it is not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }
    
    // Skip compression for GIFs since drawing to canvas flattens animations
    if (file.type === 'image/gif' && file.size / 1024 <= 300) {
      resolve({
        blob: file,
        previewUrl: URL.createObjectURL(file),
        originalSize: file.size,
        compressedSize: file.size
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        // Resize rules
        if (width > 1920) {
          height = Math.round((height * 1920) / width);
          width = 1920;
        } else if (width > 1280) {
          height = Math.round((height * 1280) / width);
          width = 1280;
        }

        let quality = 0.85;
        
        const attemptCompression = (q, w, h) => {
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob export failed'));
              return;
            }

            const sizeKB = blob.size / 1024;
            
            if (sizeKB <= 300) {
              // Compression successful!
              resolve({
                blob,
                previewUrl: URL.createObjectURL(blob),
                originalSize: file.size,
                compressedSize: blob.size,
              });
            } else if (q > 0.3) {
              // Try again with reduced quality
              attemptCompression(q - 0.05, w, h);
            } else {
              // If still too large at quality 0.3, reduce dimensions by 20% and retry
              const nextWidth = Math.round(w * 0.8);
              const nextHeight = Math.round(h * 0.8);
              if (nextWidth < 100 || nextHeight < 100) {
                // Return what we have if dimensions become too tiny
                resolve({
                  blob,
                  previewUrl: URL.createObjectURL(blob),
                  originalSize: file.size,
                  compressedSize: blob.size,
                });
              } else {
                attemptCompression(0.35, nextWidth, nextHeight);
              }
            }
          }, 'image/jpeg', q);
        };

        attemptCompression(quality, width, height);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
