import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateResearchCategory, useUpdateResearchCategory } from '@/hooks/useResearchAreas';
import type { ResearchCategory } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const categorySchema = z.object({
  category_code: z.string().min(1, 'Category code is required').max(10, 'Max 10 characters'),
  category_name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
  display_order: z.number().min(0).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface ResearchCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ResearchCategory | null;
  editionId: number;
}

export default function ResearchCategoryFormDialog({
  open,
  onOpenChange,
  category,
  editionId,
}: ResearchCategoryFormDialogProps) {
  const createCategory = useCreateResearchCategory(editionId);
  const updateCategory = useUpdateResearchCategory(editionId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        category_code: category.category_code,
        category_name: category.category_name,
        description: category.description || '',
        is_active: category.is_active,
        display_order: category.display_order || 0,
      });
    } else {
      reset({
        category_code: '',
        category_name: '',
        description: '',
        is_active: true,
        display_order: 0,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, data });
      } else {
        await createCategory.mutateAsync(data);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save research category:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Research Category' : 'Add Research Category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Update category information'
              : 'Add a new research category to the edition'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category_code">Category Code *</Label>
            <Input
              id="category_code"
              {...register('category_code')}
              placeholder="e.g., CS, EE, ME"
              maxLength={10}
            />
            {errors.category_code && (
              <p className="text-sm text-red-600">{errors.category_code.message}</p>
            )}
            <p className="text-xs text-gray-500">Short code (max 10 characters)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_name">Category Name *</Label>
            <Input
              id="category_name"
              {...register('category_name')}
              placeholder="e.g., Computer Science"
            />
            {errors.category_name && (
              <p className="text-sm text-red-600">{errors.category_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of this category"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              {...register('display_order', { valueAsNumber: true })}
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500">Lower numbers appear first</p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="rounded"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active (visible to users)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCategory.isPending || updateCategory.isPending}
            >
              {createCategory.isPending || updateCategory.isPending
                ? 'Saving...'
                : category
                ? 'Update Category'
                : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
