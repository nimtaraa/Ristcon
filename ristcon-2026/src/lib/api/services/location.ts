/**
 * Location Service
 * API calls for event location
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  EventLocation,
} from '../types';

/**
 * Get event location for a conference
 */
export async function getLocation(
  year?: string | number
): Promise<ApiResponse<EventLocation>> {
  return apiClient.get<ApiResponse<EventLocation>>(
    API_ENDPOINTS.LOCATION(year)
  );
}
