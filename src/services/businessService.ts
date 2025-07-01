import { getAuthToken } from './authService';
import { Business, BusinessListResponse, CreateBusinessRequest, UpdateBusinessRequest } from '@/types/business';

const API_BASE_URL = 'https://api.matkinhtamduc.xyz/api/v1';

// Get all businesses that user has joined
export const getBusinesses = async (): Promise<Business[]> => {
  const token = getAuthToken();
  console.log('🏢 [businessService] Getting businesses list');
  
  if (!token) {
    console.error('❌ [businessService] No authentication token found for businesses request');
    throw new Error('No authentication token found');
  }

  console.log('🔑 [businessService] Using token for businesses request:', token.substring(0, 10) + '...');

  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('❌ [businessService] Token expired during businesses request');
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ [businessService] Businesses request failed:', errorData);
    throw new Error(errorData.message || 'Không thể lấy danh sách doanh nghiệp');
  }

  const data: BusinessListResponse = await response.json();
  console.log('✅ [businessService] Businesses retrieved successfully:', data.data.length, 'businesses found');
  
  // Add is_owner field based on owner_id and current user
  return data.data.map(business => ({
    ...business,
    is_owner: business.user_role === 'owner'
  }));
};

// Create new business
export const createBusiness = async (data: CreateBusinessRequest): Promise<Business> => {
  const token = getAuthToken();
  console.log('🏗️ [businessService] Creating new business:', data.name);
  console.log('🔍 [businessService] Token check before create business:', token ? `Token available (${token.substring(0, 10)}...)` : 'NO TOKEN FOUND');
  
  if (!token) {
    console.error('❌ [businessService] No authentication token found for business creation');
    console.error('❌ [businessService] localStorage contents:', Object.keys(localStorage));
    throw new Error('No authentication token found');
  }

  console.log('🔑 [businessService] Using token for business creation:', token.substring(0, 10) + '...');

  const response = await fetch(`${API_BASE_URL}/businesses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('❌ [businessService] Token expired during business creation');
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ [businessService] Business creation failed:', errorData);
    throw new Error(errorData.message || 'Tạo doanh nghiệp thất bại');
  }

  const business = await response.json();
  console.log('✅ [businessService] Business created successfully:', business.name);
  return {
    ...business,
    is_owner: true // New business means user is owner
  };
};

// Get specific business details
export const getBusiness = async (businessId: number): Promise<Business> => {
  const token = getAuthToken();
  console.log('🏢 [businessService] Getting business details for ID:', businessId);
  
  if (!token) {
    console.error('❌ [businessService] No authentication token found for business details request');
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('❌ [businessService] Token expired during business details request');
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ [businessService] Business details request failed:', errorData);
    throw new Error(errorData.message || 'Không thể lấy thông tin doanh nghiệp');
  }

  const business = await response.json();
  console.log('✅ [businessService] Business details retrieved successfully:', business.name);
  return {
    ...business,
    is_owner: business.user_role === 'owner'
  };
};

// Update business
export const updateBusiness = async (businessId: number, data: UpdateBusinessRequest): Promise<Business> => {
  const token = getAuthToken();
  console.log('📝 [businessService] Updating business ID:', businessId);
  
  if (!token) {
    console.error('❌ [businessService] No authentication token found for business update');
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error('❌ [businessService] Token expired during business update');
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const errorData = await response.json();
    console.error('❌ [businessService] Business update failed:', errorData);
    throw new Error(errorData.message || 'Cập nhật doanh nghiệp thất bại');
  }

  const business = await response.json();
  console.log('✅ [businessService] Business updated successfully:', business.name);
  return {
    ...business,
    is_owner: business.user_role === 'owner'
  };
};
