import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyOTPRequest {
  email: string;
  otpCode: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
  hashed_token?: string;
  email?: string;
}

// Generate random secure password (for auto-created users)
function generateSecurePassword(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, otpCode }: VerifyOTPRequest = await req.json();

    // ============================================
    // STEP 1: VALIDATE INPUT
    // ============================================
    if (!email || !otpCode) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email và mã OTP là bắt buộc' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Mã OTP phải có 6 chữ số' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const emailLower = email.toLowerCase();

    // ============================================
    // STEP 2: VERIFY OTP CODE FROM DATABASE
    // ============================================
    console.log(`🔍 Verifying OTP for ${emailLower}: ${otpCode}`);

    // Tìm OTP (bỏ check verified = false để handle retry)
    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from('email_otp_codes')
      .select('*')
      .eq('email', emailLower)
      .eq('otp_code', otpCode)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpRecord) {
      console.error('❌ OTP not found');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Mã OTP không chính xác. Vui lòng kiểm tra lại.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // STEP 3: CHECK EXPIRATION
    // ============================================
    const expiresAt = new Date(otpRecord.expires_at);
    const now = new Date();

    if (now > expiresAt) {
      console.error('❌ OTP expired');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ OTP is valid and not expired');

    // ============================================
    // STEP 4 & 5: BATCH GET EMPLOYEE + MARK OTP VERIFIED (OPTIMIZED)
    // ============================================
    
    // Get employee data first (needed for user creation)
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id, full_name, employee_code, email, user_id, department, position')
      .ilike('email', emailLower)
      .is('deleted_at', null)
      .single();

    if (employeeError || !employee) {
      console.error('❌ Employee not found:', employeeError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Nhân viên không tồn tại trong hệ thống' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Employee found: ${employee.employee_code} - ${employee.full_name}`);

    // Mark OTP as verified (async, non-blocking for performance)
    if (!otpRecord.verified) {
      (async () => {
        try {
          await supabaseAdmin
            .from('email_otp_codes')
            .update({
              verified: true,
              verified_at: now.toISOString()
            })
            .eq('id', otpRecord.id);
          console.log('✅ OTP marked as verified');
        } catch (err: any) {
          console.error('⚠️ Error marking OTP as verified (non-blocking):', err);
        }
      })();
    }

    // ============================================
    // STEP 6: CREATE USER IF NOT EXISTS (OPTIMIZED WITH BATCH UPDATES)
    // ============================================
    let userId = employee.user_id;

    if (!userId) {
      console.log('🆕 Employee does not have user_id, creating auth user...');

      const tempPassword = generateSecurePassword();

      const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: emailLower,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: employee.full_name,
          employee_code: employee.employee_code,
          department: employee.department || '',
          position: employee.position || '',
          password_change_required: false
        }
      });

      if (createError || !newUserData.user) {
        console.error('❌ Error creating user:', createError);
        throw new Error('Không thể tạo tài khoản đăng nhập. Vui lòng liên hệ IT.');
      }

      userId = newUserData.user.id;
      console.log(`✅ Auth user created: ${userId}`);

      // Batch update: Link employee + update profile (async for performance)
      (async () => {
        try {
          const [linkResult, profileResult] = await Promise.all([
            supabaseAdmin
              .from('employees')
              .update({ user_id: userId })
              .eq('id', employee.id),
            supabaseAdmin
              .from('profiles')
              .update({ password_change_required: false })
              .eq('id', userId)
          ]);
          
          if (linkResult.error) {
            console.error('⚠️ Error linking employee to user:', linkResult.error);
          } else {
            console.log('✅ Employee linked to auth user');
          }
          
          if (profileResult.error) {
            console.error('⚠️ Error updating password_change_required:', profileResult.error);
          } else {
            console.log('✅ Updated password_change_required to false');
          }
        } catch (err: any) {
          console.error('⚠️ Error in batch update:', err);
        }
      })();
    } else {
      console.log(`✅ Employee already has user_id: ${userId}`);
      
      // Update profile async (non-blocking)
      (async () => {
        try {
          await supabaseAdmin
            .from('profiles')
            .update({ password_change_required: false })
            .eq('id', userId);
          console.log('✅ Updated password_change_required to false for OTP user');
        } catch (err: any) {
          console.error('⚠️ Warning: Could not update password_change_required:', err);
        }
      })();
    }

    // ============================================
    // STEP 7: GENERATE MAGIC LINK WITH HASHED TOKEN
    // ============================================
    console.log('🔑 Generating magic link for user...');

    const { data: magicLinkData, error: magicLinkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: emailLower
    });

    if (magicLinkError || !magicLinkData?.properties?.hashed_token) {
      console.error('❌ Error generating magic link:', magicLinkError);
      throw new Error('Không thể tạo phiên đăng nhập. Vui lòng thử lại.');
    }

    console.log('✅ Magic link generated successfully');
    console.log('📦 Hashed token:', magicLinkData.properties.hashed_token ? '✅ Present' : '❌ Missing');

    // ============================================
    // STEP 8: RETURN HASHED TOKEN FOR FRONTEND
    // ============================================
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Đăng nhập thành công!',
        hashed_token: magicLinkData.properties.hashed_token,
        email: emailLower
      } as VerifyOTPResponse),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ Error in verify-employee-otp:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Lỗi hệ thống. Vui lòng thử lại sau.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
