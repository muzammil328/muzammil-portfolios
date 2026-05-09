import { client } from '@/sanity/lib/client';
import { PostDetailTypes } from '@/types/Post';

export interface SitemapPost {
  slug: string;
  publishedAt: string;
}

export async function getPosts(limit = 10) {
  const query = `*[_type == "post"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "categories": categories[]->name
  }`;
  return client.fetch(query);
}

export async function getPostBySlug(slug: string): Promise<PostDetailTypes | null> {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    "author": author->{name},
    body,
    excerpt,
    "categories": categories[]->title
  }`;
  return client.fetch(query, { slug });
}

export async function getSitemapPosts(): Promise<SitemapPost[]> {
  const query = `*[_type == "post" && defined(slug.current)]{
    "slug": slug.current,
    "publishedAt": publishedAt
  }`;
  return client.fetch(query);
}
