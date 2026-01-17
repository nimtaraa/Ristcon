import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateSubmissionMethod, useUpdateSubmissionMethod } from '@/hooks/useSubmissionMethods';
import type { SubmissionMethod } from '@/types/api';
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

const methodSchema = z.object({
  document_type: z.enum(['author_info', 'abstract', 'extended_abstract', 'camera_ready', 'other']),
  submission_method: z.enum(['email', 'cmt_upload', 'online_form', 'postal']),
  email_address: z.string().email('Invalid email').or(z.literal('')).optional(),
  notes: z.string().optional(),
  display_order: z.number().min(0),
});

type MethodFormValues = z.infer<typeof methodSchema>;

interface SubmissionMethodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  method?: SubmissionMethod | null;
  editionId: number;
}

export default function SubmissionMethodFormDialog({
  open,
  onOpenChange,
  method,
  editionId,
}: SubmissionMethodFormDialogProps) {
  const createMethod = useCreateSubmissionMethod(editionId);
  const updateMethod = useUpdateSubmissionMethod(editionId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MethodFormValues>({
    resolver: zodResolver(methodSchema),
    defaultValues: {
      document_type: 'author_info',
      submission_method: 'email',
      email_address: '',
      notes: '',
      display_order: 0,
    },
  });

  const documentType = watch('document_type');
  const submissionMethod = watch('submission_method');

  useEffect(() => {
    if (method) {
      reset({
        document_type: method.document_type,
        submission_method: method.submission_method,
        email_address: method.email_address || '',
        notes: method.notes || '',
        display_order: method.display_order,
      });
    } else {
      reset({
        document_type: 'author_info',
        submission_method: 'email',
        email_address: '',
        notes: '',
        display_order: 0,
      });
    }
  }, [method, reset]);

  const onSubmit = async (data: MethodFormValues) => {
    if (method) {
      await updateMethod.mutateAsync({ id: method.id, data });
    } else {
      await createMethod.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{method ? 'Edit Submission Method' : 'Add Submission Method'}</DialogTitle>
          <DialogDescription>
            {method ? 'Update the submission method details.' : 'Add a new submission method.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="document_type">Document Type *</Label>
              <Select
                value={documentType || 'author_info'}
                onValueChange={(value) => setValue('document_type', value as any)}
              >
                <SelectTrigger id="document_type" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="author_info">Author Info</SelectItem>
                  <SelectItem value="abstract">Abstract</SelectItem>
                  <SelectItem value="extended_abstract">Extended Abstract</SelectItem>
                  <SelectItem value="camera_ready">Camera Ready</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="submission_method">Submission Method *</Label>
              <Select
                value={submissionMethod || 'email'}
                onValueChange={(value) => setValue('submission_method', value as any)}
              >
                <SelectTrigger id="submission_method" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="cmt_upload">CMT Upload</SelectItem>
                  <SelectItem value="online_form">Online Form</SelectItem>
                  <SelectItem value="postal">Postal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {submissionMethod === 'email' && (
            <div>
              <Label htmlFor="email_address">Email Address</Label>
              <Input
                id="email_address"
                type="email"
                {...register('email_address')}
                placeholder="submissions@conference.org"
                className="mt-2"
              />
              {errors.email_address && (
                <p className="text-red-500 text-sm mt-1">{errors.email_address.message}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes / Instructions</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional instructions for authors"
              rows={3}
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Provide specific instructions for this submission method
            </p>
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMethod.isPending || updateMethod.isPending}
            >
              {createMethod.isPending || updateMethod.isPending
                ? method
                  ? 'Updating...'
                  : 'Creating...'
                : method
                ? 'Update Method'
                : 'Create Method'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
