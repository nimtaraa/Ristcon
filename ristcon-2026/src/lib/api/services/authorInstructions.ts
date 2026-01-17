/**
 * Author Instructions Service
 * API calls for author instructions, submission methods, and presentation guidelines
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  AuthorInstructions,
} from '../types';

/**
 * Get author instructions including config, submission methods, and presentation guidelines
 */
export async function getAuthorInstructions(
  year?: string | number
): Promise<ApiResponse<AuthorInstructions>> {
  return apiClient.get<ApiResponse<AuthorInstructions>>(
    API_ENDPOINTS.AUTHOR_INSTRUCTIONS(year)
  );
}
