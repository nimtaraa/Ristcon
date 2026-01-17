import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { CommitteeMember, CommitteeType, CreateCommitteeMemberDto } from '@/types/api';

// Get all committee types
export function useCommitteeTypes() {
  return useQuery({
    queryKey: ['committeeTypes'],
    queryFn: async () => {
      const response = await api.get<{ data: CommitteeType[] }>('/admin/committee-types');
      return response.data.data || response.data;
    },
  });
}

// Get committee members for an edition
export function useCommitteeMembers(editionId: number | null) {
  return useQuery({
    queryKey: ['committeeMembers', editionId],
    queryFn: async () => {
      if (!editionId) return [];
      const response = await api.get<{ data: CommitteeMember[] }>(
        `/admin/editions/${editionId}/committee-members`
      );
      return response.data.data || response.data;
    },
    enabled: !!editionId,
  });
}

// Create committee member
export function useCreateCommitteeMember(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommitteeMemberDto) => {
      const formData = new FormData();
      formData.append('committee_type_id', data.committee_type_id.toString());
      formData.append('full_name', data.full_name);
      formData.append('designation', data.designation);
      if (data.department) formData.append('department', data.department);
      formData.append('affiliation', data.affiliation);
      formData.append('role', data.role);
      if (data.role_category) formData.append('role_category', data.role_category);
      if (data.country) formData.append('country', data.country);
      formData.append('is_international', data.is_international ? '1' : '0');
      formData.append('display_order', (data.display_order || 0).toString());

      const response = await api.post<{ data: CommitteeMember }>(
        `/admin/editions/${editionId}/committee-members`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const member = response.data.data || response.data;

      // Upload photo if provided
      if (data.photo && member.id) {
        const photoData = new FormData();
        photoData.append('photo', data.photo);
        await api.post(`/admin/committee-members/${member.id}/photo`, photoData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      return member;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committeeMembers', editionId] });
    },
  });
}

// Update committee member
export function useUpdateCommitteeMember(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateCommitteeMemberDto> }) => {
      const response = await api.put<{ data: CommitteeMember }>(
        `/admin/committee-members/${id}`,
        data
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committeeMembers', editionId] });
    },
  });
}

// Delete committee member
export function useDeleteCommitteeMember(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/committee-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committeeMembers', editionId] });
    },
  });
}

// Upload committee member photo
export function useUploadCommitteeMemberPhoto(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, photo }: { id: number; photo: File }) => {
      const formData = new FormData();
      formData.append('photo', photo);

      const response = await api.post<{ data: CommitteeMember }>(
        `/admin/committee-members/${id}/photo`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committeeMembers', editionId] });
    },
  });
}

// Delete committee member photo
export function useDeleteCommitteeMemberPhoto(editionId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<{ data: CommitteeMember }>(
        `/admin/committee-members/${id}/photo`
      );
      return response.data.data || response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committeeMembers', editionId] });
    },
  });
}
