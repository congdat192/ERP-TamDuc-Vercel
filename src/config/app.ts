
export const APP_CONFIG = {
  // Set to true to use real API, false for demo mode
  USE_REAL_API: false,
  
  API_BASE_URL: 'https://api.matkinhtamduc.xyz/api/v1',
  
  // Demo mode settings
  DEMO_MODE: {
    enabled: true,
    showToggle: true, // Show toggle button to switch between demo and API mode
  },
  
  // Session settings
  SESSION: {
    timeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    autoLogoutWarning: 5 * 60 * 1000, // 5 minutes warning before auto logout
  },
};

// Helper function to check if we should use real API
export const shouldUseRealAPI = () => {
  // Check if there's a localStorage override
  const override = localStorage.getItem('use_real_api');
  if (override !== null) {
    return override === 'true';
  }
  
  return APP_CONFIG.USE_REAL_API;
};

// Helper function to toggle API mode
export const toggleAPIMode = () => {
  const currentMode = shouldUseRealAPI();
  localStorage.setItem('use_real_api', (!currentMode).toString());
  return !currentMode;
};
