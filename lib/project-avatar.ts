export function projectDicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/identicon/svg?rowColor=546e7a&backgroundColor=d1d4f9,ffd5dc,b6e3f4,ffdfbf&seed=${encodeURIComponent(seed)}`;
}

/** Image types the project icon upload accepts. */
export const PROJECT_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const PROJECT_IMAGE_ACCEPT = PROJECT_IMAGE_TYPES.join(",");

export const MAX_PROJECT_IMAGE_BYTES = 1024 * 1024;

/** Returns an error message when the file can't be used as a project icon. */
export function validateProjectImage(file: File): string | null {
  if (!(PROJECT_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Image must be a PNG, JPEG or WebP";
  }
  if (file.size > MAX_PROJECT_IMAGE_BYTES) {
    return "Image must be 1MB or smaller";
  }
  return null;
}
