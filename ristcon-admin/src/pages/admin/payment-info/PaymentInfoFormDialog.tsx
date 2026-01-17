import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePaymentInfo, useUpdatePaymentInfo } from '@/hooks/usePaymentInfo';
import type { PaymentInformation } from '@/types/api';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const paymentSchema = z.object({
  payment_type: z.enum(['local', 'foreign']),
  beneficiary_name: z.string().min(1, 'Beneficiary name is required'),
  bank_name: z.string().min(1, 'Bank name is required'),
  account_number: z.string().optional(),
  swift_code: z.string().optional(),
  bank_address: z.string().optional(),
  currency: z.string().optional(),
  additional_info: z.string().optional(),
  display_order: z.number().min(0),
  is_active: z.boolean(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentInfoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: PaymentInformation | null;
  editionId: number;
}

export default function PaymentInfoFormDialog({
  open,
  onOpenChange,
  payment,
  editionId,
}: PaymentInfoFormDialogProps) {
  const createPayment = useCreatePaymentInfo(editionId);
  const updatePayment = useUpdatePaymentInfo(editionId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_type: 'local',
      beneficiary_name: '',
      bank_name: '',
      account_number: '',
      swift_code: '',
      bank_address: '',
      currency: '',
      additional_info: '',
      display_order: 0,
      is_active: true,
    },
  });

  const paymentType = watch('payment_type');
  const isActive = watch('is_active');

  useEffect(() => {
    if (payment) {
      reset({
        payment_type: payment.payment_type,
        beneficiary_name: payment.beneficiary_name || '',
        bank_name: payment.bank_name || '',
        account_number: payment.account_number || '',
        swift_code: payment.swift_code || '',
        bank_address: payment.bank_address || '',
        currency: payment.currency || '',
        additional_info: payment.additional_info || '',
        display_order: payment.display_order,
        is_active: payment.is_active,
      });
    } else {
      reset({
        payment_type: 'local',
        beneficiary_name: '',
        bank_name: '',
        account_number: '',
        swift_code: '',
        bank_address: '',
        currency: '',
        additional_info: '',
        display_order: 0,
        is_active: true,
      });
    }
  }, [payment, reset]);

  const onSubmit = async (data: PaymentFormValues) => {
    if (payment) {
      // Use payment_id as fallback for older cached responses
      const paymentId = payment.id || (payment as any).payment_id;
      await updatePayment.mutateAsync({ id: paymentId, data });
    } else {
      await createPayment.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{payment ? 'Edit Payment Information' : 'Add Payment Information'}</DialogTitle>
          <DialogDescription>
            {payment ? 'Update the bank account details.' : 'Add a new bank account for payments.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="payment_type">Payment Type *</Label>
            <Select
              value={paymentType || 'local'}
              onValueChange={(value) => setValue('payment_type', value as any)}
            >
              <SelectTrigger id="payment_type" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="foreign">Foreign</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Local for domestic transfers, Foreign for international transfers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="beneficiary_name">Beneficiary Name *</Label>
              <Input
                id="beneficiary_name"
                {...register('beneficiary_name')}
                placeholder="Account holder name"
                className="mt-2"
              />
              {errors.beneficiary_name && (
                <p className="text-red-500 text-sm mt-1">{errors.beneficiary_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bank_name">Bank Name *</Label>
              <Input
                id="bank_name"
                {...register('bank_name')}
                placeholder="Full bank name"
                className="mt-2"
              />
              {errors.bank_name && (
                <p className="text-red-500 text-sm mt-1">{errors.bank_name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                {...register('account_number')}
                placeholder="Bank account number"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="swift_code">SWIFT Code</Label>
              <Input
                id="swift_code"
                {...register('swift_code')}
                placeholder="Required for foreign transfers"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bank_address">Bank Address</Label>
            <Textarea
              id="bank_address"
              {...register('bank_address')}
              placeholder="Bank branch address"
              rows={2}
              className="mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                {...register('currency')}
                placeholder="e.g., USD, LKR"
                maxLength={3}
                className="mt-2"
              />
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
          </div>

          <div>
            <Label htmlFor="additional_info">Additional Information</Label>
            <Textarea
              id="additional_info"
              {...register('additional_info')}
              placeholder="Any additional payment instructions"
              rows={3}
              className="mt-2"
            />
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
              disabled={createPayment.isPending || updatePayment.isPending}
            >
              {createPayment.isPending || updatePayment.isPending
                ? payment
                  ? 'Updating...'
                  : 'Creating...'
                : payment
                ? 'Update Payment Info'
                : 'Create Payment Info'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
