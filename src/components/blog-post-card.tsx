import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';

interface BlogPostCardProps {
  post: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    status: 'draft' | 'published';
    publishedAt: Date | null;
    createdAt: Date;
    categories: Array<{
      id: number;
      name: string;
      slug: string;
    }>;
  };
  showStatus?: boolean;
}

export default function BlogPostCard({ post, showStatus = false }: BlogPostCardProps) {
  const displayDate = post.publishedAt || post.createdAt;
  const timeAgo = formatDistance(displayDate, new Date(), { addSuffix: true });

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="line-clamp-2 pb-1">
            <Link 
              href={`/blog/${post.slug}`}
              className="hover:text-primary transition-colors"
            >
              {post.title}
            </Link>
          </CardTitle>
          {showStatus && (
            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
              {post.status}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {post.categories.map((category) => (
            <Badge key={category.id} variant="outline">
              <Link 
                href={`/blog?category=${category.slug}`}
                className="hover:text-primary"
              >
                {category.name}
              </Link>
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <time dateTime={displayDate.toISOString()}>
            {timeAgo}
          </time>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="text-primary hover:underline font-medium"
          >
            Read more →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}