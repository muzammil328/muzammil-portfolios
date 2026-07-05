import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/sanity/lib/image';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { BlogCardSkeleton } from '@/components/skeletons/BlogCardSkeleton';
import { PostCardTypes } from '@/types/Post';
import { getPosts } from '@/services/postService';

export const metadata = {
  title: 'Blog | Muzammil Safdar',
  description:
    'Read my latest articles and tutorials about web development, programming, and technology.',
};

async function BlogPostsGrid() {
  let posts: PostCardTypes[] = [];

  try {
    posts = await getPosts();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-5 gap-4 items-start">
      {posts.map((post: PostCardTypes) => (
        <div key={post._id} className="rounded-bl-md rounded-br-md relative">
          <div className="image relative overflow-hidden w-full h-auto">
            {getImageUrl(post.mainImage) ? (
              <Image
                src={getImageUrl(post.mainImage, 720, 400) || ''}
                alt={post.title}
                height={700}
                width={720}
                className="w-full h-64 md:h-56 lg:h-52 rounded-tl-lg object-cover rounded-tr-lg duration-300 ease-in-out blogCard-img hover:scale-105 transition-transform"
              />
            ) : (
              <div className="bg-slate-200 dark:bg-gray-800 h-64 md:h-56 lg:h-52 rounded-tl-lg rounded-tr-lg" />
            )}
          </div>
          <div className="flex flex-col items-start rounded-bl-md rounded-br-md bg-slate-100 dark:bg-gray-900 px-3 py-5">
            <Link
              href={`/blogs/${post.slug.current}`}
              title={post.title}
              className="hover:text-primary transition-colors text-2xl mb-2 font-semibold"
            >
              {post.title}
            </Link>
            <div className="flex flex-row gap-4 py-2 items-center">
              <span>By {post.author?.name || 'Muzammil'}</span>
              <span> | </span>
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <div>
      <Navbar />
      <section className="section container mx-auto px-4 pt-16 md:pt-20">
        <div className="mb-8 md:mb-10 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <h2 className="text-[8rem] md:text-[12rem] lg:text-[10rem] font-black uppercase text-muted-foreground/20">
              BLOG
            </h2>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
            My Blog
          </h3>
          <p className="text-lg text-muted-foreground">Latest articles and tutorials</p>
        </div>

        <Suspense
          fallback={
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-5 gap-4 items-start">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <BlogPostsGrid />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
