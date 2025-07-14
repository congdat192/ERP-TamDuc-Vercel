export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  emailVerified: boolean;
  isActive: boolean;
  permissions: {
    modules: string[];
    voucherFeatures: string[];
    canManageUsers: boolean;
    canViewAllVouchers: boolean;
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    loginAttemptLimit: number;
    passwordChangeRequired: boolean;
  };
  activities: UserActivity[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: string;
  description: string;
  timestamp: string;
}

export interface CreateUserData {
  name?: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}
