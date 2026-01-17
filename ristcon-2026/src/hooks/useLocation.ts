/**
 * useLocation Hook
 * React Query hook for fetching event location
 */

import { useQuery } from '@tanstack/react-query';
import { getLocation } from '@/lib/api/services';
import { queryKeys } from '@/lib/queryClient';
import { CONFERENCE_YEAR } from '@/lib/api/endpoints';
import { useYear } from '@/contexts/YearContext';

/**
 * Fetch event location
 */
export function useLocation(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: queryKeys.location(effectiveYear),
    queryFn: () => getLocation(effectiveYear),
    select: (data) => data.data,
  });
}
