import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ImportantDate, CreateImportantDateDto } from '@/types/api';

// Get all important dates for an edition
export function useDates(editionId: number | null) {
  return useQuery({
    queryKey: ['dates', editionId],
    queryFn: async () => {
      const response = await api.get(`/admin/editions/${editionId}/dates`);
      return response.data.data || response.data;
    },
    enabled: !!editionId,
  });
}

// Create a new important date
export function useCreateDate(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateImportantDateDto) => {
      const response = await api.post(`/admin/editions/${editionId}/dates`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dates', editionId] });
    },
  });
}

// Update an important date
export function useUpdateDate(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateImportantDateDto> }) => {
      const response = await api.put(`/admin/dates/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dates', editionId] });
    },
  });
}

// Delete an important date
export function useDeleteDate(editionId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/admin/dates/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dates', editionId] });
    },
  });
}
