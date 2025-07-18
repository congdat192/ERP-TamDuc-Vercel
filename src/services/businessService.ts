import { api } from './apiService';
import { Business, BusinessListResponse, CreateBusinessRequest, UpdateBusinessRequest } from '@/types/business';

// Get all businesses that user has joined
export const getBusinesses = async (): Promise<Business[]> => {
  console.log('🏢 [businessService] Getting businesses list');
  
  const data = await api.get<BusinessListResponse>('/businesses');
  
  console.log('✅ [businessService] Businesses retrieved successfully:', data.data.length, 'businesses found');
  
  // Add is_owner field based on owner_id and current user
  return data.data.map(business => ({
    ...business,
    is_owner: business.user_role === 'owner'
  }));
};

// Create new business
export const createBusiness = async (data: CreateBusinessRequest): Promise<Business> => {
  console.log('🏗️ [businessService] Creating new business:', data.name);
  
  const business = await api.post<Business>('/businesses', data);
  
  console.log('✅ [businessService] Business created successfully:', business.name);
  return {
    ...business,
    is_owner: true // New business means user is owner
  };
};

// Get specific business details
export const getBusiness = async (businessId: number): Promise<Business> => {
  console.log('🏢 [businessService] Getting business details for ID:', businessId);
  
  const business = await api.get<Business>(`/businesses/${businessId}`);
  
  console.log('✅ [businessService] Business details retrieved successfully:', business.name);
  return {
    ...business,
    is_owner: business.user_role === 'owner'
  };
};

// Update business
export const updateBusiness = async (businessId: number, data: UpdateBusinessRequest): Promise<Business> => {
  console.log('📝 [businessService] Updating business ID:', businessId, 'with data:', data);
  
  const business = await api.put<Business>(`/businesses/${businessId}`, data);
  
  console.log('✅ [businessService] Business updated successfully:', business.name);
  return {
    ...business,
    is_owner: business.user_role === 'owner'
  };
};

// Upload business logo with direct fetch
export const uploadBusinessLogo = async (businessId: number, file: File): Promise<{ path: string }> => {
  console.log('📷 [businessService] Uploading logo for business ID:', businessId);
  
  const formData = new FormData();
  formData.append('image', file);
  formData.append('type', 'logo');
  
  console.log('📋 [businessService] FormData contents:');
  for (let pair of formData.entries()) {
    console.log(`  ${pair[0]}: ${pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]}`);
  }
  
  // Get token from localStorage
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Không tìm thấy token xác thực');
  }

  // Get business ID for X-Business-Id header
  const selectedBusinessId = localStorage.getItem('cbi');
  
  try {
    const response = await fetch('https://api.matkinhtamduc.xyz/api/v1/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        ...(selectedBusinessId && { 'X-Business-Id': selectedBusinessId }),
        // Don't set Content-Type for FormData - browser will set it automatically with boundary
      },
      body: formData,
    });

    console.log('📨 [businessService] Upload response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload thất bại' }));
      console.error('❌ [businessService] Upload failed:', errorData);
      throw new Error(errorData.message || 'Upload logo thất bại');
    }

    const data = await response.json();
    console.log('✅ [businessService] Logo uploaded successfully:', data);
    
    // Return the path from response
    return {
      path: data.path
    };
  } catch (error: any) {
    console.error('❌ [businessService] Logo upload failed:', error);
    throw new Error('Không thể upload logo. Vui lòng thử lại sau.');
  }
};

// Get business logo URL
export const getBusinessLogoUrl = (logoPath: string | null | undefined): string | null => {
  if (!logoPath) return null;
  return `https://matkinhtamducxyz.sgp1.digitaloceanspaces.com/${logoPath}`;
};
