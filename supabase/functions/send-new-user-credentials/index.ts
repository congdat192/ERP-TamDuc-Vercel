import { sendEmail } from '../_shared/email-service.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendCredentialsRequest {
  email: string;
  fullName: string;
  tempPassword: string;
  loginUrl: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, tempPassword, loginUrl }: SendCredentialsRequest = await req.json();

    console.log('📧 Sending credentials email to:', email);

    const emailResult = await sendEmail({
      to: email,
      subject: '🎉 Tài khoản ERP System của bạn đã được tạo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">
                  🎉 Chào mừng đến ERP System
                </h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                <p style="font-size: 16px; color: #333; line-height: 1.6; margin: 0 0 20px 0;">
                  Xin chào <strong style="color: #667eea;">${fullName}</strong>,
                </p>
                
                <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 0 0 30px 0;">
                  Tài khoản ERP System của bạn đã được tạo thành công! Dưới đây là thông tin đăng nhập của bạn:
                </p>

                <!-- Credentials Box -->
                <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 0 0 30px 0; border-radius: 4px;">
                  <div style="margin-bottom: 15px;">
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 13px; font-weight: bold; text-transform: uppercase;">Email đăng nhập</p>
                    <p style="margin: 0; color: #333; font-size: 16px; font-family: 'Courier New', monospace;">${email}</p>
                  </div>
                  
                  <div>
                    <p style="margin: 0 0 5px 0; color: #666; font-size: 13px; font-weight: bold; text-transform: uppercase;">Mật khẩu tạm thời</p>
                    <p style="margin: 0; color: #333; font-size: 16px; font-family: 'Courier New', monospace; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
                      ${tempPassword}
                    </p>
                  </div>
                </div>

                <!-- Login Button -->
                <div style="text-align: center; margin: 0 0 30px 0;">
                  <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                    🚀 Đăng nhập ngay
                  </a>
                </div>

                <!-- Instructions -->
                <div style="background-color: #e8f4fd; padding: 20px; border-radius: 6px; margin: 0 0 20px 0;">
                  <h4 style="margin: 0 0 12px 0; color: #0066cc; font-size: 15px;">
                    📝 Hướng dẫn đăng nhập
                  </h4>
                  <ol style="color: #555; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Click vào nút "Đăng nhập ngay" bên trên</li>
                    <li>Nhập email và mật khẩu tạm thời (copy từ email này)</li>
                    <li>Hệ thống sẽ yêu cầu bạn đổi mật khẩu mới</li>
                    <li>Nhập mật khẩu mới và xác nhận</li>
                    <li>Hoàn tất! Bạn có thể bắt đầu sử dụng hệ thống</li>
                  </ol>
                </div>

                <!-- Security Note -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                  <p style="color: #999; font-size: 13px; margin: 0; line-height: 1.5;">
                    🔒 <strong>Lưu ý bảo mật:</strong><br>
                    • Không chia sẻ thông tin đăng nhập với bất kỳ ai<br>
                    • Đổi mật khẩu định kỳ để đảm bảo an toàn<br>
                    • Nếu bạn không yêu cầu tài khoản này, vui lòng liên hệ quản trị viên ngay
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  © 2025 ERP System. All rights reserved.
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
      emailType: 'user_credentials',
      metadata: {
        user_email: email,
        temp_password: tempPassword,
        login_url: loginUrl
      }
    });

    console.log('✅ Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.logId }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('❌ Error in send-new-user-credentials:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send email' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
