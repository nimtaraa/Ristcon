/**
 * Documents Service
 * API calls for conference documents
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ApiResponse,
  Document,
  DocumentQueryParams,
} from '../types';

/**
 * Get all documents for a conference
 */
export async function getDocuments(
  year?: string | number,
  params?: DocumentQueryParams
): Promise<ApiResponse<Document[]>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.DOCUMENTS(year), params);
  return apiClient.get<ApiResponse<Document[]>>(url);
}

/**
 * Get available documents only
 */
export async function getAvailableDocuments(
  year?: string | number
): Promise<ApiResponse<Document[]>> {
  return getDocuments(year, { available: true });
}

/**
 * Get documents by category
 */
export async function getDocumentsByCategory(
  year?: string | number,
  category?: string
): Promise<ApiResponse<Document[]>> {
  return getDocuments(year, { category });
}

/**
 * Get abstract template
 */
export async function getAbstractTemplate(
  year?: string | number
): Promise<Document | null> {
  const response = await getDocuments(year, { category: 'abstract_template' });
  return response.data[0] || null;
}

/**
 * Get author form
 */
export async function getAuthorForm(
  year?: string | number
): Promise<Document | null> {
  const response = await getDocuments(year, { category: 'author_form' });
  return response.data[0] || null;
}
