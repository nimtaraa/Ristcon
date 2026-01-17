import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ConferenceEdition, CreateEditionDto, ApiResponse } from '@/types/api';

// Fetch all editions
export function useEditions() {
  return useQuery({
    queryKey: ['editions'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ConferenceEdition[]>>('/conferences');
      return data.data;
    },
  });
}

// Fetch single edition
export function useEdition(year: number) {
  return useQuery({
    queryKey: ['editions', year],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ConferenceEdition>>(`/conferences/${year}`);
      return data.data;
    },
    enabled: !!year,
  });
}

// Create edition
export function useCreateEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (edition: CreateEditionDto) => {
      const { data } = await api.post<ApiResponse<ConferenceEdition>>('/admin/editions', edition);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editions'] });
    },
  });
}

// Update edition
export function useUpdateEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...edition }: Partial<ConferenceEdition> & { id: number }) => {
      const { data } = await api.put<ApiResponse<ConferenceEdition>>(`/admin/editions/${id}`, edition);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editions'] });
    },
  });
}

// Delete edition
export function useDeleteEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/editions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editions'] });
    },
  });
}

// Activate edition
export function useActivateEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<ConferenceEdition>>(`/admin/editions/${id}/activate`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editions'] });
    },
  });
}

// Publish edition
export function usePublishEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<ConferenceEdition>>(`/admin/editions/${id}/publish`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editions'] });
    },
  });
}

// Archive edition
export function useArchiveEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<ConferenceEdition>>(`/admin/editions/${id}/archive`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editions'] });
    },
  });
}

// Set edition as draft (unpublish)
export function useDraftEdition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<ConferenceEdition>>(`/admin/editions/${id}/draft`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editions'] });
    },
  });
}
