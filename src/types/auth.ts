export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  permissions: {
    modules: string[];
    actions: string[];
  };
  businessId: number | null;
  departmentId: number | null;
  groupId: number | null;
  status: string;
  email_verified_at: string | null;
}

export interface Business {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  website: string | null;
  socialLinks: {
    facebook: string | null;
    twitter: string | null;
    linkedin: string | null;
    instagram: string | null;
  };
  timezone: string;
  currency: string;
  language: string;
  industry: string;
  numberOfEmployees: number;
  annualRevenue: number;
  country: string;
  city: string;
  postalCode: string;
  ownerId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type ERPModule = 
  | 'dashboard'
  | 'customers'
  | 'sales'
  | 'inventory'
  | 'voucher'
  | 'affiliate'
  | 'marketing'
  | 'user-management'
  | 'system-settings'
  | 'profile';

export interface Invitation {
  id: number;
  email: string;
  businessId: number;
  role: string;
  modules: string[];
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: number;
  createdAt: string;
  updatedAt: string;
}
