'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { trpc } from '@/lib/trpc';
import { 
  FileText, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
} from 'lucide-react';
import { formatDistance } from 'date-fns';
import { toast } from 'sonner';

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  // Fetch posts
  const { data: postsData, isLoading, refetch } = trpc.posts.getAll.useQuery({
    limit: 50,
    offset: 0,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchQuery,
  });


  // Delete mutation
  const deleteMutation = trpc.posts.delete.useMutation({
    onSuccess: () => {
      toast.success('Post deleted successfully');
      refetch();
      setDeletePostId(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete post');
    },
  });

  // Update status mutation
  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: () => {
      toast.success('Post updated successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update post');
    },
  });

  const handleStatusChange = (postId: number, newStatus: 'published' | 'draft') => {
    updateMutation.mutate({
      id: postId,
      status: newStatus,
    });
  };

  const handleDelete = () => {
    if (deletePostId) {
      deleteMutation.mutate({ id: deletePostId });
    }
  };

  const posts = postsData?.posts || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Posts</h1>
            <p className="text-muted-foreground mt-2">
              Manage your blog posts
            </p>
          </div>
          
          <Button asChild>
            <Link href="/dashboard/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value: 'all' | 'published' | 'draft') => setStatusFilter(value)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              All Posts ({posts.length})
            </CardTitle>
            <CardDescription>
              {statusFilter !== 'all' && `Showing ${statusFilter} posts`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="h-8 w-16 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {searchQuery || statusFilter !== 'all' ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first blog post.'}
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/posts/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Post
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {post.title}
                        </h3>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>
                          Created {formatDistance(post.createdAt, new Date(), { addSuffix: true })}
                        </span>
                        {post.categories.length > 0 && (
                          <span>
                            {post.categories.map(cat => cat.name).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {post.status === 'published' && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/posts/${post.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/posts/${post.id}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          
                          {post.status === 'published' ? (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(post.id, 'draft')}
                            >
                              Unpublish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(post.id, 'published')}
                            >
                              Publish
                            </DropdownMenuItem>
                          )}
                          
                          {post.status === 'published' && (
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${post.slug}`} target="_blank">
                                <Eye className="mr-2 h-4 w-4" />
                                View Live
                              </Link>
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeletePostId(post.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}