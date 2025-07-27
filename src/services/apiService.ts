
export const clearSelectedBusinessId = (): void => {
  localStorage.removeItem('selected_business_id');
  localStorage.removeItem('cbi');
};

// Declare global functions for business context
declare global {
  interface Window {
    clearBusinessContext?: () => void;
  }
}
