import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateSocialMedia, useUpdateSocialMedia } from '@/hooks/useSocialMedia';
import type { SocialMediaLink } from '@/types/api';
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

const socialMediaSchema = z.object({
  platform: z.enum(['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'email']),
  url: z.string().url('Invalid URL'),
  label: z.string().optional(),
  display_order: z.number().min(0),
  is_active: z.boolean(),
});

type SocialMediaFormValues = z.infer<typeof socialMediaSchema>;

interface SocialMediaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link?: SocialMediaLink | null;
  editionId: number;
}

export default function SocialMediaFormDialog({
  open,
  onOpenChange,
  link,
  editionId,
}: SocialMediaFormDialogProps) {
  const createLink = useCreateSocialMedia(editionId);
  const updateLink = useUpdateSocialMedia(editionId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      platform: 'facebook',
      url: '',
      label: '',
      display_order: 0,
      is_active: true,
    },
  });

  const platform = watch('platform');
  const isActive = watch('is_active');

  useEffect(() => {
    if (link) {
      reset({
        platform: link.platform,
        url: link.url,
        label: link.label || '',
        display_order: link.display_order,
        is_active: link.is_active,
      });
    } else {
      reset({
        platform: 'facebook',
        url: '',
        label: '',
        display_order: 0,
        is_active: true,
      });
    }
  }, [link, reset]);

  const onSubmit = async (data: SocialMediaFormValues) => {
    if (link) {
      await updateLink.mutateAsync({ id: link.id, data });
    } else {
      await createLink.mutateAsync(data);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{link ? 'Edit Social Media Link' : 'Add Social Media Link'}</DialogTitle>
          <DialogDescription>
            {link ? 'Update the social media link details.' : 'Add a new social media link.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="platform">Platform *</Label>
            <Select
              value={platform || 'facebook'}
              onValueChange={(value) => setValue('platform', value as any)}
            >
              <SelectTrigger id="platform" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            {errors.platform && (
              <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              {...register('url')}
              placeholder={platform === 'email' ? 'mailto:contact@example.com' : 'https://...'}
              className="mt-2"
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              {...register('label')}
              placeholder="Optional display label"
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
              disabled={createLink.isPending || updateLink.isPending}
            >
              {createLink.isPending || updateLink.isPending
                ? link
                  ? 'Updating...'
                  : 'Creating...'
                : link
                ? 'Update Link'
                : 'Create Link'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
