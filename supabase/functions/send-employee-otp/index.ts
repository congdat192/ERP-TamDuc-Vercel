import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';
import { Resend } from 'https://esm.sh/resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPRequest {
  email: string;
}

interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresIn: number; // seconds
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: SendOTPRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email không hợp lệ' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const emailLower = email.toLowerCase();

    // ============================================
    // STEP 1: VALIDATE EMAIL (INLINED FOR PERFORMANCE)
    // ============================================
    console.log(`🔍 Validating email: ${emailLower}`);

    // Check if employee exists with this email
    const { data: employee, error: employeeError } = await supabaseAdmin
      .from('employees')
      .select('id, employee_code, full_name, email, status, department')
      .ilike('email', emailLower)
      .is('deleted_at', null)
      .single();

    if (employeeError || !employee) {
      console.error('❌ Employee not found');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Email không tồn tại trong hệ thống nhân viên'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (employee.status !== 'active') {
      console.error('❌ Employee not active');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Tài khoản nhân viên chưa được kích hoạt'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`✅ Employee found: ${employee.employee_code} - ${employee.full_name}`);

    // ============================================
    // STEP 2: GENERATE OTP & SAVE TO DB (DELETE + INSERT)
    // ============================================
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log(`🔐 Generated OTP for ${emailLower}: ${otpCode} (expires at ${expiresAt.toISOString()})`);

    // Delete old OTP codes for this email (if any)
    await supabaseAdmin.from('email_otp_codes').delete().eq('email', emailLower);

    // Insert new OTP
    const { error: insertError } = await supabaseAdmin
      .from('email_otp_codes')
      .insert({
        email: emailLower,
        otp_code: otpCode,
        expires_at: expiresAt.toISOString(),
        verified: false
      });
    
    if (insertError) {
      console.error('❌ Error saving OTP:', insertError);
      throw new Error('Không thể tạo mã OTP. Vui lòng thử lại.');
    }

    console.log(`✅ OTP saved to database`);

    // ============================================
    // STEP 3: SEND EMAIL ASYNC (NON-BLOCKING)
    // ============================================
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #333; margin: 0; font-size: 28px; }
          .header p { color: #666; margin-top: 10px; font-size: 16px; }
          .otp-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 40px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 48px; font-weight: bold; letter-spacing: 12px; color: white; font-family: 'Courier New', monospace; text-shadow: 2px 2px 4px rgba(0,0,0,0.2); }
          .info { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .info p { margin: 10px 0; color: #555; font-size: 14px; }
          .info strong { color: #333; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .warning p { margin: 0; color: #856404; font-size: 14px; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Mã Xác Thực Đăng Nhập</h1>
            <p>Tam Duc ERP System</p>
          </div>
          
          <p>Xin chào <strong>${employee.full_name}</strong>,</p>
          <p>Bạn đã yêu cầu đăng nhập vào hệ thống nhân viên. Vui lòng sử dụng mã OTP dưới đây:</p>
          
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
          </div>
          
          <div class="info">
            <p>⏱️ Mã OTP có hiệu lực trong <strong>5 phút</strong></p>
            <p>🔒 Không chia sẻ mã này với bất kỳ ai</p>
            <p>📧 Email: <strong>${emailLower}</strong></p>
            <p>👤 Mã nhân viên: <strong>${employee.employee_code}</strong></p>
            <p>🏢 Phòng ban: <strong>${employee.department || 'N/A'}</strong></p>
          </div>
          
          <div class="warning">
            <p><strong>⚠️ Lưu ý bảo mật:</strong> Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email và liên hệ bộ phận IT ngay lập tức.</p>
          </div>
          
          <div class="footer">
            <p><strong>Tam Duc Corporation</strong></p>
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            <p>© ${new Date().getFullYear()} Tam Duc. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email asynchronously (non-blocking)
    console.log('📧 Queuing OTP email for sending...');
    
    // Fire-and-forget email sending
    resend.emails.send({
      from: 'ERP System <noreply@danganhtri.cloud>',
      to: [emailLower],
      subject: `Mã OTP đăng nhập: ${otpCode} - Tam Duc ERP`,
      html: emailHtml
    }).then(() => {
      console.log(`✅ OTP email sent successfully to ${emailLower}`);
    }).catch((emailError) => {
      console.error('⚠️ Email sending failed (non-blocking):', emailError);
      // Don't throw error - email failure shouldn't block OTP flow
    });

    // ============================================
    // STEP 4: RETURN SUCCESS
    // ============================================
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.',
        expiresIn: 300 // 5 minutes in seconds
      } as SendOTPResponse),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ Error in send-employee-otp:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Lỗi hệ thống. Vui lòng thử lại sau.' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
