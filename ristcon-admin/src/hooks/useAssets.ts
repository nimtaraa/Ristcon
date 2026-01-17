import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ConferenceAsset, CreateAssetDto } from '@/types/api';

// Get assets for an edition
export function useAssets(editionId: number | null) {
  return useQuery({
    queryKey: ['assets', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get<{ data: ConferenceAsset[] }>(
        `/admin/editions/${editionId}/assets`
      );
      return response.data.data || response.data;
    },
    enabled: !!editionId,
  });
}

// Create asset
export function useCreateAsset(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAssetDto) => {
      const formData = new FormData();
      formData.append('asset_type', data.asset_type);
      formData.append('file', data.file);
      if (data.alt_text) formData.append('alt_text', data.alt_text);
      if (data.usage_context) formData.append('usage_context', data.usage_context);

      const response = await api.post<{ data: ConferenceAsset }>(
        `/admin/editions/${editionId}/assets`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', editionId] });
    },
  });
}

// Update asset metadata
export function useUpdateAsset(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Omit<CreateAssetDto, 'file'>> }) => {
      const response = await api.put<{ data: ConferenceAsset }>(
        `/admin/assets/${id}`,
        data
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', editionId] });
    },
  });
}

// Delete asset
export function useDeleteAsset(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/assets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', editionId] });
    },
  });
}

// Upload/replace asset file
export function useUploadAssetFile(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ data: ConferenceAsset }>(
        `/admin/assets/${id}/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', editionId] });
    },
  });
}

// Delete asset file
export function useDeleteAssetFile(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/assets/${id}/file`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', editionId] });
    },
  });
}
