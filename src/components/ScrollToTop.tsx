'use client';
import React from 'react';
import { Button } from '@muzammil328/ui';
import { ChevronIconTop } from '@muzammil328/icon';

export default function ScrollToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Button
      className="fixed bottom-10 right-5"
      size="icon"
      variant="destructive"
      onClick={scrollToTop}
    >
      <ChevronIconTop />
    </Button>
  );
}
