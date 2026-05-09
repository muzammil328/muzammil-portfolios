import { PortableTextBlock } from '@portabletext/react';
import { SanityImageType, SanitySlugType } from '@muzammil328/sanity';

export interface PostCardTypes {
  _id: string;
  title: string;
  slug: SanitySlugType;
  publishedAt: string;
  mainImage: SanityImageType;
  author: { name: string };
  categories?: {
    name: string;
  }[];
}

export interface PostDetailTypes {
  _id: string;
  title: string;
  slug: SanitySlugType;
  publishedAt: string;
  mainImage: SanityImageType;
  author: { name: string };
  body: PortableTextBlock[];
  excerpt?: string;
  categories?: string[];
}
