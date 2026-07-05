'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/sanity/lib/image';
import { PostCardTypes } from '@/types/Post';
import { getPosts } from '@/services/postService';
import { BlogCardSkeleton } from '@/components/skeletons';

export default function Blog() {
  const [posts, setPosts] = useState<PostCardTypes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPosts(10);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const AnimatedTitle = ({ text }: { text: string }) => {
    return (
      <h3 className="text-2xl font-semibold max-w-lg text-foreground group cursor-pointer">
        <span className="inline-flex flex-wrap">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className="relative inline-block group-hover:delay-(--delay)"
              style={{ '--delay': `${index * 30}ms` } as React.CSSProperties}
            >
              {char === ' ' ? '\u00A0' : char}
              <span className="absolute bottom-0 left-0 h-0.5 bg-primary w-0 group-hover:w-full transition-all duration-300 ease-linear"></span>
            </span>
          ))}
        </span>
      </h3>
    );
  };

  return (
    <section id="blog" className="relative md:py-20 py-10">
      <div className="container mx-auto md:px-6 px-3">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* LEFT COLUMN — Sticky */}
          <div className="lg:sticky lg:top-[10%] self-start">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <h2 className="text-[12rem] mr-60 -mt-28 md:text-[16rem] lg:text-[10rem] font-black mb-4 uppercase text-muted-foreground/20 md:block hidden">
                Blogs
              </h2>
            </div>
            <h2 className="text-5xl font-bold mb-6 text-foreground">News & Insight</h2>
            <p className="text-lg text-muted-foreground max-w-md mb-12">
              Strategists dedicated to creating stunning, functional websites that align with your
              unique business goals.
            </p>
            <Link
              href="/blogs"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View All Blogs
            </Link>
          </div>

          {/* RIGHT COLUMN — Scrollable */}
          <div className="relative max-h-auto overflow-y-auto ">
            {loading ? (
              <>
                {[1, 2].map((i) => (
                  <div key={i}>
                    <BlogCardSkeleton />
                  </div>
                ))}
              </>
            ) : posts.length === 0 ? (
              <p className="text-muted-foreground">No blog posts yet.</p>
            ) : (
              posts.slice(0, 2).map((post) => (
                <article key={post._id}>
                  {(() => {
                    const firstCategory = post.categories?.[0] as
                      | string
                      | { name?: string }
                      | undefined;
                    const categoryLabel =
                      typeof firstCategory === 'string' ? firstCategory : firstCategory?.name || '';

                    return (
                      <div className="mb-4">
                        {getImageUrl(post.mainImage) ? (
                          <Image
                            src={getImageUrl(post.mainImage, 800, 500) || ''}
                            alt={post.title}
                            width={800}
                            height={500}
                            className="w-full md:h-100 h-60 object-cover mb-4 rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-80 bg-slate-200 dark:bg-gray-800 mb-6 rounded-lg" />
                        )}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                          {categoryLabel ? (
                            <span className="px-4 py-0.5 border rounded-full bg-primary border-primary text-primary-foreground font-medium text-base">
                              {categoryLabel}
                            </span>
                          ) : null}
                          {categoryLabel ? <span>•</span> : null}
                          <span>
                            {post.publishedAt
                              ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : ''}
                          </span>
                        </div>
                        <Link href={`/blogs/${post.slug.current}`}>
                          <AnimatedTitle text={post.title} />
                        </Link>
                      </div>
                    );
                  })()}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
