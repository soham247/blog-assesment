'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { generateSlug } from '@/lib/slug';
import { Save, Eye, X } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface PostEditorProps {
  postId?: number;
  onSave?: (postId: number) => void;
  onCancel?: () => void;
}

interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  categoryIds: number[];
}

export default function PostEditor({ postId, onSave, onCancel }: PostEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    categoryIds: [],
  });
  const [selectedCategories, setSelectedCategories] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing post if editing
  const { data: existingPost, isLoading: loadingPost } = trpc.posts.getById.useQuery(
    { id: postId! },
    { enabled: !!postId }
  );

  // Fetch categories
  const { data: categories = [] } = trpc.categories.getAll.useQuery();

  // Create mutation
  const createMutation = trpc.posts.create.useMutation({
    onSuccess: (data) => {
      toast.success('Post created successfully');
      if (onSave) {
        onSave(data.id);
      } else {
        router.push(`/dashboard/posts/${data.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create post');
      setIsLoading(false);
    },
  });

  // Update mutation
  const updateMutation = trpc.posts.update.useMutation({
    onSuccess: (data) => {
      toast.success('Post updated successfully');
      if (onSave) {
        onSave(data.id);
      } else {
        router.push('/dashboard/posts');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update post');
      setIsLoading(false);
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingPost) {
      setFormData({
        title: existingPost.title,
        content: existingPost.content,
        excerpt: existingPost.excerpt || '',
        status: existingPost.status,
        categoryIds: existingPost.categories.map(c => c.id),
      });
      setSelectedCategories(existingPost.categories);
    }
  }, [existingPost]);

  // Handle form submission
  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setIsLoading(true);

    const submitData = {
      ...formData,
      status,
      categoryIds: selectedCategories.map(c => c.id),
    };

    if (postId) {
      updateMutation.mutate({
        id: postId,
        ...submitData,
      });
    } else {
      createMutation.mutate(submitData);
    }
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const id = parseInt(categoryId);
    const category = categories.find(c => c.id === id);
    
    if (category && !selectedCategories.find(c => c.id === id)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Remove category
  const removeCategory = (categoryId: number) => {
    setSelectedCategories(selectedCategories.filter(c => c.id !== categoryId));
  };

  // Generate slug preview
  const slugPreview = generateSlug(formData.title);

  if (loadingPost && postId) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {postId ? 'Edit Post' : 'Create New Post'}
          </h1>
          {slugPreview && (
            <p className="text-sm text-muted-foreground mt-1 break-all">
              URL: /blog/{slugPreview}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="outline"
            onClick={() => onCancel ? onCancel() : router.push('/dashboard/posts')}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleSubmit('draft')}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          
          <Button
            onClick={() => handleSubmit('published')}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <Eye className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Post Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter post title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Write your post content in Markdown format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="write">
                  <Textarea
                    placeholder="Write your post content here... You can use Markdown syntax!"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="min-h-[400px] font-mono"
                  />
                </TabsContent>
                
                <TabsContent value="preview">
                  <div className="min-h-[400px] border rounded-lg p-4">
                    {formData.content ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                        components={{
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
                        {formData.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-muted-foreground italic">
                        Content preview will appear here...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'draft' | 'published') => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label>Excerpt (Optional)</Label>
                <Textarea
                  placeholder="Brief description of your post..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  This will be shown in post previews and search results.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Organize your post with categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label>Add Category</Label>
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter(category => !selectedCategories.find(c => c.id === category.id))
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Categories */}
              {selectedCategories.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <Badge key={category.id} variant="secondary" className="gap-1">
                        {category.name}
                        <button
                          onClick={() => removeCategory(category.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}