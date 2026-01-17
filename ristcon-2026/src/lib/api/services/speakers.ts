/**
 * Speakers Service
 * API calls for speakers endpoints
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  Speaker,
  SpeakerQueryParams,
} from '../types';

/**
 * Get all speakers for a conference
 */
export async function getSpeakers(
  year?: string | number,
  params?: SpeakerQueryParams
): Promise<ApiResponse<Speaker[]>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.SPEAKERS(year), params);
  return apiClient.get<ApiResponse<Speaker[]>>(url);
}

/**
 * Get keynote speakers only
 */
export async function getKeynoteSpeakers(
  year?: string | number
): Promise<ApiResponse<Speaker[]>> {
  return getSpeakers(year, { type: 'keynote' });
}

/**
 * Get plenary speakers only
 */
export async function getPlenarySpeakers(
  year?: string | number
): Promise<ApiResponse<Speaker[]>> {
  return getSpeakers(year, { type: 'plenary' });
}
