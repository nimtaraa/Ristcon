import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ResearchCategory, ResearchArea, CreateResearchCategoryDto, CreateResearchAreaDto } from '@/types/api';

// ============= Research Categories =============

// Get research categories for an edition
export function useResearchCategories(editionId: number | null) {
  return useQuery({
    queryKey: ['researchCategories', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get<{ data: ResearchCategory[] }>(
        `/admin/editions/${editionId}/research-categories`
      );
      return response.data.data || response.data;
    },
    enabled: !!editionId,
  });
}

// Create research category
export function useCreateResearchCategory(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResearchCategoryDto) => {
      const response = await api.post<{ data: ResearchCategory }>(
        `/admin/editions/${editionId}/research-categories`,
        data
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchCategories', editionId] });
    },
  });
}

// Update research category
export function useUpdateResearchCategory(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateResearchCategoryDto> }) => {
      const response = await api.put<{ data: ResearchCategory }>(
        `/admin/research-categories/${id}`,
        data
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchCategories', editionId] });
    },
  });
}

// Delete research category
export function useDeleteResearchCategory(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/research-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchCategories', editionId] });
    },
  });
}

// ============= Research Areas =============

// Get research areas for a category
export function useResearchAreas(categoryId: number | null) {
  return useQuery({
    queryKey: ['researchAreas', categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const response = await api.get<{ data: ResearchArea[] }>(
        `/admin/research-categories/${categoryId}/areas`
      );
      return response.data.data || response.data;
    },
    enabled: !!categoryId,
  });
}

// Create research area
export function useCreateResearchArea(categoryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateResearchAreaDto) => {
      const response = await api.post<{ data: ResearchArea }>(
        `/admin/research-categories/${categoryId}/areas`,
        data
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchAreas', categoryId] });
      // Also invalidate categories to update counts
      queryClient.invalidateQueries({ queryKey: ['researchCategories'] });
    },
  });
}

// Update research area
export function useUpdateResearchArea(categoryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateResearchAreaDto> }) => {
      const response = await api.put<{ data: ResearchArea }>(
        `/admin/research-areas/${id}`,
        data
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchAreas', categoryId] });
    },
  });
}

// Delete research area
export function useDeleteResearchArea(categoryId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/research-areas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['researchAreas', categoryId] });
      // Also invalidate categories to update counts
      queryClient.invalidateQueries({ queryKey: ['researchCategories'] });
    },
  });
}
