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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // 1. Create business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .insert({
      name: data.name,
      description: data.description,
      owner_id: user.id,
      address: data.address,
      phone_number: data.phone_number,
      email_address: data.email_address,
      website_url: data.website_url,
      tax_number: data.tax_number,
      logo_path: data.logo_path
    })
    .select()
    .single();
  
  if (businessError) throw businessError;
  
  // 2. Create default "ERP Admin" role for this business
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .insert({
      business_id: business.id,
      name: 'ERP Admin',
      description: 'Quản trị viên với đầy đủ quyền hạn',
      is_system: true
    })
    .select()
    .single();
  
  if (roleError) throw roleError;
  
  // 3. Get all features to assign to ERP Admin role
  const { data: features } = await supabase
    .from('features')
    .select('id');
  
  // 4. Assign all permissions to ERP Admin role
  if (features && features.length > 0) {
    await supabase
      .from('role_permissions')
      .insert(features.map(f => ({
        role_id: role.id,
        feature_id: f.id
      })));
  }
  
  // 5. Add owner as member with ERP Admin role
  await supabase
    .from('business_members')
    .insert({
      business_id: business.id,
      user_id: user.id,
      role_id: role.id,
      status: 'ACTIVE'
    });
  
  // 6. Assign business_owner platform role if not already assigned
  await supabase
    .from('user_roles')
    .upsert({
      user_id: user.id,
      role: 'business_owner'
    }, {
      onConflict: 'user_id,role',
      ignoreDuplicates: true
    });
  
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
    user_role: 'owner',
    is_owner: true,
    created_at: business.created_at,
    updated_at: business.updated_at
  };
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
