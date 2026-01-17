import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { SocialMediaLink, CreateSocialMediaDto } from '@/types/api';

export function useSocialMedia(editionId: number | null) {
  return useQuery({
    queryKey: ['social-media', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get(`/admin/editions/${editionId}/social-media`);
      return (response.data.data || response.data) as SocialMediaLink[];
    },
    enabled: !!editionId,
  });
}

export function useCreateSocialMedia(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSocialMediaDto) => {
      const response = await api.post(`/admin/editions/${editionId}/social-media`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media', editionId] });
    },
  });
}

export function useUpdateSocialMedia(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateSocialMediaDto> }) => {
      const response = await api.put(`/admin/social-media/${id}`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media', editionId] });
    },
  });
}

export function useDeleteSocialMedia(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/social-media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-media', editionId] });
    },
  });
}
