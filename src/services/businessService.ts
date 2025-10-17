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
    
    if (businessError) {
      console.error('❌ [createBusiness] Error creating business:', businessError);
      throw new Error(`Không thể tạo doanh nghiệp: ${businessError.message}`);
    }
    
    console.log('✅ [createBusiness] Business created:', business.id);
  
    // 2. Create default "ERP Admin" role for this business
    console.log('📝 [createBusiness] Creating ERP Admin role...');
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
    
    if (roleError) {
      console.error('❌ [createBusiness] Error creating role:', roleError);
      throw new Error(`Không thể tạo vai trò quản trị: ${roleError.message}`);
    }
    
    console.log('✅ [createBusiness] Role created:', role.id);
  
    // 3. Get all features to assign to ERP Admin role
    console.log('📝 [createBusiness] Fetching features...');
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('id');
    
    if (featuresError) {
      console.error('❌ [createBusiness] Error fetching features:', featuresError);
      throw new Error(`Không thể lấy danh sách tính năng: ${featuresError.message}`);
    }
    
    // 4. Assign all permissions to ERP Admin role
    if (features && features.length > 0) {
      console.log(`📝 [createBusiness] Assigning ${features.length} permissions...`);
      const { error: permissionsError } = await supabase
        .from('role_permissions')
        .insert(features.map(f => ({
          role_id: role.id,
          feature_id: f.id
        })));
      
      if (permissionsError) {
        console.error('❌ [createBusiness] Error assigning permissions:', permissionsError);
        throw new Error(`Không thể gán quyền: ${permissionsError.message}`);
      }
      
      console.log('✅ [createBusiness] Permissions assigned');
    }
  
    // 5. Add owner as member with ERP Admin role
    console.log('📝 [createBusiness] Adding owner as member...');
    const { error: memberError } = await supabase
      .from('business_members')
      .insert({
        business_id: business.id,
        user_id: user.id,
        role_id: role.id,
        status: 'ACTIVE'
      });
    
    if (memberError) {
      console.error('❌ [createBusiness] Error adding member:', memberError);
      throw new Error(`Không thể thêm thành viên: ${memberError.message}`);
    }
    
    console.log('✅ [createBusiness] Owner added as member');
    
    // 6. Assign business_owner platform role if not already assigned
    console.log('📝 [createBusiness] Assigning business_owner role...');
    const { error: userRoleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: user.id,
        role: 'business_owner'
      }, {
        onConflict: 'user_id,role',
        ignoreDuplicates: true
      });
    
    if (userRoleError) {
      console.error('❌ [createBusiness] Error assigning user role:', userRoleError);
      // Don't throw here, this is not critical
    } else {
      console.log('✅ [createBusiness] business_owner role assigned');
    }
    
    console.log('✅ [createBusiness] Business creation completed successfully');
    
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
