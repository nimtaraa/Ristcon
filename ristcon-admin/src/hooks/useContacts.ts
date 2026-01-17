import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ContactPerson, CreateContactDto } from '@/types/api';

export function useContacts(editionId: number | null) {
  return useQuery({
    queryKey: ['contacts', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get(`/admin/editions/${editionId}/contacts`);
      return (response.data.data || response.data) as ContactPerson[];
    },
    enabled: !!editionId,
  });
}

export function useCreateContact(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateContactDto) => {
      const response = await api.post(`/admin/editions/${editionId}/contacts`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', editionId] });
    },
  });
}

export function useUpdateContact(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateContactDto> }) => {
      const response = await api.put(`/admin/contacts/${id}`, data);
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', editionId] });
    },
  });
}

export function useDeleteContact(editionId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', editionId] });
    },
  });
}
