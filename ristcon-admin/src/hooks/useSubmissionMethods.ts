import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { SubmissionMethod, CreateSubmissionMethodDto } from '@/types/api';

export function useSubmissionMethods(editionId: number | null) {
  return useQuery({
    queryKey: ['submission-methods', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get(`/admin/editions/${editionId}/submission-methods`);
      return (response.data.data || response.data) as SubmissionMethod[];
    },
    enabled: !!editionId,
  });
}

export function useCreateSubmissionMethod(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateSubmissionMethodDto) => {
      const response = await api.post(`/admin/editions/${editionId}/submission-methods`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission-methods', editionId] });
    },
  });
}

export function useUpdateSubmissionMethod(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateSubmissionMethodDto> }) => {
      const response = await api.put(`/admin/submission-methods/${id}`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission-methods', editionId] });
    },
  });
}

export function useDeleteSubmissionMethod(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/submission-methods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submission-methods', editionId] });
    },
  });
}
