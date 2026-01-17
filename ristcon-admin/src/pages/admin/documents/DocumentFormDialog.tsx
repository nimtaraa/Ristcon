import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { useCreateDocument, useUpdateDocument } from '@/hooks/useDocuments';
import type { ConferenceDocument } from '@/types/api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, FileText } from 'lucide-react';

const documentSchema = z.object({
  document_category: z.enum(['abstract_template', 'author_form', 'registration_form', 'presentation_template', 'camera_ready_template', 'flyer', 'other']),
  display_name: z.string().min(1, 'Display name is required'),
  is_active: z.boolean().optional(),
  button_width_percent: z.number().min(1).max(100).optional(),
  display_order: z.number().min(0).optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: ConferenceDocument | null;
  editionId: number;
}

export default function DocumentFormDialog({
  open,
  onOpenChange,
  document,
  editionId,
}: DocumentFormDialogProps) {
  const createDocument = useCreateDocument(editionId);
  const updateDocument = useUpdateDocument(editionId);
  
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      document_category: 'abstract_template',
      is_active: true,
      button_width_percent: 100,
      display_order: 0,
    },
  });

  const documentCategory = watch('document_category');

  useEffect(() => {
    if (document) {
      reset({
        document_category: document.document_category as DocumentFormData['document_category'],
        display_name: document.display_name,
        is_active: document.is_active,
        button_width_percent: document.button_width_percent || 100,
        display_order: document.display_order || 0,
      });
      setFilePreview(document.file_name);
    } else {
      reset({
        document_category: 'abstract_template',
        display_name: '',
        is_active: true,
        button_width_percent: 100,
        display_order: 0,
      });
      setFilePreview(null);
    }
    setFile(null);
  }, [document, reset]);

  const onDrop = (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(selectedFile.name);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
    maxSize: 10485760, // 10MB
  });

  const removeFile = () => {
    setFile(null);
    if (!document) {
      setFilePreview(null);
    }
  };

  const onSubmit = async (data: DocumentFormData) => {
    try {
      if (document) {
        // Update existing document (metadata only)
        await updateDocument.mutateAsync({
          id: document.id,
          data: {
            ...data,
            button_width_percent: data.button_width_percent || undefined,
          },
        });
      } else {
        // Create new document (requires file)
        if (!file) {
          alert('Please select a file to upload');
          return;
        }

        await createDocument.mutateAsync({
          ...data,
          file,
          button_width_percent: data.button_width_percent || undefined,
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white border shadow-lg">
        <DialogHeader>
          <DialogTitle>{document ? 'Edit Document' : 'Add Document'}</DialogTitle>
          <DialogDescription>
            {document
              ? 'Update document information. Use "Replace File" from the table to change the file.'
              : 'Add a new document with file upload'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* File Upload (only for new documents) */}
          {!document && (
            <div className="space-y-2">
              <Label>Document File *</Label>
              {filePreview ? (
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="flex-1 text-sm">{filePreview}</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
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
                      ? 'Drop the file here'
                      : 'Drag & drop a file, or click to select'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX, PPT, PPTX, ZIP up to 10MB
                  </p>
                </div>
              )}
            </div>
          )}

          {document && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Current file: <strong>{document.file_name}</strong>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name *</Label>
            <Input
              id="display_name"
              {...register('display_name')}
              placeholder="e.g., Abstract Template"
            />
            {errors.display_name && (
              <p className="text-sm text-red-600">{errors.display_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_category">Category *</Label>
            <Select
              value={documentCategory || 'abstract_template'}
              onValueChange={(value) =>
                setValue('document_category', value as DocumentFormData['document_category'])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abstract_template">Abstract Template</SelectItem>
                <SelectItem value="author_form">Author Form</SelectItem>
                <SelectItem value="registration_form">Registration Form</SelectItem>
                <SelectItem value="presentation_template">Presentation Template</SelectItem>
                <SelectItem value="camera_ready_template">Camera Ready Template</SelectItem>
                <SelectItem value="flyer">Flyer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button_width_percent">Button Width (%)</Label>
              <Input
                id="button_width_percent"
                type="number"
                {...register('button_width_percent', { valueAsNumber: true })}
                placeholder="100"
                min="1"
                max="100"
              />
              <p className="text-xs text-gray-500">
                Width of download button (1-100%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                {...register('display_order', { valueAsNumber: true })}
                placeholder="0"
                min="0"
              />
              <p className="text-xs text-gray-500">
                Lower numbers appear first
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              {...register('is_active')}
              className="rounded"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active (visible to users)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDocument.isPending || updateDocument.isPending}>
              {createDocument.isPending || updateDocument.isPending
                ? 'Saving...'
                : document
                ? 'Update Document'
                : 'Create Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
