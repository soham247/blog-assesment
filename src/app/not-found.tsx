import Link from 'next/link';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-lg text-muted-foreground">404</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/blog">Browse Blog</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
