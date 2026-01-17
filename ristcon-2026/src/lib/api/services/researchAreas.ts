/**
 * Research Areas Service
 * API calls for research categories and areas
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  ResearchCategory,
  ResearchAreaQueryParams,
} from '../types';

/**
 * Get all research categories with nested areas
 */
export async function getResearchAreas(
  year?: string | number,
  params?: ResearchAreaQueryParams
): Promise<ApiResponse<ResearchCategory[]>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.RESEARCH_AREAS(year), params);
  return apiClient.get<ApiResponse<ResearchCategory[]>>(url);
}

/**
 * Get active research categories only
 */
export async function getActiveResearchAreas(
  year?: string | number
): Promise<ApiResponse<ResearchCategory[]>> {
  const response = await getResearchAreas(year);
  
  return {
    ...response,
    data: response.data
      .filter(cat => cat.is_active)
      .map(cat => ({
        ...cat,
        research_areas: cat.research_areas.filter(area => area.is_active),
      })),
  };
}
