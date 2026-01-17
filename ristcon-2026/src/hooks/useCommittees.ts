/**
 * useCommittees Hook
 * React Query hook for fetching committees and contacts
 */

import { useQuery } from '@tanstack/react-query';
import { getCommittees, getContacts } from '@/lib/api/services';
import { queryKeys } from '@/lib/queryClient';
import { CONFERENCE_YEAR } from '@/lib/api/endpoints';
import { useYear } from '@/contexts/YearContext';
import { transformGroupedCommittees, transformContactPerson } from '@/lib/api/transformers';

/**
 * Fetch all committees grouped by type
 */
export function useCommittees(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: queryKeys.committees(effectiveYear),
    queryFn: () => getCommittees(effectiveYear),
    select: (data) => ({
      ...data,
      data: transformGroupedCommittees(data.data),
    }),
  });
}

/**
 * Fetch all contact persons
 */
export function useContacts(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: queryKeys.contacts(effectiveYear),
    queryFn: () => getContacts(effectiveYear),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformContactPerson),
    }),
  });
}
