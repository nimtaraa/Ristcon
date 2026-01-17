import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { useCreateSpeaker, useUpdateSpeaker, useUploadSpeakerPhoto, useDeleteSpeakerPhoto } from '@/hooks/useSpeakers';
import type { Speaker } from '@/types/api';
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
import { Upload, X } from 'lucide-react';

const speakerSchema = z.object({
  speaker_type: z.enum(['keynote', 'plenary', 'invited']),
  full_name: z.string().min(1, 'Name is required'),
  title: z.string().optional(),
  affiliation: z.string().min(1, 'Affiliation is required'),
  additional_affiliation: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  display_order: z.number().min(0).optional(),
});

type SpeakerFormData = z.infer<typeof speakerSchema>;

interface SpeakerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  speaker: Speaker | null;
  editionId: number;
}

export default function SpeakerFormDialog({
  open,
  onOpenChange,
  speaker,
  editionId,
}: SpeakerFormDialogProps) {
  const createSpeaker = useCreateSpeaker(editionId);
  const updateSpeaker = useUpdateSpeaker(editionId);
  const uploadPhoto = useUploadSpeakerPhoto(editionId);
  const deletePhoto = useDeleteSpeakerPhoto(editionId);
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SpeakerFormData>({
    resolver: zodResolver(speakerSchema),
    defaultValues: {
      speaker_type: 'keynote',
      display_order: 0,
    },
  });

  const speakerType = watch('speaker_type');

  useEffect(() => {
    if (speaker) {
      reset({
        speaker_type: speaker.speaker_type as 'keynote' | 'plenary' | 'invited',
        full_name: speaker.full_name,
        title: speaker.title || '',
        affiliation: speaker.affiliation,
        additional_affiliation: speaker.additional_affiliation || '',
        bio: speaker.bio || '',
        email: speaker.email || '',
        website_url: speaker.website_url || '',
        display_order: speaker.display_order || 0,
      });
      setPhotoPreview(speaker.photo_url || null);
    } else {
      reset({
        speaker_type: 'keynote',
        full_name: '',
        title: '',
        affiliation: '',
        additional_affiliation: '',
        bio: '',
        email: '',
        website_url: '',
        display_order: 0,
      });
      setPhotoPreview(null);
    }
    setPhotoFile(null);
  }, [speaker, reset]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      console.log('File dropped:', file);
      console.log('File type:', file.type);
      console.log('File size:', file.size);
      
      // Validate it's a real file with actual data
      if (file.size === 0) {
        console.error('Invalid file: size is 0');
        return;
      }
      
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  const removePhoto = async () => {
    if (speaker?.photo_filename) {
      // Delete photo from server for existing speakers
      try {
        await deletePhoto.mutateAsync(speaker.id);
      } catch (error) {
        console.error('Failed to delete photo:', error);
      }
    }
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const onSubmit = async (data: SpeakerFormData) => {
    try {
      if (speaker) {
        // Update existing speaker
        console.log('Updating speaker...', speaker.id);
        await updateSpeaker.mutateAsync({
          id: speaker.id,
          data: {
            ...data,
            email: data.email || undefined,
            website_url: data.website_url || undefined,
          },
        });
        console.log('Speaker updated');

        // Upload photo if changed
        if (photoFile) {
          console.log('Uploading photo for speaker...', speaker.id);
          console.log('Photo file:', photoFile);
          console.log('Photo file type:', photoFile.type);
          console.log('Photo file size:', photoFile.size);
          try {
            await uploadPhoto.mutateAsync({ id: speaker.id, photo: photoFile });
            console.log('Photo uploaded successfully');
          } catch (photoError: any) {
            console.error('Photo upload error:', photoError);
            console.error('Error response:', photoError.response?.data);
            throw photoError;
          }
        }
      } else {
        // Create new speaker
        console.log('Creating new speaker...');
        const result = await createSpeaker.mutateAsync({
          edition_id: editionId,
          ...data,
          email: data.email || undefined,
          website_url: data.website_url || undefined,
        });
        console.log('Speaker created:', result);

        // Upload photo if provided
        if (photoFile && result.data?.id) {
          console.log('Uploading photo for new speaker...', result.data.id);
          await uploadPhoto.mutateAsync({ id: result.data.id, photo: photoFile });
          console.log('Photo uploaded successfully');
        }
      }

      console.log('All operations complete, closing dialog');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save speaker:', error);
      // Don't close the dialog if there's an error
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{speaker ? 'Edit Speaker' : 'Add New Speaker'}</DialogTitle>
          <DialogDescription>
            {speaker
              ? 'Update speaker information and photo'
              : 'Add a new speaker to this conference edition'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="space-y-4">
              {photoPreview && (
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Speaker preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    draggable={false}
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? 'Drop the image here'
                    : photoPreview 
                      ? 'Click or drop to change photo'
                      : 'Drag & drop an image, or click to select'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG up to 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input id="full_name" {...register('full_name')} />
              {errors.full_name && (
                <p className="text-sm text-red-600">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="speaker_type">Speaker Type *</Label>
              <Select
                value={speakerType || 'keynote'}
                onValueChange={(value) =>
                  setValue('speaker_type', value as 'keynote' | 'plenary' | 'invited')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="keynote">Keynote</SelectItem>
                  <SelectItem value="plenary">Plenary</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title / Position</Label>
            <Input id="title" {...register('title')} placeholder="e.g., Professor, CEO" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliation">Affiliation *</Label>
            <Input
              id="affiliation"
              {...register('affiliation')}
              placeholder="University or Organization"
            />
            {errors.affiliation && (
              <p className="text-sm text-red-600">{errors.affiliation.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional_affiliation">Additional Affiliation</Label>
            <Input
              id="additional_affiliation"
              {...register('additional_affiliation')}
              placeholder="Secondary affiliation (optional)"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="speaker@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website</Label>
              <Input
                id="website_url"
                type="url"
                {...register('website_url')}
                placeholder="https://example.com"
              />
              {errors.website_url && (
                <p className="text-sm text-red-600">{errors.website_url.message}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              rows={4}
              placeholder="Brief biography or research interests..."
            />
          </div>

          {/* Display Order */}
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
            <Button type="submit" disabled={createSpeaker.isPending || updateSpeaker.isPending}>
              {createSpeaker.isPending || updateSpeaker.isPending
                ? 'Saving...'
                : speaker
                ? 'Update Speaker'
                : 'Create Speaker'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
