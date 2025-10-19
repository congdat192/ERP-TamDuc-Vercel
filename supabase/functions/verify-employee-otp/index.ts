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
  session?: {
    access_token: string;
    refresh_token: string;
    user: any;
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

    // ============================================
    // STEP 2: VERIFY OTP CODE FROM DATABASE
    // ============================================
    console.log(`🔍 Verifying OTP for ${emailLower}: ${otpCode}`);

    const { data: otpRecord, error: otpError } = await supabaseAdmin
      .from('email_otp_codes')
      .select('*')
      .eq('email', emailLower)
      .eq('otp_code', otpCode)
      .eq('verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) {
      console.error('❌ Database error:', otpError);
      throw new Error('Lỗi hệ thống khi kiểm tra OTP');
    }

    if (!otpRecord) {
      console.error('❌ OTP not found or already used');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Mã OTP không chính xác hoặc đã được sử dụng' 
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
      console.error('❌ OTP expired:', { expiresAt: expiresAt.toISOString(), now: now.toISOString() });
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
    // STEP 4: MARK OTP AS VERIFIED
    // ============================================
    const { error: updateError } = await supabaseAdmin
      .from('email_otp_codes')
      .update({
        verified: true,
        verified_at: now.toISOString()
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('❌ Error updating OTP status:', updateError);
    } else {
      console.log('✅ OTP marked as verified');
    }

    // ============================================
    // STEP 5: GET EMPLOYEE DATA
    // ============================================
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

    // ============================================
    // STEP 6: CREATE USER IF NOT EXISTS
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
          position: employee.position || ''
        }
      });

      if (createError || !newUserData.user) {
        console.error('❌ Error creating user:', createError);
        throw new Error('Không thể tạo tài khoản đăng nhập. Vui lòng liên hệ IT.');
      }

      userId = newUserData.user.id;
      console.log(`✅ Auth user created: ${userId}`);

      // Link employee to user
      const { error: linkError } = await supabaseAdmin
        .from('employees')
        .update({ user_id: userId })
        .eq('id', employee.id);

      if (linkError) {
        console.error('❌ Error linking employee to user:', linkError);
      } else {
        console.log('✅ Employee linked to auth user');
      }
    } else {
      console.log(`✅ Employee already has user_id: ${userId}`);
    }

    // ============================================
    // STEP 7: GENERATE SESSION TOKEN
    // ============================================
    console.log('🔑 Generating session token for user...');

    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: emailLower
    });

    if (sessionError || !sessionData) {
      console.error('❌ Error generating session:', sessionError);
      throw new Error('Không thể tạo phiên đăng nhập. Vui lòng thử lại.');
    }

    console.log('✅ Session tokens generated successfully');

    // Get updated user data with metadata
    const { data: { user: userData }, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      console.error('❌ Error fetching user data:', userError);
    }

    // ============================================
    // STEP 8: RETURN SESSION DATA
    // ============================================
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Đăng nhập thành công!',
        session: {
          access_token: sessionData.properties.action_link.split('access_token=')[1].split('&')[0],
          refresh_token: sessionData.properties.action_link.split('refresh_token=')[1].split('&')[0],
          user: {
            id: userId,
            email: emailLower,
            user_metadata: userData?.user_metadata || {
              full_name: employee.full_name,
              employee_code: employee.employee_code,
              department: employee.department,
              position: employee.position
            }
          }
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
