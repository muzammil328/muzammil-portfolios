'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { PostCardTypes } from '@/types/Post';
import { getImageUrl } from '@/sanity/lib/image';

export function BlogCard({ postMetadata }: { postMetadata: PostCardTypes[] }) {
  return (
    <section className="px-3">
      <div className="container mx-auto">
        <div className="text-center mr-6 py-10 relative">
          <motion.div
            className="mb-4"
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{
              y: 0,
              opacity: 1,
              transition: {
                delay: 0.6,
                duration: 0.5,
              },
            }}
          >
            <span>DAILY UPDATE</span>
          </motion.div>
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{
              y: 0,
              opacity: 1,
              transition: {
                delay: 0.8,
                duration: 0.5,
              },
            }}
          >
            <h3 className="text-destructive text-xl">Latest News & Blogs</h3>
          </motion.div>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 md:gap-4 gap-2 items-center">
          {postMetadata.map((datas: PostCardTypes) => (
            <motion.div
              initial={{ y: '40%', opacity: 0 }}
              whileInView={{
                y: 0,
                opacity: 1,
                transition: {
                  delay: 0.7,
                  duration: 0.8,
                },
              }}
              key={datas.title}
            >
              <div className="rounded-bl-md rounded-br-md mt-5 relative" key={datas.title}>
                <div className="image relative overflow-hidden w-full h-auto">
                  <Image
                    src={getImageUrl(datas.mainImage, 720, 400) ?? '/placeholder.jpg'}
                    alt={datas.title}
                    height={1280}
                    width={720}
                    className="rounded-tl-lg rounded-tr-lg duration-300 ease-in-out blogCard-img"
                  />
                </div>
                <div className="flex flex-col items-start rounded-bl-md rounded-br-md bg-slate-100 dark:bg-gray-900 px-3 py-5">
                  <Link href={`/blogs/${datas.slug}`} title={datas.title}>
                    {datas.title}
                  </Link>
                  <div className="flex flex-row gap-4 py-2 items-center">
                    <span>By Muzammil</span>
                    <span> | </span>
                    <span>{datas.publishedAt}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        className="flex items-center justify-center my-8"
        initial={{ x: '40%', opacity: 0 }}
        whileInView={{
          x: 0,
          opacity: 1,
          transition: {
            delay: 0.7,
            duration: 0.8,
          },
        }}
      >
        <Button asChild>
          <Link href="/blogs" title="View All Blogs">
            View All Blogs
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
