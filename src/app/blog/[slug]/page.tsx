'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = trpc.posts.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
    );
  }

  if (error || !post) {
    notFound();
  }

  const displayDate = post.publishedAt || post.createdAt;

  return (
    <div>
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <Badge key={category.id} variant="secondary" asChild>
                    <Link href={`/blog?category=${category.slug}`}>
                      {category.name}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <time dateTime={displayDate.toISOString()}>
              {format(displayDate, 'MMMM d, yyyy')}
            </time>
            {post.status === 'published' && post.publishedAt && (
              <span className="ml-2">• Published</span>
            )}
            {post.status === 'draft' && (
              <span className="ml-2">• Draft</span>
            )}
          </div>

          <Separator className="mt-6" />
        </header>

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeHighlight]}
            components={{
              // Custom components for better styling
              h1: ({ ...props }) => (
                <h1 className="text-3xl font-bold text-foreground mt-8 mb-4" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-2xl font-semibold text-foreground mt-7 mb-3" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-xl font-medium text-foreground mt-6 mb-3" {...props} />
              ),
              p: ({ ...props }) => (
                <p className="text-foreground leading-relaxed mb-4" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc list-inside mb-4 space-y-2 text-foreground" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground" {...props} />
              ),
              code: ({ ...props }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...props} />
              ),
              pre: ({ ...props }) => (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props} />
              ),
              a: ({ ...props }) => (
                <a className="text-primary hover:underline" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Post Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="text-center">
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Posts
              </Link>
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
}