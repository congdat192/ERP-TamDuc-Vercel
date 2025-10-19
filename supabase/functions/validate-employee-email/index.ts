import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidateEmailRequest {
  email: string;
}

interface ValidateEmailResponse {
  valid: boolean;
  message: string;
  shouldCreateUser: boolean;
  employeeData?: {
    id: string;
    fullName: string;
    employeeCode: string;
    department: string;
    position: string;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: ValidateEmailRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'Email không hợp lệ',
          shouldCreateUser: false
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
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
    // STEP 1: RATE LIMITING CHECK (5 lần/15 phút)
    // ============================================
    const { data: rateLimitData, error: rateLimitError } = await supabaseAdmin
      .from('otp_rate_limit')
      .select('*')
      .eq('email', emailLower)
      .single();

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    if (rateLimitData) {
      const firstAttempt = new Date(rateLimitData.first_attempt_at);
      
      // Check if blocked
      if (rateLimitData.blocked_until && new Date(rateLimitData.blocked_until) > now) {
        const minutesLeft = Math.ceil((new Date(rateLimitData.blocked_until).getTime() - now.getTime()) / 60000);
        return new Response(
          JSON.stringify({
            valid: false,
            message: `Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ${minutesLeft} phút.`,
            shouldCreateUser: false
          }),
          {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Reset counter if outside 15-minute window
      if (firstAttempt < fifteenMinutesAgo) {
        await supabaseAdmin
          .from('otp_rate_limit')
          .update({
            attempt_count: 1,
            first_attempt_at: now.toISOString(),
            last_attempt_at: now.toISOString(),
            blocked_until: null
          })
          .eq('email', emailLower);
      } else {
        // Increment counter
        const newCount = rateLimitData.attempt_count + 1;
        
        if (newCount > 5) {
          // Block for 15 minutes
          const blockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
          await supabaseAdmin
            .from('otp_rate_limit')
            .update({
              attempt_count: newCount,
              last_attempt_at: now.toISOString(),
              blocked_until: blockedUntil.toISOString()
            })
            .eq('email', emailLower);
          
          return new Response(
            JSON.stringify({
              valid: false,
              message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.',
              shouldCreateUser: false
            }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          // Update counter
          await supabaseAdmin
            .from('otp_rate_limit')
            .update({
              attempt_count: newCount,
              last_attempt_at: now.toISOString()
            })
            .eq('email', emailLower);
        }
      }
    } else {
      // First attempt - create record
      await supabaseAdmin
        .from('otp_rate_limit')
        .insert({
          email: emailLower,
          attempt_count: 1,
          first_attempt_at: now.toISOString(),
          last_attempt_at: now.toISOString()
        });
    }

    // ============================================
    // STEP 2: VALIDATE EMAIL IN EMPLOYEES TABLE
    // ============================================
    console.log('🔍 Checking employee email:', emailLower);

    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id, full_name, employee_code, department, position, user_id, deleted_at')
      .ilike('email', emailLower)
      .single();

    if (employeeError || !employee) {
      console.log('❌ Employee not found');
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'Email không tồn tại trong hệ thống nhân sự. Vui lòng liên hệ HR.',
          shouldCreateUser: false
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if employee is deleted
    if (employee.deleted_at) {
      console.log('❌ Employee account is deleted');
      return new Response(
        JSON.stringify({
          valid: false,
          message: 'Tài khoản nhân viên đã bị xóa. Vui lòng liên hệ HR.',
          shouldCreateUser: false
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Employee found:', employee.employee_code);

    // ============================================
    // STEP 3: CHECK IF USER EXISTS IN AUTH
    // ============================================
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = authUser?.users?.find(u => u.email?.toLowerCase() === emailLower);

    let shouldCreateUser = false;

    if (!existingUser) {
      console.log('🆕 User not found in auth.users - will be auto-created by signInWithOtp');
      shouldCreateUser = true;

      // IMPORTANT: signInWithOtp với shouldCreateUser: true sẽ tự động tạo user
      // Trigger on_auth_user_created_link_employee sẽ tự động link employees.user_id
    } else {
      console.log('✅ User exists in auth.users:', existingUser.id);
      
      // Ensure employees.user_id is linked
      if (!employee.user_id) {
        console.log('🔗 Linking employee to existing user...');
        await supabaseAdmin
          .from('employees')
          .update({ user_id: existingUser.id })
          .eq('id', employee.id);
      }
    }

    // ============================================
    // STEP 4: RETURN SUCCESS
    // ============================================
    return new Response(
      JSON.stringify({
        valid: true,
        message: 'Email hợp lệ. Mã OTP sẽ được gửi đến email của bạn.',
        shouldCreateUser,
        employeeData: {
          id: employee.id,
          fullName: employee.full_name,
          employeeCode: employee.employee_code,
          department: employee.department,
          position: employee.position
        }
      } as ValidateEmailResponse),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ Error in validate-employee-email:', error);
    return new Response(
      JSON.stringify({
        valid: false,
        message: error.message || 'Lỗi hệ thống. Vui lòng thử lại.',
        shouldCreateUser: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
