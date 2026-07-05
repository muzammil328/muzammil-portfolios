import { createImageUrlBuilder, SanityImageSource } from '@sanity/image-url';
import { SanityImageType } from '@/types/sanity';
import { dataset, projectId } from '../env';

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

export function getImageUrl(image: SanityImageType, width = 800, height = 500): string | null {
  if (!image || !image.asset?._ref) return null;
  try {
    return urlFor(image).width(width).height(height).url();
  } catch {
    return null;
  }
}
