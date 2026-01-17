/**
 * Important Dates Service
 * API calls for important dates endpoints
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  ImportantDate,
} from '../types';

/**
 * Get all important dates for a conference
 */
export async function getImportantDates(
  year?: string | number
): Promise<ApiResponse<ImportantDate[]>> {
  return apiClient.get<ApiResponse<ImportantDate[]>>(
    API_ENDPOINTS.IMPORTANT_DATES(year)
  );
}

/**
 * Get upcoming dates only
 */
export async function getUpcomingDates(
  year?: string | number
): Promise<ApiResponse<ImportantDate[]>> {
  const response = await getImportantDates(year);
  
  return {
    ...response,
    data: response.data.filter(date => !date.is_passed),
  };
}

/**
 * Get submission deadline
 */
export async function getSubmissionDeadline(
  year?: string | number
): Promise<ImportantDate | null> {
  const response = await getImportantDates(year);
  return response.data.find(date => date.date_type === 'submission_deadline') || null;
}

/**
 * Get conference date
 */
export async function getConferenceDate(
  year?: string | number
): Promise<ImportantDate | null> {
  const response = await getImportantDates(year);
  return response.data.find(date => date.date_type === 'conference_date') || null;
}
