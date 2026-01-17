/**
 * useDocuments Hook
 * React Query hook for fetching documents
 */

import { useQuery } from '@tanstack/react-query';
import { getDocuments, getAvailableDocuments, getDocumentsByCategory } from '@/lib/api/services';
import { queryKeys } from '@/lib/queryClient';
import { CONFERENCE_YEAR } from '@/lib/api/endpoints';
import { useYear } from '@/contexts/YearContext';
import { transformDocument } from '@/lib/api/transformers';
import type { DocumentQueryParams } from '@/lib/api/types';

/**
 * Fetch all documents
 */
export function useDocuments(year?: string | number, params?: DocumentQueryParams) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: queryKeys.documents(effectiveYear, params),
    queryFn: () => getDocuments(effectiveYear, params),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformDocument),
    }),
  });
}

/**
 * Fetch only available documents
 */
export function useAvailableDocuments(year?: string | number) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: queryKeys.documents(effectiveYear, { available: true }),
    queryFn: () => getAvailableDocuments(effectiveYear),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformDocument),
    }),
  });
}

/**
 * Fetch documents by category
 */
export function useDocumentsByCategory(year?: string | number, category?: string) {
  const { selectedYear } = useYear();
  const effectiveYear = year || selectedYear || CONFERENCE_YEAR;

  return useQuery({
    queryKey: queryKeys.documents(effectiveYear, { category }),
    queryFn: () => getDocumentsByCategory(effectiveYear, category),
    select: (data) => ({
      ...data,
      data: data.data
        .sort((a, b) => a.display_order - b.display_order)
        .map(transformDocument),
    }),
    enabled: !!category,
  });
}
