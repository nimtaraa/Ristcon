import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { PaymentInformation, CreatePaymentInfoDto } from '@/types/api';

export function usePaymentInfo(editionId: number | null) {
  return useQuery({
    queryKey: ['payment-info', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get(`/admin/editions/${editionId}/payment-info`);
      return (response.data.data || response.data) as PaymentInformation[];
    },
    enabled: !!editionId,
  });
}

export function useCreatePaymentInfo(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePaymentInfoDto) => {
      const response = await api.post(`/admin/editions/${editionId}/payment-info`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-info', editionId] });
    },
  });
}

export function useUpdatePaymentInfo(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePaymentInfoDto> }) => {
      const response = await api.put(`/admin/payment-info/${id}`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-info', editionId] });
    },
  });
}

export function useDeletePaymentInfo(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/payment-info/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-info', editionId] });
    },
  });
}
