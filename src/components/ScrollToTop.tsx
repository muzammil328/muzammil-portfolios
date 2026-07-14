'use client';
import { Button } from '@/components/ui';
import { ChevronIconTop } from '@/components/ui';

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
      aria-label="Scroll to top"
    >
      <ChevronIconTop />
    </Button>
  );
}
