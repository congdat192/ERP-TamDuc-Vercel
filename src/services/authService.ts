// Real Authentication Service with Supabase
import { supabase } from '@/integrations/supabase/client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_path: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone: string;
  avatar_path?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Real login with Supabase
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  });
  
  if (error) throw error;
  
  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  if (profileError) throw profileError;
  
  return {
    access_token: data.session.access_token,
    token_type: 'Bearer',
    expires_in: data.session.expires_in || 3600,
    user: {
      id: data.user.id,
      name: profile.full_name,
      email: data.user.email!,
      email_verified_at: data.user.email_confirmed_at,
      created_at: data.user.created_at,
      updated_at: profile.updated_at
    }
  };
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getUserProfile = async (): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error) throw error;
  
  return {
    id: user.id,
    name: profile.full_name,
    email: user.email!,
    phone: profile.phone || '',
    avatar_path: profile.avatar_path,
    email_verified_at: user.email_confirmed_at,
    created_at: user.created_at,
    updated_at: profile.updated_at
  };
};

export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      full_name: data.name,
      phone: data.phone,
      avatar_path: data.avatar_path
    })
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: user.id,
    name: profile.full_name,
    email: user.email!,
    phone: profile.phone || '',
    avatar_path: profile.avatar_path,
    email_verified_at: user.email_confirmed_at,
    created_at: user.created_at,
    updated_at: profile.updated_at
  };
};

export const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
  // Generate password reset link via Supabase Auth
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });
  
  if (error) throw error;

  // Send custom email via edge function
  try {
    await supabase.functions.invoke('send-password-reset-email', {
      body: {
        email,
        resetUrl: `${window.location.origin}/reset-password`,
        userName: email.split('@')[0]
      }
    });
  } catch (emailError) {
    console.error('Failed to send custom reset email:', emailError);
    // Don't throw - Supabase Auth already sent default email
  }
  
  return { message: 'Email đặt lại mật khẩu đã được gửi' };
};

export const resetPassword = async (password: string): Promise<ResetPasswordResponse> => {
  const { error } = await supabase.auth.updateUser({
    password: password
  });
  
  if (error) throw error;
  return { message: 'Mật khẩu đã được đặt lại thành công' };
};

export const resendVerificationEmail = async (email: string): Promise<ResendVerificationResponse> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email
  });
  
  if (error) throw error;
  return { message: 'Email xác thực đã được gửi lại' };
};

export const verifyEmail = async (tokenHash: string, type: string = 'email'): Promise<void> => {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as any
  });
  
  if (error) {
    console.error('❌ [verifyEmail] Error:', error);
    throw new Error(error.message || 'Email verification failed');
  }
  
  if (!data.session) {
    throw new Error('Verification failed - no session created');
  }
  
  console.log('✅ [verifyEmail] Verification successful');
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) throw error;
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const getAuthToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};
