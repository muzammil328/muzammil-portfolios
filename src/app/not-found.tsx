import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[8rem] md:text-[12rem] font-bold leading-none tracking-tight text-muted/20">
            404
          </h1>
          <p className="text-2xl font-semibold mb-2">Page Not Found</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
