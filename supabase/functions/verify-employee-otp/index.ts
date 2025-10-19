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
  profile?: {
    id: string;
    full_name: string;
    employee_code: string;
    department: string;
    position: string;
    avatar_path: string | null;
    phone: string | null;
    email: string;
  };
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

    console.log(`🔍 Verifying OTP for ${emailLower}: ${otpCode}`);

    // ============================================
    // STEP 2: BATCH VERIFY OTP + GET EMPLOYEE (OPTIMIZED - 1 RPC CALL)
    // ============================================
    const { data: batchResult, error: batchError } = await supabaseAdmin
      .rpc('verify_employee_otp_batch', {
        p_email: emailLower,
        p_otp_code: otpCode
      });

    if (batchError) {
      console.error('❌ RPC error:', batchError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Lỗi hệ thống. Vui lòng thử lại sau.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!batchResult.success) {
      console.error(`❌ ${batchResult.error}: ${batchResult.message}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: batchResult.message 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const employee = batchResult.employee;
    console.log(`✅ Employee verified: ${employee.employee_code} - ${employee.full_name}`);

    // ============================================
    // STEP 3: CREATE USER IF NOT EXISTS (PARALLEL WITH MAGIC LINK)
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

      // Link employee to user (async, non-blocking)
      (async () => {
        try {
          await supabaseAdmin
            .from('employees')
            .update({ user_id: userId })
            .eq('id', employee.id);
          console.log('✅ Employee linked to auth user');
        } catch (err: any) {
          console.error('⚠️ Error linking employee to user:', err);
        }
      })();
    } else {
      console.log(`✅ Employee already has user_id: ${userId}`);
    }

    // ============================================
    // STEP 4: GENERATE MAGIC LINK (PARALLEL - No waiting for async updates)
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

    // ============================================
    // STEP 5: RETURN HASHED TOKEN + PROFILE DATA (OPTIMIZED)
    // ============================================
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Đăng nhập thành công!',
        hashed_token: magicLinkData.properties.hashed_token,
        email: emailLower,
        profile: {
          id: employee.id,
          full_name: employee.full_name,
          employee_code: employee.employee_code,
          department: employee.department,
          position: employee.position,
          avatar_path: employee.avatar_path,
          phone: employee.phone,
          email: employee.email
        }
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
