/**
 * useResearchAreas Hook
 * React Query hook for fetching research areas
 */

import { useQuery } from '@tanstack/react-query';
import { getResearchAreas, getActiveResearchAreas } from '@/lib/api/services';
import { queryKeys } from '@/lib/queryClient';
import { CONFERENCE_YEAR } from '@/lib/api/endpoints';
import { useYear } from '@/contexts/YearContext';
import { transformResearchAreas } from '@/lib/api/transformers';
import type { ResearchAreaQueryParams } from '@/lib/api/types';

/**
 * Fetch all research areas
 */
export function useResearchAreas(year?: string | number, params?: ResearchAreaQueryParams) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: [...queryKeys.researchAreas(effectiveYear), params],
    queryFn: () => getResearchAreas(effectiveYear, params),
    select: (data) => ({
      ...data,
      data: transformResearchAreas(data.data),
    }),
  });
}

/**
 * Fetch only active research areas
 */
export function useActiveResearchAreas(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: [...queryKeys.researchAreas(effectiveYear), 'active'],
    queryFn: () => getActiveResearchAreas(effectiveYear),
    select: (data) => ({
      ...data,
      data: transformResearchAreas(data.data),
    }),
  });
}
