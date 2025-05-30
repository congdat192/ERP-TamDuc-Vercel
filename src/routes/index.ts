
export const ROUTES = {
  // Main routes
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  
  // Module routes
  CUSTOMERS: '/customers',
  SALES: '/sales', 
  INVENTORY: '/inventory',
  ACCOUNTING: '/accounting',
  HR: '/hr',
  
  // Voucher module routes
  VOUCHER: '/voucher',
  VOUCHER_DASHBOARD: '/voucher/dashboard',
  VOUCHER_ISSUE: '/voucher/issue',
  VOUCHER_LIST: '/voucher/list',
  VOUCHER_ANALYTICS: '/voucher/analytics',
  VOUCHER_LEADERBOARD: '/voucher/leaderboard',
  VOUCHER_SETTINGS: '/voucher/settings',
  
  // Admin routes
  SYSTEM_SETTINGS: '/system-settings',
  USER_MANAGEMENT: '/user-management',
  AUDIT_LOG: '/audit-log',
  ROLE_PERMISSIONS: '/role-permissions',
  
  // Error routes
  NOT_FOUND: '/404'
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
