/**
 * Shared image loading with friendly error messages.
 */

/**
 * Load an image file into an HTMLImageElement.
 * Returns the loaded image, or throws a user-friendly error.
 *
 * @throws Error with a user-friendly message on load failure.
 */
export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          `"${file.name}" could not be loaded. The image may be corrupted or in an unsupported format.`
        )
      );
    };

    img.src = url;
  });
}

/**
 * Load an image from a URL (data URL, blob URL, or remote).
 * Returns the loaded image, or throws a user-friendly error.
 */
export async function loadImageFromUrl(url: string, sourceName?: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);

    img.onerror = () => {
      const name = sourceName ? `"${sourceName}"` : 'The image';
      reject(
        new Error(
          `${name} could not be loaded. It may be corrupted or in an unsupported format.`
        )
      );
    };

    img.src = url;
  });
}