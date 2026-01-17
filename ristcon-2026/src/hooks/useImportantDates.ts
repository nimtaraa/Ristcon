/**
 * useImportantDates Hook
 * React Query hook for fetching important dates
 */

import { useQuery } from '@tanstack/react-query';
import { getImportantDates, getUpcomingDates } from '@/lib/api/services';
import { queryKeys } from '@/lib/queryClient';
import { CONFERENCE_YEAR } from '@/lib/api/endpoints';
import { useYear } from '@/contexts/YearContext';
import { transformImportantDate } from '@/lib/api/transformers';

/**
 * Fetch all important dates
 */
export function useImportantDates(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: queryKeys.importantDates(effectiveYear),
    queryFn: () => getImportantDates(effectiveYear),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformImportantDate),
    }),
  });
}

/**
 * Fetch only upcoming dates
 */
export function useUpcomingDates(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: [...queryKeys.importantDates(effectiveYear), 'upcoming'],
    queryFn: () => getUpcomingDates(effectiveYear),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformImportantDate),
    }),
  });
}
