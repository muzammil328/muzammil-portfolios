import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableTextView } from '@muzammil328/ui';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { getImageUrl } from '@/sanity/lib/image';
import { PostDetailTypes } from '@/types/Post';
import { getPostBySlug } from '@/services/postService';

const siteUrl = 'https://mmuzammil-portfolio.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Not Found | Muzammil Portfolio',
      description: 'The requested blog post could not be found.',
    };
  }

  const imageUrl = getImageUrl(post.mainImage, 1200, 630);
  const publishDate = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;
  const authorName = post.author?.name || 'Muzammil';

  const keywords = [
    'Muzammil',
    'Portfolio',
    'Developer',
    'Web Developer',
    'React',
    'Next.js',
    ...(post.categories || []),
    ...post.title.split(' ').filter(Boolean),
  ];

  return {
    title: `${post.title} | Muzammil`,
    description:
      post.excerpt ||
      `Read ${post.title} by ${authorName}. A blog post on Muzammil's portfolio about web development, React, Next.js, and more.`,
    keywords: [...new Set(keywords)],
    authors: [{ name: authorName }],
    creator: authorName,
    publisher: authorName,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} by ${authorName}`,
      type: 'article',
      url: `${siteUrl}/blogs/${slug}`,
      siteName: 'Muzammil Portfolio',
      locale: 'en_US',
      publishedTime: publishDate,
      modifiedTime: publishDate,
      authors: [authorName],
      tags: post.categories || [],
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `Read ${post.title} by ${authorName}`,
      creator: '@muzammil',
      images: imageUrl ? [imageUrl] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${siteUrl}/blogs/${slug}`,
    },
  };
}

function generateSchema(post: PostDetailTypes, imageUrl: string | null) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || `Read ${post.title}`,
    image: imageUrl || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.publishedAt || undefined,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Muzammil',
    },
    publisher: {
      '@type': 'Person',
      name: 'Muzammil',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blogs/${post.slug.current}`,
    },
    keywords: (post.categories || []).join(', '),
  };

  return schema;
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const imageUrl = getImageUrl(post.mainImage, 1200, 630);
  const authorName = post.author?.name || 'Muzammil';
  const schema = generateSchema(post, imageUrl);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-muted-foreground mb-8">
              <span>By {authorName}</span>
              <span>•</span>
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''}
              </span>
              {post.categories && post.categories.length > 0 && (
                <>
                  <span>•</span>
                  <span>{post.categories.join(', ')}</span>
                </>
              )}
            </div>

            {imageUrl && (
              <div className="relative w-full h-75 md:h-100 mb-8">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover rounded-lg"
                  priority
                />
              </div>
            )}

            <PortableTextView value={post.body} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
