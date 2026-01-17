import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateLocation, useUpdateLocation } from '@/hooks/useLocations';
import type { EventLocation } from '@/types/api';
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
import { Checkbox } from '@/components/ui/checkbox';

const locationSchema = z.object({
  venue_name: z.string().min(1, 'Venue name is required'),
  full_address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  google_maps_embed_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  google_maps_link: z.string().url('Invalid URL').optional().or(z.literal('')),
  is_virtual: z.boolean(),
});

type LocationFormValues = z.infer<typeof locationSchema>;

interface LocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location?: EventLocation | null;
  editionId: number;
}

export default function LocationFormDialog({
  open,
  onOpenChange,
  location,
  editionId,
}: LocationFormDialogProps) {
  const createLocation = useCreateLocation(editionId);
  const updateLocation = useUpdateLocation(editionId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      venue_name: '',
      full_address: '',
      city: '',
      country: '',
      latitude: null,
      longitude: null,
      google_maps_embed_url: '',
      google_maps_link: '',
      is_virtual: false,
    },
  });

  const isVirtual = watch('is_virtual');

  useEffect(() => {
    if (location) {
      reset({
        venue_name: location.venue_name,
        full_address: location.full_address,
        city: location.city,
        country: location.country,
        latitude: location.latitude || null,
        longitude: location.longitude || null,
        google_maps_embed_url: location.google_maps_embed_url || '',
        google_maps_link: location.google_maps_link || '',
        is_virtual: location.is_virtual,
      });
    } else {
      reset({
        venue_name: '',
        full_address: '',
        city: '',
        country: '',
        latitude: null,
        longitude: null,
        google_maps_embed_url: '',
        google_maps_link: '',
        is_virtual: false,
      });
    }
  }, [location, reset]);

  const onSubmit = async (data: LocationFormValues) => {
    const payload = {
      ...data,
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
      google_maps_embed_url: data.google_maps_embed_url || undefined,
      google_maps_link: data.google_maps_link || undefined,
    };

    if (location) {
      await updateLocation.mutateAsync({ id: location.id, data: payload });
    } else {
      await createLocation.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{location ? 'Edit Event Location' : 'Add Event Location'}</DialogTitle>
          <DialogDescription>
            {location ? 'Update the venue details below.' : 'Fill in the venue details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="venue_name">Venue Name *</Label>
              <Input id="venue_name" {...register('venue_name')} className="mt-2" />
              {errors.venue_name && (
                <p className="text-red-500 text-sm mt-1">{errors.venue_name.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="full_address">Full Address *</Label>
              <Textarea id="full_address" {...register('full_address')} rows={2} className="mt-2" />
              {errors.full_address && (
                <p className="text-red-500 text-sm mt-1">{errors.full_address.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register('city')} className="mt-2" />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="country">Country *</Label>
              <Input id="country" {...register('country')} className="mt-2" />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input 
                id="latitude" 
                type="number" 
                step="0.000001"
                {...register('latitude', { valueAsNumber: true, setValueAs: v => v === '' ? null : v })} 
                className="mt-2" 
              />
              {errors.latitude && (
                <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input 
                id="longitude" 
                type="number" 
                step="0.000001"
                {...register('longitude', { valueAsNumber: true, setValueAs: v => v === '' ? null : v })} 
                className="mt-2" 
              />
              {errors.longitude && (
                <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="google_maps_link">Google Maps Link</Label>
              <Input 
                id="google_maps_link" 
                {...register('google_maps_link')} 
                placeholder="https://maps.google.com/..." 
                className="mt-2" 
              />
              {errors.google_maps_link && (
                <p className="text-red-500 text-sm mt-1">{errors.google_maps_link.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="google_maps_embed_url">Google Maps Embed URL</Label>
              <Input 
                id="google_maps_embed_url" 
                {...register('google_maps_embed_url')} 
                placeholder="https://www.google.com/maps/embed..." 
                className="mt-2" 
              />
              {errors.google_maps_embed_url && (
                <p className="text-red-500 text-sm mt-1">{errors.google_maps_embed_url.message}</p>
              )}
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Checkbox 
                id="is_virtual" 
                checked={isVirtual}
                onCheckedChange={(checked) => setValue('is_virtual', checked as boolean)}
              />
              <label
                htmlFor="is_virtual"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Virtual Event (Online Only)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLocation.isPending || updateLocation.isPending}
            >
              {createLocation.isPending || updateLocation.isPending
                ? location
                  ? 'Updating...'
                  : 'Creating...'
                : location
                ? 'Update Location'
                : 'Create Location'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
