/**
 * Conference Service
 * API calls for conference-related endpoints
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  Conference,
  ConferenceQueryParams,
} from '../types';

/**
 * Get all conferences
 */
export async function getAllConferences(
  params?: ConferenceQueryParams
): Promise<ApiResponse<Conference[]>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.CONFERENCES, params);
  return apiClient.get<ApiResponse<Conference[]>>(url);
}

/**
 * Get a specific conference by year
 */
export async function getConferenceByYear(
  year?: string | number,
  include?: string
): Promise<ApiResponse<Conference>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.CONFERENCE_BY_YEAR(year), {
    include,
  });
  return apiClient.get<ApiResponse<Conference>>(url);
}

/**
 * Get upcoming conferences
 */
export async function getUpcomingConferences(): Promise<ApiResponse<Conference[]>> {
  return getAllConferences({ status: 'upcoming' });
}

/**
 * Get completed (past) conferences
 */
export async function getCompletedConferences(): Promise<ApiResponse<Conference[]>> {
  return getAllConferences({ status: 'completed' });
}
