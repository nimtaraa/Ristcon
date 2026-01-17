/**
 * useConference Hook
 * React Query hook for fetching conference data
 */

import { useQuery } from '@tanstack/react-query';
import { getConferenceByYear, getAllConferences } from '@/lib/api/services';
import { queryKeys } from '@/lib/queryClient';
import { CONFERENCE_YEAR } from '@/lib/api/endpoints';
import type { ConferenceQueryParams } from '@/lib/api/types';
import { useYear } from '@/contexts/YearContext';

/**
 * Fetch a specific conference by year
 */
export function useConference(year?: string | number, include?: string) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;
  
  return useQuery({
    queryKey: [...queryKeys.conference(effectiveYear), include],
    queryFn: () => getConferenceByYear(effectiveYear, include),
    select: (data) => data.data,
  });
}

/**
 * Fetch all conferences
 */
export function useConferences(params?: ConferenceQueryParams) {
  return useQuery({
    queryKey: [...queryKeys.conferences, params],
    queryFn: () => getAllConferences(params),
    select: (data) => data.data,
  });
}

/**
 * Fetch upcoming conferences
 */
export function useUpcomingConferences() {
  return useConferences({ status: 'upcoming' });
}

/**
 * Fetch completed (past) conferences
 */
export function useCompletedConferences() {
  return useConferences({ status: 'completed' });
}
