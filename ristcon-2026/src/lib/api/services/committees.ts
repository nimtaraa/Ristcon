/**
 * Committees & Contacts Service
 * API calls for committee members and contact persons
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  GroupedCommittees,
  ContactPerson,
} from '../types';

/**
 * Get all committee members grouped by type
 */
export async function getCommittees(
  year?: string | number
): Promise<ApiResponse<GroupedCommittees>> {
  return apiClient.get<ApiResponse<GroupedCommittees>>(
    API_ENDPOINTS.COMMITTEES(year)
  );
}

/**
 * Get all contact persons
 */
export async function getContacts(
  year?: string | number
): Promise<ApiResponse<ContactPerson[]>> {
  return apiClient.get<ApiResponse<ContactPerson[]>>(
    API_ENDPOINTS.CONTACTS(year)
  );
}
