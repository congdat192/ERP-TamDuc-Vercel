
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

// Upload business logo with proper form data structure
export const uploadBusinessLogo = async (businessId: number, file: File): Promise<{ logo_path: string }> => {
  console.log('📷 [businessService] Uploading logo for business ID:', businessId);
  
  const formData = new FormData();
  formData.append('image', file);
  
  // Add type field that the API expects
  formData.append('type', 'business_logo');
  
  console.log('📋 [businessService] FormData contents:');
  for (let pair of formData.entries()) {
    console.log(`  ${pair[0]}: ${pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]}`);
  }
  
  try {
    const response = await api.post<{ logo_path: string }>('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ [businessService] Logo uploaded successfully:', response.logo_path);
    return response;
  } catch (error: any) {
    console.error('❌ [businessService] Logo upload failed:', error);
    
    // If the API still fails, try uploading without the type field
    if (error.message?.includes('Loại ảnh') || error.message?.includes('type')) {
      console.log('🔄 [businessService] Retrying upload without type field...');
      
      const simpleFormData = new FormData();
      simpleFormData.append('image', file);
      
      const retryResponse = await api.post<{ logo_path: string }>('/images', simpleFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ [businessService] Logo uploaded successfully on retry:', retryResponse.logo_path);
      return retryResponse;
    }
    
    throw error;
  }
};

// Get business logo URL
export const getBusinessLogoUrl = (logoPath: string | null | undefined): string | null => {
  if (!logoPath) return null;
  return `https://matkinhtamducxyz.sgp1.digitaloceanspaces.com/${logoPath}`;
};
