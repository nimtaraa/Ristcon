import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { 
  ApiResponse, 
  RegistrationFee, 
  PaymentPolicy, 
  PaymentInformation 
} from '@/lib/api/types';

/**
 * Registration API Service
 * Handles all registration and payment related API calls
 */

/**
 * Get all registration information (fees + policies)
 */
export async function getRegistrationInfo(year: number = new Date().getFullYear()): Promise<ApiResponse<{
  fees: RegistrationFee[];
  policies: PaymentPolicy[];
}>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.REGISTRATION, { year: year.toString() });
  return apiClient.get(url);
}

/**
 * Get registration fees only
 */
export async function getRegistrationFees(year: number = new Date().getFullYear()): Promise<ApiResponse<RegistrationFee[]>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.REGISTRATION_FEES, { year: year.toString() });
  return apiClient.get(url);
}

/**
 * Get payment policies only
 */
export async function getPaymentPolicies(year: number = new Date().getFullYear()): Promise<ApiResponse<PaymentPolicy[]>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.REGISTRATION_POLICIES, { year: year.toString() });
  return apiClient.get(url);
}

/**
 * Get payment information (bank accounts)
 */
export async function getPaymentInformation(year: number = new Date().getFullYear()): Promise<ApiResponse<PaymentInformation[]>> {
  const url = apiClient.buildUrl(API_ENDPOINTS.PAYMENT_INFORMATION, { year: year.toString() });
  return apiClient.get(url);
}
