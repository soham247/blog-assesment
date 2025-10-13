'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { generateSlug } from '@/lib/slug';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryEditorProps {
  categoryId?: number;
  onSave?: (categoryId: number) => void;
  onCancel?: () => void;
}

interface CategoryFormData {
  name: string;
  description: string;
}

export default function CategoryEditor({ categoryId, onSave, onCancel }: CategoryEditorProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing category if editing
  const { data: existingCategory, isLoading: loadingCategory } = trpc.categories.getById.useQuery(
    { id: categoryId! },
    { enabled: !!categoryId }
  );

  // Create mutation
  const createMutation = trpc.categories.create.useMutation({
    onSuccess: (data) => {
      toast.success('Category created successfully');
      if (onSave) {
        onSave(data.id);
      } else {
        router.push('/dashboard/categories');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
      setIsLoading(false);
    },
  });

  // Update mutation
  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: (data) => {
      toast.success('Category updated successfully');
      if (onSave) {
        onSave(data.id);
      } else {
        router.push('/dashboard/categories');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category');
      setIsLoading(false);
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingCategory) {
      setFormData({
        name: existingCategory.name,
        description: existingCategory.description || '',
      });
    }
  }, [existingCategory]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsLoading(true);

    if (categoryId) {
      updateMutation.mutate({
        id: categoryId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Generate slug preview
  const slugPreview = generateSlug(formData.name);

  if (loadingCategory && categoryId) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {categoryId ? 'Edit Category' : 'Create New Category'}
          </h1>
          {slugPreview && (
            <p className="text-sm text-muted-foreground mt-1">
              URL: /blog?category={slugPreview}
            </p>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => onCancel ? onCancel() : router.push('/dashboard/categories')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Set up your category name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter category name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this category is about..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  This will help users understand what posts to expect in this category.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {slugPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How your category will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium text-foreground">{formData.name || 'Category Name'}</h3>
                  {formData.description && (
                    <p className="text-sm text-muted-foreground mt-1">{formData.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Slug: {slugPreview}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {categoryId ? 'Update Category' : 'Create Category'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => onCancel ? onCancel() : router.push('/dashboard/categories')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}