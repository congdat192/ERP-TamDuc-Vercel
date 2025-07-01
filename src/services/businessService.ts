
// Business service for API calls
import { getAuthToken } from './authService';

export interface Business {
  id: number;
  name: string;
  description?: string;
  is_owner: boolean;
  user_role: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBusinessRequest {
  name: string;
  description?: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  description?: string;
}

const API_BASE_URL = 'https://api.matkinhtamduc.xyz/api/v1';

// Get authenticated request headers
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

// Get all businesses for current user
export const getBusinesses = async (): Promise<Business[]> => {
  console.log('🔄 [businessService] Fetching businesses...');
  
  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể tải danh sách doanh nghiệp');
  }

  const data = await response.json();
  console.log('✅ [businessService] Fetched businesses:', data.length);
  return data;
};

// Get single business
export const getBusiness = async (businessId: number): Promise<Business> => {
  console.log('🔄 [businessService] Fetching business:', businessId);
  
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Không thể tải thông tin doanh nghiệp');
  }

  const data = await response.json();
  console.log('✅ [businessService] Fetched business:', data.name);
  return data;
};

// Create new business
export const createBusiness = async (data: CreateBusinessRequest): Promise<Business> => {
  console.log('🏗️ [businessService] Creating business:', data.name);
  
  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Tạo doanh nghiệp thất bại');
  }

  const business = await response.json();
  console.log('✅ [businessService] Created business:', business.name);
  return business;
};

// Update business
export const updateBusiness = async (businessId: number, data: UpdateBusinessRequest): Promise<Business> => {
  console.log('📝 [businessService] Updating business:', businessId);
  
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    throw new Error(errorData.message || 'Cập nhật doanh nghiệp thất bại');
  }

  const business = await response.json();
  console.log('✅ [businessService] Updated business:', business.name);
  return business;
};
