import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateEdition, useUpdateEdition } from '@/hooks/useEditions';
import type { ConferenceEdition } from '@/types/api';
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

const editionSchema = z.object({
  year: z.number().min(2020).max(2100),
  edition_number: z.number().min(1),
  name: z.string().min(1, 'Name is required'),
  theme: z.string().min(1, 'Theme is required'),
  conference_date: z.string().min(1, 'Conference date is required'),
  venue_type: z.enum(['physical', 'virtual', 'hybrid']),
  venue_location: z.string().optional(),
  general_email: z.string().email('Invalid email'),
  description: z.string().optional(),
  copyright_year: z.number().min(2020).max(2100),
});

type EditionFormData = z.infer<typeof editionSchema>;

interface EditionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edition: ConferenceEdition | null;
}

export default function EditionFormDialog({ open, onOpenChange, edition }: EditionFormDialogProps) {
  const createEdition = useCreateEdition();
  const updateEdition = useUpdateEdition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    setError,
  } = useForm<EditionFormData>({
    resolver: zodResolver(editionSchema),
    defaultValues: {
      year: new Date().getFullYear() + 1,
      edition_number: 1,
      venue_type: 'physical',
      copyright_year: new Date().getFullYear(),
    },
  });

  const venueType = watch('venue_type');

  useEffect(() => {
    if (edition) {
      reset({
        year: edition.year,
        edition_number: edition.edition_number,
        name: edition.name,
        theme: edition.theme,
        conference_date: edition.conference_date.split('T')[0],
        venue_type: edition.venue_type as 'physical' | 'virtual' | 'hybrid',
        venue_location: edition.venue_location || '',
        general_email: edition.general_email,
        description: edition.description || '',
        copyright_year: edition.copyright_year,
      });
    } else {
      reset({
        year: new Date().getFullYear() + 1,
        edition_number: 1,
        venue_type: 'physical',
        copyright_year: new Date().getFullYear(),
      });
    }
  }, [edition, reset]);

  const onSubmit = async (data: EditionFormData) => {
    try {
      console.log('Submitting edition data:', data);
      if (edition) {
        await updateEdition.mutateAsync({
          id: edition.id,
          ...data,
        });
      } else {
        await createEdition.mutateAsync({
          ...data,
          slug: `${data.year}`,
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to save edition:', error);
      console.error('Response data:', error.response?.data);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach((field) => {
          setError(field as any, {
            type: 'server',
            message: backendErrors[field][0],
          });
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{edition ? 'Edit Edition' : 'Create New Edition'}</DialogTitle>
          <DialogDescription>
            {edition
              ? 'Update the conference edition details below.'
              : 'Fill in the details to create a new conference edition.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                {...register('year', { valueAsNumber: true })}
              />
              {errors.year && (
                <p className="text-sm text-red-600">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edition_number">Edition Number *</Label>
              <Input
                id="edition_number"
                type="number"
                {...register('edition_number', { valueAsNumber: true })}
              />
              {errors.edition_number && (
                <p className="text-sm text-red-600">{errors.edition_number.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...register('name')} placeholder="RISTCON 2027" />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme *</Label>
            <Input
              id="theme"
              {...register('theme')}
              placeholder="Advancing Research Excellence in Science and Technology"
            />
            {errors.theme && (
              <p className="text-sm text-red-600">{errors.theme.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the conference..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conference_date">Conference Date *</Label>
              <Input id="conference_date" type="date" {...register('conference_date')} />
              {errors.conference_date && (
                <p className="text-sm text-red-600">{errors.conference_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_type">Venue Type *</Label>
              <Select
                value={venueType ?? 'physical'}
                onValueChange={(value) => setValue('venue_type', value as 'physical' | 'virtual' | 'hybrid')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(venueType === 'physical' || venueType === 'hybrid') && (
            <div className="space-y-2">
              <Label htmlFor="venue_location">Venue Location</Label>
              <Input
                id="venue_location"
                {...register('venue_location')}
                placeholder="University of Ruhuna, Matara, Sri Lanka"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="general_email">Email *</Label>
              <Input
                id="general_email"
                type="email"
                {...register('general_email')}
                placeholder="ristcon@ruh.ac.lk"
              />
              {errors.general_email && (
                <p className="text-sm text-red-600">{errors.general_email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="copyright_year">Copyright Year *</Label>
              <Input
                id="copyright_year"
                type="number"
                {...register('copyright_year', { valueAsNumber: true })}
              />
              {errors.copyright_year && (
                <p className="text-sm text-red-600">{errors.copyright_year.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createEdition.isPending || updateEdition.isPending}
            >
              {createEdition.isPending || updateEdition.isPending
                ? 'Saving...'
                : edition
                ? 'Update Edition'
                : 'Create Edition'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
