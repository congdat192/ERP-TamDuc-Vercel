
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

// Get authenticated request headers with detailed logging
const getHeaders = () => {
  const token = getAuthToken();
  console.log('🔑 [businessService] Token check:', token ? `Token exists (${token.substring(0, 20)}...)` : 'NO TOKEN FOUND');
  
  if (!token) {
    console.error('❌ [businessService] Missing authentication token');
    throw new Error('Không tìm thấy token xác thực');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
};

// Get all businesses for current user
export const getBusinesses = async (): Promise<Business[]> => {
  console.log('🔄 [businessService] Starting to fetch businesses...');
  
  try {
    const headers = getHeaders();
    console.log('📋 [businessService] Request headers prepared');
    
    const response = await fetch(`${API_BASE_URL}/businesses`, {
      method: 'GET',
      headers,
    });

    console.log('📨 [businessService] API Response status:', response.status);
    console.log('📨 [businessService] API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('❌ [businessService] API Error - Status:', response.status);
      
      if (response.status === 401) {
        console.error('❌ [businessService] Unauthorized - Token invalid or expired');
        throw new Error('Token hết hạn, vui lòng đăng nhập lại');
      }
      
      let errorMessage = 'Không thể tải danh sách doanh nghiệp';
      try {
        const errorData = await response.json();
        console.error('❌ [businessService] Error response:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('❌ [businessService] Could not parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    const rawData = await response.json();
    console.log('📦 [businessService] Raw API response:', rawData);
    console.log('📦 [businessService] Response type:', typeof rawData);
    console.log('📦 [businessService] Response keys:', Object.keys(rawData || {}));
    
    // Handle the API response structure based on the curl documentation
    let businessesData: Business[] = [];
    
    if (Array.isArray(rawData)) {
      // Direct array response
      businessesData = rawData;
      console.log('✅ [businessService] Using direct array response');
    } else if (rawData && rawData.data && Array.isArray(rawData.data)) {
      // Response with data wrapper
      businessesData = rawData.data;
      console.log('✅ [businessService] Using data property array');
    } else if (rawData && rawData.businesses && Array.isArray(rawData.businesses)) {
      // Response with businesses wrapper
      businessesData = rawData.businesses;
      console.log('✅ [businessService] Using businesses property array');
    } else if (rawData && rawData.result && Array.isArray(rawData.result)) {
      // Response with result wrapper
      businessesData = rawData.result;
      console.log('✅ [businessService] Using result property array');
    } else {
      // No valid businesses found
      console.warn('⚠️ [businessService] No valid businesses array found in response');
      console.log('📋 [businessService] Available properties:', Object.keys(rawData || {}));
      businessesData = [];
    }

    // Final validation
    if (!Array.isArray(businessesData)) {
      console.error('❌ [businessService] Final data is not an array:', typeof businessesData);
      businessesData = [];
    }

    console.log('✅ [businessService] Final businesses count:', businessesData.length);
    if (businessesData.length > 0) {
      console.log('📋 [businessService] Sample business:', businessesData[0]);
    }
    
    return businessesData;
    
  } catch (error) {
    console.error('❌ [businessService] Fetch businesses failed:', error);
    throw error; // Re-throw to let caller handle
  }
};

// Get single business
export const getBusiness = async (businessId: number): Promise<Business> => {
  console.log('🔄 [businessService] Fetching business:', businessId);
  
  try {
    const headers = getHeaders();
    
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
      method: 'GET',
      headers,
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
  } catch (error) {
    console.error('❌ [businessService] Get business failed:', error);
    throw error;
  }
};

// Create new business
export const createBusiness = async (data: CreateBusinessRequest): Promise<Business> => {
  console.log('🏗️ [businessService] Creating business:', data.name);
  
  try {
    const headers = getHeaders();
    
    const response = await fetch(`${API_BASE_URL}/businesses`, {
      method: 'POST',
      headers,
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
  } catch (error) {
    console.error('❌ [businessService] Create business failed:', error);
    throw error;
  }
};

// Update business
export const updateBusiness = async (businessId: number, data: UpdateBusinessRequest): Promise<Business> => {
  console.log('📝 [businessService] Updating business:', businessId);
  
  try {
    const headers = getHeaders();
    
    const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
      method: 'PUT',
      headers,
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
  } catch (error) {
    console.error('❌ [businessService] Update business failed:', error);
    throw error;
  }
};
