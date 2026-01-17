import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PresentationGuideline, CreatePresentationGuidelineDto } from '@/types/api';

export function usePresentationGuidelines(editionId: number | null) {
  return useQuery({
    queryKey: ['presentation-guidelines', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get(`/admin/editions/${editionId}/presentation-guidelines`);
      return (response.data.data || response.data) as PresentationGuideline[];
    },
    enabled: !!editionId,
  });
}

export function useCreatePresentationGuideline(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePresentationGuidelineDto) => {
      const response = await api.post(`/admin/editions/${editionId}/presentation-guidelines`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presentation-guidelines', editionId] });
    },
  });
}

export function useUpdatePresentationGuideline(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePresentationGuidelineDto> }) => {
      const response = await api.put(`/admin/presentation-guidelines/${id}`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presentation-guidelines', editionId] });
    },
  });
}

export function useDeletePresentationGuideline(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/presentation-guidelines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presentation-guidelines', editionId] });
    },
  });
}
