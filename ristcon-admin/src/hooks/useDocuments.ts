import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ConferenceDocument, CreateDocumentDto } from '@/types/api';

// Get all documents for an edition
export function useDocuments(editionId: number | null) {
  return useQuery({
    queryKey: ['documents', editionId],
    queryFn: async () => {
      const response = await api.get(`/admin/editions/${editionId}/documents`);
      return response.data.data || response.data;
    },
    enabled: !!editionId,
  });
}

// Create a new document
export function useCreateDocument(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDocumentDto) => {
      const formData = new FormData();
      formData.append('document_category', data.document_category);
      formData.append('display_name', data.display_name);
      formData.append('file', data.file);
      if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');
      if (data.button_width_percent) formData.append('button_width_percent', data.button_width_percent.toString());
      if (data.display_order) formData.append('display_order', data.display_order.toString());

      const response = await api.post(`/admin/editions/${editionId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', editionId] });
    },
  });
}

// Update a document
export function useUpdateDocument(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<CreateDocumentDto, 'file'>> }) => {
      const response = await api.put(`/admin/documents/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', editionId] });
    },
  });
}

// Delete a document
export function useDeleteDocument(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/admin/documents/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', editionId] });
    },
  });
}

// Upload/replace document file
export function useUploadDocumentFile(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/admin/documents/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', editionId] });
    },
  });
}
