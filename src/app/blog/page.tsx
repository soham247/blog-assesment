'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/navigation';
import BlogPostCard from '@/components/blog-post-card';
import { BlogPostCardSkeleton } from '@/components/ui/loading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { useBlogStore } from '@/store';
import { Search, Filter } from 'lucide-react';

function BlogPageContent() {
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState('');
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useBlogStore();
  
  // Get URL parameters
  const categorySlug = searchParams.get('category');
  const searchParam = searchParams.get('search');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const limit = 9;
  const offset = (page - 1) * limit;
  
  // Get categories for filtering - FIX: Properly handle the data
  const { data: categoriesData, isLoading: categoriesLoading } = trpc.categories.getAll.useQuery();
  const categories = categoriesData ?? [];
  
  // Find category ID from slug
  const categoryFromSlug = categories.find((c) => c.slug === categorySlug);
  const categoryId = selectedCategory ?? categoryFromSlug?.id ?? null;
  
  // Get posts with filtering
  const { data: postsData, isLoading, error } = trpc.posts.getAll.useQuery({
    limit,
    offset,
    status: 'published',
    categoryId: categoryId ?? undefined,
    search: (searchQuery || searchParam || undefined),
  });
  
  // Update store when URL parameters change
  useEffect(() => {
    if (categoryFromSlug && selectedCategory !== categoryFromSlug.id) {
      setSelectedCategory(categoryFromSlug.id);
    }
    if (searchParam && searchQuery !== searchParam) {
      setSearchQuery(searchParam);
      setSearchInput(searchParam);
    }
  }, [categorySlug, searchParam, categoryFromSlug, selectedCategory, searchQuery, setSelectedCategory, setSearchQuery]);
  
  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };
  
  const handleCategoryChange = (value: string) => {
    const newCategoryId = value === 'all' ? null : parseInt(value);
    setSelectedCategory(newCategoryId);
    setPage(1);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSearchInput('');
    setSelectedCategory(null);
    setPage(1);
  };

  const posts = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;
  const totalPages = Math.ceil(totalPosts / limit);
  
  const selectedCategoryData = categories.find(c => c.id === categoryId);
  
  return (
      <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Blog Posts</h1>
          <p className="text-xl text-muted-foreground">
            Discover insights, tutorials, and thoughts on modern web development
          </p>
        </div>
        
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-9"
                />
              </div>
              <Button onClick={handleSearch}>
                Search
              </Button>
            </div>
            
            {/* Category Filter */}
            <div className="sm:w-64">
              <Select
                value={categoryId?.toString() || 'all'}
                onValueChange={handleCategoryChange}
                disabled={categoriesLoading}
              >
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name} ({category.postCount ?? 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Active Filters */}
          {(searchQuery || selectedCategoryData) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-2">
                  Search: {searchQuery}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchInput('');
                      setPage(1);
                    }}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-sm"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategoryData && (
                <Badge variant="secondary" className="gap-2">
                  Category: {selectedCategoryData.name}
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setPage(1);
                    }}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-sm"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        {/* Results Info */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : `Showing ${posts.length} of ${totalPosts} posts`}
          </p>
        </div>
        
        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogPostCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Error loading posts</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery || categoryId 
                ? 'No posts found matching your criteria.'
                : 'No posts available yet.'}
            </p>
            {(searchQuery || categoryId) && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {totalPages > 5 && (
                    <>
                      {page < totalPages - 2 && <span className="px-2">...</span>}
                      <Button
                        variant={page === totalPages ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background"><Navigation /><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><p className="text-muted-foreground">Loading...</p></div></div>}>
      <BlogPageContent />
    </Suspense>
  );
}
