// src/utils/imagePipeline.js

/**
 * Validates file type. Accepts JPEG, PNG, WEBP, and GIF.
 * @param {File} file - Original file
 * @returns {boolean} True if valid
 */
export const isValidImageType = (file) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return allowed.includes(file.type);
};

/**
 * Convers and compresses an image to WebP client-side using Canvas under 500KB.
 * @param {File} file - Original file object
 * @param {function} onProgress - Callback for status updates
 * @returns {Promise<{blob: Blob, originalSize: number, compressedSize: number, name: string}>}
 */
export const compressAndConvertToWebP = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!isValidImageType(file)) {
      return reject(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        let width = img.width;
        let height = img.height;
        let quality = 0.85;
        let scale = 1.0;
        let blob = null;
        
        onProgress('Converting to WebP...');

        const minQuality = 0.35;
        const targetSize = 500 * 1024; // 500KB

        // If file is already WebP/JPEG and under 500KB, we can skip heavy canvas loops
        if (file.size <= targetSize && file.type === 'image/webp') {
          onProgress('Image already optimized.');
          return resolve({
            blob: file,
            originalSize: file.size,
            compressedSize: file.size,
            name: file.name
          });
        }

        while (true) {
          const canvas = document.createElement('canvas');
          const currentWidth = Math.round(width * scale);
          const currentHeight = Math.round(height * scale);
          canvas.width = currentWidth;
          canvas.height = currentHeight;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

          onProgress(`Compressing... (Scale: ${Math.round(scale * 100)}%, Quality: ${Math.round(quality * 100)}%)`);

          blob = await new Promise((res) => {
            canvas.toBlob(res, 'image/webp', quality);
          });

          if (!blob) {
            return reject(new Error('Canvas WebP export failed.'));
          }

          // Stop if under 500KB target size
          if (blob.size <= targetSize) {
            break;
          }

          // Decrement quality first
          if (quality > minQuality) {
            quality = parseFloat((quality - 0.05).toFixed(2));
          } else {
            // If quality hits floor, scale down resolution and restart quality loop
            scale = parseFloat((scale - 0.1).toFixed(2));
            quality = 0.85;

            // Safeguard against infinite scaling down
            if (scale < 0.2) {
              break;
            }
          }
        }

        // Clean filename (replace extension with .webp)
        const dotIndex = file.name.lastIndexOf('.');
        const cleanName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;

        resolve({
          blob,
          originalSize: file.size,
          compressedSize: blob.size,
          name: `${cleanName}.webp`
        });
      };
      img.onerror = (err) => reject(new Error('Failed to load image file data: ' + err.message));
    };
    reader.onerror = (err) => reject(new Error('FileReader error: ' + err.message));
  });
};

/**
 * Uploads a file blob to ImgBB using the API Key.
 * @param {Blob|File} blob - Image blob
 * @param {string} filename - Filename string
 * @returns {Promise<{url: string, displayUrl: string, thumbUrl: string}>} URLs result
 */
export const uploadToImgBB = async (blob, filename) => {
  const apiKey = process.env.REACT_APP_IMGBB_API_KEY || window.env?.REACT_APP_IMGBB_API_KEY;
  if (!apiKey || apiKey === 'YOUR_IMGBB_API_KEY') {
    throw new Error('ImgBB API key is not configured in .env file (REACT_APP_IMGBB_API_KEY).');
  }

  const formData = new FormData();
  formData.append('image', blob, filename);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error?.message || `ImgBB server responded with status ${response.status}`);
  }

  const payload = await response.json();
  if (!payload.success) {
    throw new Error(payload.error?.message || 'ImgBB upload failed.');
  }

  return {
    url: payload.data.url,
    displayUrl: payload.data.display_url || payload.data.url,
    thumbUrl: payload.data.thumb?.url || payload.data.url
  };
};
