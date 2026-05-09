import { urlFor } from '@/sanity/lib/image';
import { SanityImageSource } from '@sanity/image-url';

export function getImageSrc(
  data: {
    icon?: SanityImageSource;
    mainImage?: SanityImageSource;
  },
  width = 800,
  height?: number
): string {
  const imageSource = data.icon || data.mainImage;
  if (imageSource) {
    try {
      const builder = urlFor(imageSource).width(width);
      if (height) {
        return builder.height(height).url();
      }
      return builder.auto('format').url();
    } catch {
      return '/placeholder.svg';
    }
  }
  return '/placeholder.svg';
}
