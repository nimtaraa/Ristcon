import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateDate, useUpdateDate } from '@/hooks/useDates';
import type { ImportantDate } from '@/types/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const dateSchema = z.object({
  date_type: z.enum(['submission_deadline', 'notification', 'camera_ready', 'conference_date', 'registration_deadline', 'other']),
  date_value: z.string().min(1, 'Date is required'),
  is_extended: z.boolean().optional(),
  display_label: z.string().min(1, 'Label is required'),
  notes: z.string().optional(),
  display_order: z.number().min(0).optional(),
});

type DateFormData = z.infer<typeof dateSchema>;

interface DateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: ImportantDate | null;
  editionId: number;
}

export default function DateFormDialog({
  open,
  onOpenChange,
  date,
  editionId,
}: DateFormDialogProps) {
  const createDate = useCreateDate(editionId);
  const updateDate = useUpdateDate(editionId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DateFormData>({
    resolver: zodResolver(dateSchema),
    defaultValues: {
      date_type: 'submission_deadline',
      is_extended: false,
      display_order: 0,
    },
  });

  const dateType = watch('date_type');
  const isExtended = watch('is_extended');

  useEffect(() => {
    if (date) {
      reset({
        date_type: date.date_type,
        date_value: date.date_value.split('T')[0], // Format for date input
        is_extended: date.is_extended,
        display_label: date.display_label,
        notes: date.notes || '',
        display_order: date.display_order || 0,
      });
    } else {
      reset({
        date_type: 'submission_deadline',
        date_value: '',
        is_extended: false,
        display_label: '',
        notes: '',
        display_order: 0,
      });
    }
  }, [date, reset]);

  const onSubmit = async (data: DateFormData) => {
    try {
      if (date) {
        await updateDate.mutateAsync({
          id: date.id,
          data: {
            ...data,
            notes: data.notes || undefined,
          },
        });
      } else {
        await createDate.mutateAsync({
          ...data,
          notes: data.notes || undefined,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save date:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{date ? 'Edit Important Date' : 'Add Important Date'}</DialogTitle>
          <DialogDescription>
            {date
              ? 'Update the important date information'
              : 'Add a new important date to this conference edition'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_label">Date Label *</Label>
            <Input
              id="display_label"
              {...register('display_label')}
              placeholder="e.g., Abstract Submission Deadline"
            />
            {errors.display_label && (
              <p className="text-sm text-red-600">{errors.display_label.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_type">Date Type *</Label>
              <Select
                value={dateType || 'submission_deadline'}
                onValueChange={(value) =>
                  setValue('date_type', value as DateFormData['date_type'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submission_deadline">Submission Deadline</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="camera_ready">Camera Ready</SelectItem>
                  <SelectItem value="conference_date">Conference Date</SelectItem>
                  <SelectItem value="registration_deadline">Registration Deadline</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_value">Date *</Label>
              <Input id="date_value" type="date" {...register('date_value')} />
              {errors.date_value && (
                <p className="text-sm text-red-600">{errors.date_value.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              rows={3}
              placeholder="Additional information about this date..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              {...register('display_order', { valueAsNumber: true })}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">
              Lower numbers appear first
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDate.isPending || updateDate.isPending}>
              {createDate.isPending || updateDate.isPending
                ? 'Saving...'
                : date
                ? 'Update Date'
                : 'Create Date'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
