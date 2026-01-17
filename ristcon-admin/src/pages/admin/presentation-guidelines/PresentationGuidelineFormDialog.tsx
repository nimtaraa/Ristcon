import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePresentationGuideline, useUpdatePresentationGuideline } from '@/hooks/usePresentationGuidelines';
import type { PresentationGuideline } from '@/types/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const guidelineSchema = z.object({
  presentation_type: z.enum(['oral', 'poster', 'workshop', 'panel']),
  presentation_minutes: z.number().min(0).optional(),
  qa_minutes: z.number().min(0).optional(),
  poster_width: z.number().min(0).optional(),
  poster_height: z.number().min(0).optional(),
  physical_presence_required: z.boolean(),
});

type GuidelineFormValues = z.infer<typeof guidelineSchema>;

interface PresentationGuidelineFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guideline?: PresentationGuideline | null;
  editionId: number;
}

export default function PresentationGuidelineFormDialog({
  open,
  onOpenChange,
  guideline,
  editionId,
}: PresentationGuidelineFormDialogProps) {
  const createGuideline = useCreatePresentationGuideline(editionId);
  const updateGuideline = useUpdatePresentationGuideline(editionId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<GuidelineFormValues>({
    resolver: zodResolver(guidelineSchema),
    defaultValues: {
      presentation_type: 'oral',
      presentation_minutes: undefined,
      qa_minutes: undefined,
      poster_width: undefined,
      poster_height: undefined,
      physical_presence_required: true,
    },
  });

  const presentationType = watch('presentation_type');
  const physicalPresence = watch('physical_presence_required');

  useEffect(() => {
    if (guideline) {
      reset({
        presentation_type: guideline.presentation_type,
        presentation_minutes: guideline.presentation_minutes,
        qa_minutes: guideline.qa_minutes,
        poster_width: guideline.poster_width,
        poster_height: guideline.poster_height,
        physical_presence_required: guideline.physical_presence_required,
      });
    } else {
      reset({
        presentation_type: 'oral',
        presentation_minutes: undefined,
        qa_minutes: undefined,
        poster_width: undefined,
        poster_height: undefined,
        physical_presence_required: true,
      });
    }
  }, [guideline, reset]);

  const onSubmit = async (data: GuidelineFormValues) => {
    if (guideline) {
      await updateGuideline.mutateAsync({ id: guideline.id, data });
    } else {
      await createGuideline.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const isPosterType = presentationType === 'poster';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{guideline ? 'Edit Presentation Guideline' : 'Add Presentation Guideline'}</DialogTitle>
          <DialogDescription>
            {guideline ? 'Update the presentation guideline details.' : 'Add a new presentation guideline.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="presentation_type">Presentation Type *</Label>
            <Select
              value={presentationType || 'oral'}
              onValueChange={(value) => setValue('presentation_type', value as any)}
            >
              <SelectTrigger id="presentation_type" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oral">Oral Presentation</SelectItem>
                <SelectItem value="poster">Poster Presentation</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="panel">Panel Discussion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isPosterType && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="presentation_minutes">Presentation Duration (minutes)</Label>
                <Input
                  id="presentation_minutes"
                  type="number"
                  {...register('presentation_minutes', {
                    setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)),
                  })}
                  placeholder="e.g., 15"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="qa_minutes">Q&A Duration (minutes)</Label>
                <Input
                  id="qa_minutes"
                  type="number"
                  {...register('qa_minutes', {
                    setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)),
                  })}
                  placeholder="e.g., 5"
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {isPosterType && (
            <div>
              <Label>Poster Dimensions (cm)</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Input
                    id="poster_width"
                    type="number"
                    {...register('poster_width', {
                      setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)),
                    })}
                    placeholder="Width in cm"
                  />
                </div>
                <div>
                  <Input
                    id="poster_height"
                    type="number"
                    {...register('poster_height', {
                      setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)),
                    })}
                    placeholder="Height in cm"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Standard poster size (e.g., 90 cm × 120 cm)
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="physical_presence_required"
              checked={physicalPresence}
              onCheckedChange={(checked) => setValue('physical_presence_required', checked as boolean)}
            />
            <label htmlFor="physical_presence_required" className="text-sm font-medium">
              Physical presence required
            </label>
          </div>
          <p className="text-sm text-gray-500 ml-6">
            Check if the presenter must attend in person
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createGuideline.isPending || updateGuideline.isPending}
            >
              {createGuideline.isPending || updateGuideline.isPending
                ? guideline
                  ? 'Updating...'
                  : 'Creating...'
                : guideline
                ? 'Update Guideline'
                : 'Create Guideline'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
