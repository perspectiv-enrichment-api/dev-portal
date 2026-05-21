export function projectDicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/identicon/svg?rowColor=546e7a&backgroundColor=d1d4f9,ffd5dc,b6e3f4,ffdfbf&seed=${encodeURIComponent(seed)}`;
}
