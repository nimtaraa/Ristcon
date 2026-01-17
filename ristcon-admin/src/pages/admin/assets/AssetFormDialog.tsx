import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { useCreateAsset, useUpdateAsset, useDeleteAssetFile, useUploadAssetFile } from '@/hooks/useAssets';
import type { ConferenceAsset } from '@/types/api';
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
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const assetTypes = [
  { value: 'logo', label: 'Logo' },
  { value: 'poster', label: 'Poster' },
  { value: 'banner', label: 'Banner' },
  { value: 'brochure', label: 'Brochure' },
  { value: 'image', label: 'Image' },
  { value: 'other', label: 'Other' },
];

const assetSchema = z.object({
  asset_type: z.enum(['logo', 'poster', 'banner', 'brochure', 'image', 'other']),
  alt_text: z.string().optional(),
  usage_context: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: ConferenceAsset | null;
  editionId: number;
}

export default function AssetFormDialog({
  open,
  onOpenChange,
  asset,
  editionId,
}: AssetFormDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const createAsset = useCreateAsset(editionId);
  const updateAsset = useUpdateAsset(editionId);
  const deleteAssetFile = useDeleteAssetFile(editionId);
  const uploadAssetFile = useUploadAssetFile(editionId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      asset_type: 'image',
      alt_text: '',
      usage_context: '',
    },
  });

  const assetType = watch('asset_type');

  useEffect(() => {
    if (asset) {
      setValue('asset_type', asset.asset_type as 'logo' | 'poster' | 'banner' | 'brochure' | 'image' | 'other');
      setValue('alt_text', asset.alt_text || '');
      setValue('usage_context', asset.usage_context || '');
      setPreview(asset.asset_url || null);
      setSelectedFile(null);
    } else {
      reset();
      setPreview(null);
      setSelectedFile(null);
    }
  }, [asset, setValue, reset]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file is not empty
      if (file.size === 0) {
        console.error('File is empty (0 bytes)');
        alert('Selected file is empty. Please choose a valid file.');
        return;
      }
      
      console.log('Asset file selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const onSubmit = async (data: AssetFormValues) => {
    try {
      if (asset) {
        // Update existing asset metadata
        await updateAsset.mutateAsync({
          id: asset.id,
          data: {
            asset_type: data.asset_type,
            alt_text: data.alt_text,
            usage_context: data.usage_context,
          },
        });
        
        // If a new file was selected, upload it
        if (selectedFile) {
          await uploadAssetFile.mutateAsync({
            id: asset.id,
            file: selectedFile,
          });
        }
        
        onOpenChange(false);
      } else {
        // Create new asset (requires file)
        if (!selectedFile) {
          alert('Please select a file to upload');
          return;
        }
        await createAsset.mutateAsync({
          asset_type: data.asset_type,
          file: selectedFile,
          alt_text: data.alt_text,
          usage_context: data.usage_context,
        });
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Failed to save asset:', error);
    }
  };

  const removePreview = async () => {
    if (asset && asset.asset_url) {
      // Delete file from server for existing assets
      try {
        await deleteAssetFile.mutateAsync(asset.id);
        setPreview(null);
      } catch (error) {
        console.error('Failed to delete asset file:', error);
      }
    } else {
      // Just clear preview for new uploads
      setSelectedFile(null);
      setPreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{asset ? 'Edit Asset' : 'Upload New Asset'}</DialogTitle>
          <DialogDescription>
            {asset
              ? 'Update asset details or replace the file by dragging a new one into the dropzone.'
              : 'Upload a new asset file and provide details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Asset File {!asset && '*'}</Label>
            <div
              {...getRootProps()}
              className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt={asset ? 'Current asset' : 'Preview'}
                    className="max-h-48 mx-auto rounded-lg"
                    draggable={false}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePreview();
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    title={asset ? 'Delete file from server' : 'Remove preview'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : isDragActive ? (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-primary mb-4" />
                  <p className="text-primary font-medium">Drop the file here</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-700 font-medium mb-1">
                    {asset ? 'Drag and drop to replace file, or click to select' : 'Drag and drop an image here, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported: JPEG, PNG, SVG, WebP (max 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="asset_type">Asset Type *</Label>
            <Select
              value={assetType || 'image'}
              onValueChange={(value) => setValue('asset_type', value as 'logo' | 'poster' | 'banner' | 'brochure' | 'image' | 'other')}
            >
              <SelectTrigger id="asset_type" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.asset_type && (
              <p className="text-red-500 text-sm mt-1">{errors.asset_type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="alt_text">Alt Text</Label>
            <Input
              id="alt_text"
              {...register('alt_text')}
              placeholder="Describe the image for accessibility"
              className="mt-2"
            />
            <p className="text-sm text-gray-500 mt-1">
              Helps screen readers describe the image
            </p>
            {errors.alt_text && (
              <p className="text-red-500 text-sm mt-1">{errors.alt_text.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="usage_context">Usage Context</Label>
            <Textarea
              id="usage_context"
              {...register('usage_context')}
              placeholder="Where and how this asset will be used (e.g., 'Homepage hero banner', 'Email signature logo')"
              rows={3}
              className="mt-2"
            />
            {errors.usage_context && (
              <p className="text-red-500 text-sm mt-1">{errors.usage_context.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAsset.isPending || updateAsset.isPending}
            >
              {createAsset.isPending || updateAsset.isPending
                ? asset
                  ? 'Updating...'
                  : 'Uploading...'
                : asset
                ? 'Update Details'
                : 'Upload Asset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
