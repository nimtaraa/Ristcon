import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateResearchArea, useUpdateResearchArea } from '@/hooks/useResearchAreas';
import type { ResearchArea } from '@/types/api';
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
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const areaSchema = z.object({
  area_name: z.string().min(1, 'Area name is required'),
  is_active: z.boolean().optional(),
  display_order: z.number().min(0).optional(),
});

type AreaFormData = z.infer<typeof areaSchema>;

interface ResearchAreaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area: ResearchArea | null;
  categoryId: number;
}

export default function ResearchAreaFormDialog({
  open,
  onOpenChange,
  area,
  categoryId,
}: ResearchAreaFormDialogProps) {
  const createArea = useCreateResearchArea(categoryId);
  const updateArea = useUpdateResearchArea(categoryId);
  const [alternateNames, setAlternateNames] = useState<string[]>([]);
  const [alternateInput, setAlternateInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
    defaultValues: {
      is_active: true,
      display_order: 0,
    },
  });

  useEffect(() => {
    if (area) {
      reset({
        area_name: area.area_name,
        is_active: area.is_active,
        display_order: area.display_order || 0,
      });
      setAlternateNames(area.alternate_names || []);
    } else {
      reset({
        area_name: '',
        is_active: true,
        display_order: 0,
      });
      setAlternateNames([]);
    }
    setAlternateInput('');
  }, [area, reset]);

  const addAlternateName = () => {
    if (alternateInput.trim() && !alternateNames.includes(alternateInput.trim())) {
      setAlternateNames([...alternateNames, alternateInput.trim()]);
      setAlternateInput('');
    }
  };

  const removeAlternateName = (name: string) => {
    setAlternateNames(alternateNames.filter((n) => n !== name));
  };

  const onSubmit = async (data: AreaFormData) => {
    try {
      const payload = {
        ...data,
        alternate_names: alternateNames.length > 0 ? alternateNames : undefined,
      };

      if (area) {
        await updateArea.mutateAsync({ id: area.id, data: payload });
      } else {
        await createArea.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save research area:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {area ? 'Edit Research Area' : 'Add Research Area'}
          </DialogTitle>
          <DialogDescription>
            {area
              ? 'Update research area information'
              : 'Add a new research area to this category'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area_name">Area Name *</Label>
            <Input
              id="area_name"
              {...register('area_name')}
              placeholder="e.g., Artificial Intelligence"
            />
            {errors.area_name && (
              <p className="text-sm text-red-600">{errors.area_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Alternate Names (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={alternateInput}
                onChange={(e) => setAlternateInput(e.target.value)}
                placeholder="Add alternate name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAlternateName();
                  }
                }}
              />
              <Button type="button" onClick={addAlternateName} variant="outline">
                Add
              </Button>
            </div>
            {alternateNames.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {alternateNames.map((name) => (
                  <Badge key={name} variant="secondary" className="text-sm">
                    {name}
                    <button
                      type="button"
                      onClick={() => removeAlternateName(name)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Alternative names or synonyms for this research area
            </p>
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
              disabled={createArea.isPending || updateArea.isPending}
            >
              {createArea.isPending || updateArea.isPending
                ? 'Saving...'
                : area
                ? 'Update Area'
                : 'Create Area'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
