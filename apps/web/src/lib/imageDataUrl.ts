/** Max size per file before read (mock / client-only uploads). */
export const MAX_IMAGE_UPLOAD_BYTES = 2 * 1024 * 1024;

const imageMime = /^image\/(jpeg|png|webp|gif)$/i;

export function assertImageFile(file: File, maxBytes = MAX_IMAGE_UPLOAD_BYTES): void {
  if (!imageMime.test(file.type)) {
    throw new Error("Use JPG, PNG, WebP, or GIF.");
  }
  if (file.size > maxBytes) {
    throw new Error(`Each image must be under ${Math.round(maxBytes / 1024 / 1024)} MB.`);
  }
}

export function readImageFileAsDataUrl(file: File, maxBytes = MAX_IMAGE_UPLOAD_BYTES): Promise<string> {
  assertImageFile(file, maxBytes);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read file."));
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export async function readImageFilesAsDataUrls(files: File[], maxBytes = MAX_IMAGE_UPLOAD_BYTES): Promise<string[]> {
  const out: string[] = [];
  for (const file of files) {
    out.push(await readImageFileAsDataUrl(file, maxBytes));
  }
  return out;
}
