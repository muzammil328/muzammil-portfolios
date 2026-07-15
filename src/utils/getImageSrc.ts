export function getImageSrc(data: { icon?: string | null; mainImage?: string | null }): string {
  return data.icon || data.mainImage || '/placeholder.svg';
}
