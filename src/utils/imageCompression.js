// /* */
// /**
//  * Compress an image file by resizing it and reducing quality.
//  * @param {File} file - The image file to compress.
//  * @param {number} maxWidth - Maximum width of the output image (default 800px).
//  * @param {number} quality - JPEG quality from 0 to 1 (default 0.7).
//  * @returns {Promise<string>} - A promise that resolves to the Base64 string of the compressed image.
//  */

// export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (event) => {
//       const img = new Image();
//       img.src = event.target.result;
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         let width = img.width;
//         let height = img.height;

//         // Resize if width is greater than maxWidth
//         if (width > maxWidth) {
//           height = Math.round((height * maxWidth) / width);
//           width = maxWidth;
//         }

//         canvas.width = width;
//         canvas.height = height;

//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0, width, height);

//         // Convert to Base64 with quality reduction
//         const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
//         resolve(compressedBase64);
//       };
//       img.onerror = (error) => reject(error);
//     };
//     reader.onerror = (error) => reject(error);
//   });
// };
// */

/**
 * Compress an image file and return a Blob
 * @param {File} file - Original image file
 * @param {number} maxWidth - Maximum width (default 800px)
 * @param {number} quality - JPEG quality (0 to 1)
 * @return {Promise<Blob>}
 */
export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert a File or Blob to Base64 string
 * @param {File|Blob} file - Original file
 * @return {Promise<string>}
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert a Base64 string back to a File/Blob format for component state
 * @param {string} base64 - base64 data string
 * @param {string} filename - filename to give the created file
 * @return {File|null}
 */
export const base64ToFile = (base64, filename = "image.jpg") => {
  if (!base64 || !base64.startsWith("data:image")) return null;

  try {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error("Failed to convert base64 to file", error);
    return null;
  }
};
