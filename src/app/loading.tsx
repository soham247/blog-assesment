import Navigation from '@/components/navigation';
import Loading, { BlogPostCardSkeleton } from '@/components/ui/loading';

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col items-center gap-6">
          <Loading size="lg" />
          <p className="text-muted-foreground">Loading content…</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogPostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
