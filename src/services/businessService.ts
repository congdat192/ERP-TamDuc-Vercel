// Mock Business Service - No real API calls
import { Business, BusinessListResponse, CreateBusinessRequest, UpdateBusinessRequest } from '@/types/business';

const mockBusinesses: Business[] = [
  {
    id: 1,
    name: 'Công ty Demo',
    description: 'Công ty mẫu',
    owner_id: 1,
    address: '123 Đường Demo, Quận 1, TP.HCM',
    phone_number: '+84901234567',
    email_address: 'demo@company.com',
    tax_number: '0123456789',
    logo_path: null,
    user_role: 'owner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_owner: true,
  }
];

export const getBusinesses = async (): Promise<Business[]> => {
  console.log('🏢 [mockBusinessService] Getting businesses list');
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBusinesses;
};

export const createBusiness = async (data: CreateBusinessRequest): Promise<Business> => {
  console.log('🏗️ [mockBusinessService] Creating new business');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newBusiness: Business = {
    id: mockBusinesses.length + 1,
    name: data.name,
    description: data.description || '',
    owner_id: 1,
    address: data.address || null,
    phone_number: data.phone_number || null,
    email_address: data.email_address || null,
    tax_number: data.tax_number || null,
    logo_path: data.logo_path || null,
    user_role: 'owner',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_owner: true,
  };
  
  mockBusinesses.push(newBusiness);
  return newBusiness;
};

export const getBusiness = async (businessId: number): Promise<Business> => {
  console.log('🏢 [mockBusinessService] Getting business details');
  await new Promise(resolve => setTimeout(resolve, 500));
  const business = mockBusinesses.find(b => b.id === businessId);
  return business || mockBusinesses[0];
};

export const updateBusiness = async (businessId: number, data: UpdateBusinessRequest): Promise<Business> => {
  console.log('📝 [mockBusinessService] Updating business');
  await new Promise(resolve => setTimeout(resolve, 500));
  const business = mockBusinesses.find(b => b.id === businessId);
  if (business) {
    Object.assign(business, data);
    business.updated_at = new Date().toISOString();
  }
  return business || mockBusinesses[0];
};

export const uploadBusinessLogo = async (businessId: number, file: File): Promise<{ path: string }> => {
  console.log('📷 [mockBusinessService] Uploading logo');
  await new Promise(resolve => setTimeout(resolve, 500));
  return { path: 'mock/logo/path.jpg' };
};

export const getBusinessLogoUrl = (logoPath: string | null | undefined): string | null => {
  if (!logoPath) return null;
  return `/mock-logo/${logoPath}`;
};
