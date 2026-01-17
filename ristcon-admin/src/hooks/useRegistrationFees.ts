import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { RegistrationFee, CreateRegistrationFeeDto } from '@/types/api';

export function useRegistrationFees(editionId: number | null) {
  return useQuery({
    queryKey: ['registration-fees', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get(`/admin/editions/${editionId}/registration-fees`);
      return (response.data.data || response.data) as RegistrationFee[];
    },
    enabled: !!editionId,
  });
}

export function useCreateRegistrationFee(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateRegistrationFeeDto) => {
      const response = await api.post(`/admin/editions/${editionId}/registration-fees`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration-fees', editionId] });
    },
  });
}

export function useUpdateRegistrationFee(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateRegistrationFeeDto> }) => {
      const response = await api.put(`/admin/registration-fees/${id}`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration-fees', editionId] });
    },
  });
}

export function useDeleteRegistrationFee(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/registration-fees/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration-fees', editionId] });
    },
  });
}
