"use client";

import { useEffect } from 'react';
import Navigation from '@/components/navigation';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Something went wrong</h1>
            <p className="mt-4 text-muted-foreground">
              An unexpected error occurred. You can try again or go back home.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button onClick={() => reset()}>Try again</Button>
              <Button variant="outline" asChild>
                <a href="/">Go to Home</a>
              </Button>
            </div>
            {error?.digest && (
              <p className="mt-6 text-xs text-muted-foreground">Error ID: {error.digest}</p>
            )}
          </main>
        </div>
      </body>
    </html>
  );
}
