import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ className, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-muted border-t-primary',
          sizeClasses[size]
        )}
      />
    </div>
  );
}

// Skeleton components for loading states
export function BlogPostCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-4 bg-muted rounded w-1/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}