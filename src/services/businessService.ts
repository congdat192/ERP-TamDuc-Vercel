
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
  console.log('📝 [businessService] Updating business ID:', businessId);
  
  const business = await api.put<Business>(`/businesses/${businessId}`, data);
  
  console.log('✅ [businessService] Business updated successfully:', business.name);
  return {
    ...business,
    is_owner: business.user_role === 'owner'
  };
};
