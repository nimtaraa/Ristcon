import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateAuthorConfig, useUpdateAuthorConfig } from '@/hooks/useAuthorConfig';
import type { AuthorPageConfig } from '@/types/api';
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

const configSchema = z.object({
  conference_format: z.enum(['in_person', 'virtual', 'hybrid']),
  cmt_url: z.string().url('Invalid URL').or(z.literal('')).optional(),
  submission_email: z.string().email('Invalid email').or(z.literal('')).optional(),
  blind_review_enabled: z.boolean(),
  camera_ready_required: z.boolean(),
  special_instructions: z.string().optional(),
  acknowledgment_text: z.string().optional(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

interface AuthorConfigFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: AuthorPageConfig | null;
  editionId: number;
}

export default function AuthorConfigFormDialog({
  open,
  onOpenChange,
  config,
  editionId,
}: AuthorConfigFormDialogProps) {
  const createConfig = useCreateAuthorConfig(editionId);
  const updateConfig = useUpdateAuthorConfig(editionId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      conference_format: 'in_person',
      cmt_url: '',
      submission_email: '',
      blind_review_enabled: false,
      camera_ready_required: false,
      special_instructions: '',
      acknowledgment_text: '',
    },
  });

  const conferenceFormat = watch('conference_format');
  const blindReview = watch('blind_review_enabled');
  const cameraReady = watch('camera_ready_required');

  useEffect(() => {
    if (config) {
      reset({
        conference_format: config.conference_format,
        cmt_url: config.cmt_url || '',
        submission_email: config.submission_email || '',
        blind_review_enabled: config.blind_review_enabled,
        camera_ready_required: config.camera_ready_required,
        special_instructions: config.special_instructions || '',
        acknowledgment_text: config.acknowledgment_text || '',
      });
    } else {
      reset({
        conference_format: 'in_person',
        cmt_url: '',
        submission_email: '',
        blind_review_enabled: false,
        camera_ready_required: false,
        special_instructions: '',
        acknowledgment_text: '',
      });
    }
  }, [config, reset]);

  const onSubmit = async (data: ConfigFormValues) => {
    if (config) {
      await updateConfig.mutateAsync({ id: config.id, data });
    } else {
      await createConfig.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {config ? 'Edit Author Configuration' : 'Create Author Configuration'}
          </DialogTitle>
          <DialogDescription>
            Configure author guidelines and submission settings for this edition
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="conference_format">Conference Format *</Label>
            <Select
              value={conferenceFormat || 'in_person'}
              onValueChange={(value) => setValue('conference_format', value as any)}
            >
              <SelectTrigger id="conference_format" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_person">In Person</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cmt_url">CMT URL</Label>
              <Input
                id="cmt_url"
                {...register('cmt_url')}
                placeholder="https://cmt3.research.microsoft.com/..."
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-1">Microsoft CMT submission portal</p>
              {errors.cmt_url && (
                <p className="text-red-500 text-sm mt-1">{errors.cmt_url.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="submission_email">Submission Email</Label>
              <Input
                id="submission_email"
                type="email"
                {...register('submission_email')}
                placeholder="submissions@conference.org"
                className="mt-2"
              />
              {errors.submission_email && (
                <p className="text-red-500 text-sm mt-1">{errors.submission_email.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Review Options</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="blind_review_enabled"
                  checked={blindReview}
                  onCheckedChange={(checked) => setValue('blind_review_enabled', checked as boolean)}
                />
                <label htmlFor="blind_review_enabled" className="text-sm font-medium">
                  Blind Review Enabled
                </label>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                Enable blind review process for paper submissions
              </p>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="camera_ready_required"
                  checked={cameraReady}
                  onCheckedChange={(checked) => setValue('camera_ready_required', checked as boolean)}
                />
                <label htmlFor="camera_ready_required" className="text-sm font-medium">
                  Camera Ready Version Required
                </label>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                Require camera-ready version after acceptance
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="special_instructions">Special Instructions</Label>
            <Textarea
              id="special_instructions"
              {...register('special_instructions')}
              placeholder="Special submission instructions for authors..."
              rows={4}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="acknowledgment_text">Acknowledgment Text</Label>
            <Textarea
              id="acknowledgment_text"
              {...register('acknowledgment_text')}
              placeholder="Acknowledgment or confirmation text shown to authors..."
              rows={3}
              className="mt-2"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createConfig.isPending || updateConfig.isPending}
            >
              {createConfig.isPending || updateConfig.isPending
                ? config
                  ? 'Updating...'
                  : 'Creating...'
                : config
                ? 'Update Configuration'
                : 'Create Configuration'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
