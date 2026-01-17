/**
 * React Query Configuration
 * Query client setup with default options
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Query keys for cache management
export const queryKeys = {
  conferences: ['conferences'] as const,
  conference: (year?: string | number) => ['conference', year] as const,
  speakers: (year?: string | number) => ['speakers', year] as const,
  importantDates: (year?: string | number) => ['importantDates', year] as const,
  committees: (year?: string | number) => ['committees', year] as const,
  contacts: (year?: string | number) => ['contacts', year] as const,
  documents: (year?: string | number, params?: unknown) =>
    ['documents', year, params] as const,
  researchAreas: (year?: string | number) => ['researchAreas', year] as const,
  location: (year?: string | number) => ['location', year] as const,
  authorInstructions: (year?: string | number) => ['authorInstructions', year] as const,
};
