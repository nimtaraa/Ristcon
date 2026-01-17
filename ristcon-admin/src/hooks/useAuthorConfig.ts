import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AuthorPageConfig, CreateAuthorConfigDto } from '@/types/api';

export function useAuthorConfig(editionId: number | null) {
  return useQuery({
    queryKey: ['author-config', editionId],
    queryFn: async () => {
      if (!editionId) return null;
      const response = await api.get(`/admin/editions/${editionId}/author-config`);
      return (response.data.data || response.data) as AuthorPageConfig | null;
    },
    enabled: !!editionId,
  });
}

export function useCreateAuthorConfig(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateAuthorConfigDto) => {
      const response = await api.post(`/admin/editions/${editionId}/author-config`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author-config', editionId] });
    },
  });
}

export function useUpdateAuthorConfig(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateAuthorConfigDto> }) => {
      const response = await api.put(`/admin/author-config/${id}`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author-config', editionId] });
    },
  });
}

export function useDeleteAuthorConfig(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/author-config/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['author-config', editionId] });
    },
  });
}
