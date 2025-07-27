
import { apiClient } from '@/lib/api-client';

export const clearSelectedBusinessId = (): void => {
  localStorage.removeItem('selected_business_id');
  localStorage.removeItem('cbi');
};

export const getSelectedBusinessId = (): string | null => {
  return localStorage.getItem('selected_business_id');
};

export const setSelectedBusinessId = (businessId: string): void => {
  localStorage.setItem('selected_business_id', businessId);
};

// Export the api client for other services to use
export const api = apiClient;

// Declare global functions for business context
declare global {
  interface Window {
    clearBusinessContext?: () => void;
  }
}
