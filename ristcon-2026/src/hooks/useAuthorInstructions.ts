/**
 * useAuthorInstructions Hook
 * React Query hook for fetching author instructions
 */

import { useQuery } from '@tanstack/react-query';
import { getAuthorInstructions } from '@/lib/api/services';
import { queryKeys } from '@/lib/queryClient';
import { CONFERENCE_YEAR } from '@/lib/api/endpoints';
import { useYear } from '@/contexts/YearContext';

/**
 * Fetch author instructions (config, submission methods, presentation guidelines)
 */
export function useAuthorInstructions(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: queryKeys.authorInstructions(effectiveYear),
    queryFn: () => getAuthorInstructions(effectiveYear),
    select: (data) => data.data,
  });
}
