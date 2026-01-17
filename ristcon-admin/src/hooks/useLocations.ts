import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { EventLocation, CreateLocationDto } from '@/types/api';

export function useLocations(editionId: number | null) {
  return useQuery({
    queryKey: ['locations', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get(`/admin/editions/${editionId}/locations`);
      return (response.data.data || response.data) as EventLocation[];
    },
    enabled: !!editionId,
  });
}

export function useCreateLocation(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateLocationDto) => {
      const response = await api.post(`/admin/editions/${editionId}/locations`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', editionId] });
    },
  });
}

export function useUpdateLocation(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateLocationDto> }) => {
      const response = await api.put(`/admin/locations/${id}`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', editionId] });
    },
  });
}

export function useDeleteLocation(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/locations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations', editionId] });
    },
  });
}
