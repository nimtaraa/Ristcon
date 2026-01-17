import { useQuery } from '@tanstack/react-query';
import { 
  getRegistrationInfo, 
  getRegistrationFees, 
  getPaymentPolicies, 
  getPaymentInformation 
} from '@/lib/api/services';
import type { 
  RegistrationFee, 
  PaymentPolicy, 
  PaymentInformation 
} from '@/lib/api/types';
import { useYear } from '@/contexts/YearContext';

const CONFERENCE_YEAR = parseInt(import.meta.env.VITE_CONFERENCE_YEAR || new Date().getFullYear().toString());

/**
 * Hook to fetch complete registration information (fees + policies)
 */
export function useRegistration(year?: number | string) {
  const { selectedYear } = useYear();
  const effectiveYear = year ? parseInt(year.toString()) : (selectedYear ? parseInt(selectedYear) : CONFERENCE_YEAR);
  
  return useQuery({
    queryKey: ['registration', effectiveYear],
    queryFn: async () => {
      const response = await getRegistrationInfo(effectiveYear);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch registration fees only
 */
export function useRegistrationFees(year?: number | string) {
  const { selectedYear } = useYear();
  const effectiveYear = year ? parseInt(year.toString()) : (selectedYear ? parseInt(selectedYear) : CONFERENCE_YEAR);
  
  return useQuery({
    queryKey: ['registrationFees', effectiveYear],
    queryFn: async () => {
      const response = await getRegistrationFees(effectiveYear);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook to fetch payment policies only
 */
export function usePaymentPolicies(year?: number | string) {
  const { selectedYear } = useYear();
  const effectiveYear = year ? parseInt(year.toString()) : (selectedYear ? parseInt(selectedYear) : CONFERENCE_YEAR);
  
  return useQuery({
    queryKey: ['paymentPolicies', effectiveYear],
    queryFn: async () => {
      const response = await getPaymentPolicies(effectiveYear);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook to fetch payment information (bank accounts)
 */
export function usePaymentInformation(year?: number | string) {
  const { selectedYear } = useYear();
  const effectiveYear = year ? parseInt(year.toString()) : (selectedYear ? parseInt(selectedYear) : CONFERENCE_YEAR);
  
  return useQuery({
    queryKey: ['paymentInformation', effectiveYear],
    queryFn: async () => {
      const response = await getPaymentInformation(effectiveYear);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
