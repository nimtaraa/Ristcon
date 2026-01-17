import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRegistrationFee, useUpdateRegistrationFee } from '@/hooks/useRegistrationFees';
import type { RegistrationFee } from '@/types/api';
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
import { Checkbox } from '@/components/ui/checkbox';

const feeSchema = z.object({
  attendee_type: z.string().min(1, 'Attendee type is required'),
  currency: z.string().min(3, 'Currency code is required (e.g., USD)').max(3),
  amount: z.number().min(0, 'Amount must be positive'),
  early_bird_amount: z.number().min(0).nullable(),
  early_bird_deadline: z.string().nullable(),
  display_order: z.number().min(0),
  is_active: z.boolean(),
});

type FeeFormValues = z.infer<typeof feeSchema>;

interface RegistrationFeeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee?: RegistrationFee | null;
  editionId: number;
}

export default function RegistrationFeeFormDialog({
  open,
  onOpenChange,
  fee,
  editionId,
}: RegistrationFeeFormDialogProps) {
  const createFee = useCreateRegistrationFee(editionId);
  const updateFee = useUpdateRegistrationFee(editionId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      attendee_type: '',
      currency: 'USD',
      amount: 0,
      early_bird_amount: null,
      early_bird_deadline: null,
      display_order: 0,
      is_active: true,
    },
  });

  const isActive = watch('is_active');

  useEffect(() => {
    if (fee) {
      reset({
        attendee_type: fee.attendee_type,
        currency: fee.currency,
        amount: fee.amount,
        early_bird_amount: fee.early_bird_amount,
        early_bird_deadline: fee.early_bird_deadline,
        display_order: fee.display_order,
        is_active: fee.is_active,
      });
    } else {
      reset({
        attendee_type: '',
        currency: 'USD',
        amount: 0,
        early_bird_amount: null,
        early_bird_deadline: null,
        display_order: 0,
        is_active: true,
      });
    }
  }, [fee, reset]);

  const onSubmit = async (data: FeeFormValues) => {
    if (fee) {
      await updateFee.mutateAsync({ id: fee.id, data });
    } else {
      await createFee.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{fee ? 'Edit Registration Fee' : 'Add Registration Fee'}</DialogTitle>
          <DialogDescription>
            {fee ? 'Update the registration fee details.' : 'Add a new registration fee.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="attendee_type">Attendee Type *</Label>
              <Input
                id="attendee_type"
                {...register('attendee_type')}
                placeholder="e.g., Student, Academic, Industry"
                className="mt-2"
              />
              {errors.attendee_type && (
                <p className="text-red-500 text-sm mt-1">{errors.attendee_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Input
                id="currency"
                {...register('currency')}
                placeholder="USD"
                maxLength={3}
                className="mt-2"
              />
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Regular Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="mt-2"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="early_bird_amount">Early Bird Amount</Label>
              <Input
                id="early_bird_amount"
                type="number"
                step="0.01"
                {...register('early_bird_amount', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
                className="mt-2"
                placeholder="Optional"
              />
              {errors.early_bird_amount && (
                <p className="text-red-500 text-sm mt-1">{errors.early_bird_amount.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="early_bird_deadline">Early Bird Deadline</Label>
            <Input
              id="early_bird_deadline"
              type="date"
              {...register('early_bird_deadline')}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">Deadline for early bird pricing</p>
          </div>

          <div>
            <Label htmlFor="display_order">Display Order *</Label>
            <Input
              id="display_order"
              type="number"
              {...register('display_order', { valueAsNumber: true })}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
            {errors.display_order && (
              <p className="text-red-500 text-sm mt-1">{errors.display_order.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('is_active', checked as boolean)}
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Active (visible on website)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createFee.isPending || updateFee.isPending}
            >
              {createFee.isPending || updateFee.isPending
                ? fee
                  ? 'Updating...'
                  : 'Creating...'
                : fee
                ? 'Update Fee'
                : 'Create Fee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
