import React from 'react';
import Link from 'next/link';
import { LinkIcon } from '@muzammil328/icon';

export default function RecentlyLaunched() {
  return (
    <section className="py-12">
      <div className="flex flex-col lg:flex-row min-h-125 items-start gap-4">
        <div
          className="w-full lg:w-3/4 min-h-125
                bg-[url('/saas-product-design.png')] bg-no-repeat
                bg-cover bg-center bg-fixed"
        ></div>

        <div className="w-full lg:w-1/4 h-125 flex flex-col items-start bg-primary text-primary-foreground py-12 bg-[url('https://html.aqlova.com/aleric-prevs/aleric/assets/img/hero/grid-shape.png')] bg-no-repeat bg-cover">
          <span className="tp-hero-bottom-border mb-5 mx-auto">
            <svg
              height="6"
              width="320"
              viewBox="0 0 380 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 2.5L0 0.113249V5.88675L5 3.5V2.5ZM375 3.5L380 5.88675V0.113249L375 2.5V3.5ZM4.5 3.5H375.5V2.5H4.5V3.5Z"
                fill="currentColor"
              ></path>
            </svg>
          </span>
          <span className="px-5 text-sm text-white">We Coming Launched</span>
          <ul className="space-y-2 px-5 mb-6 mt-4 h-80 flex flex-col w-full">
            <li className="text-xl font-bold flex items-center justify-between w-full">
              <span>Survey Management</span>
              <Link href="#" className="text-white hover:text-primary-foreground">
                <LinkIcon />
              </Link>
            </li>
          </ul>
          <div className="h-1.5 bg-primary w-full" />
        </div>
      </div>
    </section>
  );
}
