/**
 * useSpeakers Hook
 * React Query hook for fetching speakers data
 */

import { useQuery } from '@tanstack/react-query';
import { getSpeakers, getKeynoteSpeakers, getPlenarySpeakers } from '@/lib/api/services';
import { queryKeys } from '@/lib/queryClient';
import { CONFERENCE_YEAR } from '@/lib/api/endpoints';
import { transformSpeaker } from '@/lib/api/transformers';
import type { SpeakerQueryParams } from '@/lib/api/types';
import { useYear } from '@/contexts/YearContext';

/**
 * Fetch all speakers for a conference
 */
export function useSpeakers(year?: string | number, params?: SpeakerQueryParams) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;
  
  return useQuery({
    queryKey: [...queryKeys.speakers(effectiveYear), params],
    queryFn: () => getSpeakers(effectiveYear, params),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformSpeaker),
    }),
  });
}

/**
 * Fetch keynote speakers only
 */
export function useKeynoteSpeakers(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;
  
  return useQuery({
    queryKey: [...queryKeys.speakers(effectiveYear), { type: 'keynote' }],
    queryFn: () => getKeynoteSpeakers(effectiveYear),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformSpeaker),
    }),
  });
}

/**
 * Fetch plenary speakers only
 */
export function usePlenarySpeakers(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;
  
  return useQuery({
    queryKey: [...queryKeys.speakers(effectiveYear), { type: 'plenary' }],
    queryFn: () => getPlenarySpeakers(effectiveYear),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformSpeaker),
    }),
  });
}
