import { supabase } from '@/integrations/supabase/client';

export interface CreateUserRequest {
  email: string;
  fullName: string;
  phone?: string;
  roleId: number; // 1 = admin, 2+ = other roles from roles table
}

export interface CreateUserResponse {
  success: boolean;
  userId: string;
  message: string;
}

/**
 * Create a new user account via edge function
 * - Generates a strong temporary password
 * - Creates user in Supabase Auth (auto-confirmed)
 * - Sets password_change_required = true
 * - Sends email with login credentials
 */
export const createUserAccount = async (
  data: CreateUserRequest
): Promise<CreateUserResponse> => {
  console.log('📝 [createUserService] Creating user account:', {
    email: data.email,
    fullName: data.fullName,
    roleId: data.roleId
  });

  const { data: result, error } = await supabase.functions.invoke(
    'create-user-account',
    {
      body: data
    }
  );

  if (error) {
    console.error('❌ [createUserService] Error:', error);
    
    // Check for duplicate email error
    if (error.message?.includes('email_exists') || 
        error.message?.includes('đã tồn tại')) {
      throw new Error('Email này đã được sử dụng. Vui lòng chọn email khác.');
    }
    
    throw new Error(error.message || 'Không thể tạo tài khoản người dùng');
  }

  console.log('✅ [createUserService] User created successfully:', result);
  return result as CreateUserResponse;
};
