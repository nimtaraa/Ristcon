/**
 * API Client
 * Base fetch wrapper with error handling and retry logic
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions extends RequestInit {
  retry?: number;
  retryDelay?: number;
}

/**
 * Base fetch wrapper with error handling
 */
async function baseFetch<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    retry = 3,
    retryDelay = 1000,
    headers = {},
    ...fetchOptions
  } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < retry; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...defaultHeaders,
          ...headers,
        },
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.statusText,
          errorData
        );
      }

      // Parse JSON response
      const data = await response.json();
      return data;
    } catch (error) {
      lastError = error as Error;

      // Don't retry on 4xx errors (client errors)
      if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }

      // Retry on network errors or 5xx server errors
      if (attempt < retry - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

/**
 * GET request
 */
export async function get<T>(url: string, options?: FetchOptions): Promise<T> {
  return baseFetch<T>(url, { ...options, method: 'GET' });
}

/**
 * POST request
 */
export async function post<T>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return baseFetch<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function put<T>(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<T> {
  return baseFetch<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function del<T>(url: string, options?: FetchOptions): Promise<T> {
  return baseFetch<T>(url, { ...options, method: 'DELETE' });
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  baseUrl: string,
  params?: Record<string, unknown>
): string {
  if (!params) return baseUrl;

  const queryString = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

export const apiClient = {
  get,
  post,
  put,
  delete: del,
  buildUrl,
};
