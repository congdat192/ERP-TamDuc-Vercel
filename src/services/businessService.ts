// Real Business Service with Supabase
import { supabase } from '@/integrations/supabase/client';
import { Business, CreateBusinessRequest, UpdateBusinessRequest } from '@/types/business';

export const getBusinesses = async (): Promise<Business[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // Use the security definer function to get user's businesses
  const { data, error } = await supabase.rpc('get_user_businesses', {
    _user_id: user.id
  });
  
  if (error) throw error;
  
  return (data || []).map((b: any) => ({
    id: b.id,
    name: b.name,
    description: b.description || '',
    owner_id: b.owner_id,
    address: null,
    phone_number: null,
    email_address: null,
    website_url: null,
    tax_number: null,
    logo_path: b.logo_path,
    user_role: b.user_role,
    is_owner: b.is_owner,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
};

export const createBusiness = async (data: CreateBusinessRequest): Promise<Business> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ [createBusiness] User not authenticated');
      throw new Error('Bạn cần đăng nhập để tạo doanh nghiệp');
    }
    
    console.log('📝 [createBusiness] Creating business for user:', user.id);
    
    // Call enhanced RPC function that handles complete business creation
    const { data: result, error: businessError } = await supabase
      .rpc('create_business_safe', {
        _name: data.name,
        _description: data.description || null,
        _logo_path: data.logo_path || null,
        _address: data.address || null,
        _phone_number: data.phone_number || null,
        _email_address: data.email_address || null,
        _website_url: data.website_url || null,
        _tax_number: data.tax_number || null
      });
    
    if (businessError) {
      console.error('❌ [createBusiness] Error:', businessError);
      throw new Error(`Không thể tạo doanh nghiệp: ${businessError.message}`);
    }
    
    if (!result || result.length === 0) {
      throw new Error('Không nhận được dữ liệu doanh nghiệp');
    }
    
    const business = result[0];
    console.log('✅ [createBusiness] Business created successfully:', business.id);
    
    // Return business data directly from RPC result
    return {
      id: business.id,
      name: business.name,
      description: business.description || '',
      owner_id: business.owner_id,
      address: business.address,
      phone_number: business.phone_number,
      email_address: business.email_address,
      website_url: business.website_url,
      tax_number: business.tax_number,
      logo_path: business.logo_path,
      user_role: business.user_role as 'owner' | 'admin' | 'member',
      is_owner: business.is_owner,
      created_at: business.created_at,
      updated_at: business.updated_at
    };
  } catch (error: any) {
    console.error('❌ [createBusiness] Exception:', error);
    throw error;
  }
};

export const getBusiness = async (businessId: string): Promise<Business> => {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();
  
  if (error) throw error;
  
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === data.owner_id;
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    owner_id: data.owner_id,
    address: data.address,
    phone_number: data.phone_number,
    email_address: data.email_address,
    website_url: data.website_url,
    tax_number: data.tax_number,
    logo_path: data.logo_path,
    user_role: isOwner ? 'owner' : 'member',
    is_owner: isOwner,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const updateBusiness = async (businessId: string, data: UpdateBusinessRequest): Promise<Business> => {
  const { data: business, error } = await supabase
    .from('businesses')
    .update({
      name: data.name,
      description: data.description,
      address: data.address,
      phone_number: data.phone_number,
      email_address: data.email_address,
      website_url: data.website_url,
      tax_number: data.tax_number,
      logo_path: data.logo_path
    })
    .eq('id', businessId)
    .select()
    .single();
  
  if (error) throw error;
  
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === business.owner_id;
  
  return {
    id: business.id,
    name: business.name,
    description: business.description || '',
    owner_id: business.owner_id,
    address: business.address,
    phone_number: business.phone_number,
    email_address: business.email_address,
    website_url: business.website_url,
    tax_number: business.tax_number,
    logo_path: business.logo_path,
    user_role: isOwner ? 'owner' : 'member',
    is_owner: isOwner,
    created_at: business.created_at,
    updated_at: business.updated_at
  };
};

export const uploadBusinessLogo = async (businessId: string, file: File): Promise<{ path: string }> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${businessId}-${Date.now()}.${fileExt}`;
  const filePath = `business-logos/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('business-assets')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  return { path: filePath };
};

export const getBusinessLogoUrl = (logoPath: string | null | undefined): string | null => {
  if (!logoPath) return null;
  
  const { data } = supabase.storage
    .from('business-assets')
    .getPublicUrl(logoPath);
  
  return data.publicUrl;
};
