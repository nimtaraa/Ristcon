import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Speaker, CreateSpeakerDto } from '@/types/api';

// Get all speakers for an edition
export function useSpeakers(editionId: number | null) {
  return useQuery({
    queryKey: ['speakers', editionId],
    queryFn: async () => {
      const response = await api.get(`/admin/editions/${editionId}/speakers`);
      return response.data.data || response.data; // Handle both wrapped and unwrapped responses
    },
    enabled: !!editionId,
  });
}

// Create a new speaker
export function useCreateSpeaker(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSpeakerDto) => {
      const response = await api.post(`/admin/editions/${editionId}/speakers`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers', editionId] });
    },
  });
}

// Update a speaker
export function useUpdateSpeaker(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateSpeakerDto> }) => {
      const response = await api.put(`/admin/speakers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers', editionId] });
    },
  });
}

// Delete a speaker
export function useDeleteSpeaker(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/admin/speakers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers', editionId] });
    },
  });
}

// Upload speaker photo
export function useUploadSpeakerPhoto(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, photo }: { id: number; photo: File }) => {
      const formData = new FormData();
      formData.append('photo', photo);
      
      const response = await api.post(`/admin/speakers/${id}/photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers', editionId] });
    },
  });
}

// Delete speaker photo
export function useDeleteSpeakerPhoto(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/admin/speakers/${id}/photo`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers', editionId] });
    },
  });
}
