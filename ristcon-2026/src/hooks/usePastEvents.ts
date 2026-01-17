import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { API_BASE_URL } from '@/lib/api/endpoints';
import type { PastEvent, ApiResponse } from '@/lib/api/types';

/**
 * Hook to fetch past conference editions
 * Returns all editions prior to the specified year (or current year if not provided)
 * 
 * @param year Optional year to use as reference point (shows events before this year)
 */
export function usePastEvents(year?: number) {
  return useQuery({
    queryKey: ['past-events', year],
    queryFn: async () => {
      const url = year 
        ? `${API_BASE_URL}/past-events/${year}`
        : `${API_BASE_URL}/past-events`;
      
      const response = await apiClient.get<ApiResponse<PastEvent[]>>(url);
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour - past events rarely change
  });
}
