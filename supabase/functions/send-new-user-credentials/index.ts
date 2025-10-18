import { Resend } from 'https://esm.sh/resend@2.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

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

    const { data, error } = await resend.emails.send({
      from: 'ERP System <noreply@dangphuocquan.cloud>',
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
                <h2 style="color: #333; margin: 0 0 20px 0; font-size: 22px;">
                  Xin chào ${fullName}!
                </h2>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                  Tài khoản ERP System của bạn đã được tạo thành công bởi quản trị viên. 
                  Dưới đây là thông tin đăng nhập của bạn:
                </p>

                <!-- Credentials Box -->
                <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid #e9ecef;">
                  <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                    📋 Thông tin đăng nhập
                  </h3>
                  <div style="margin-bottom: 12px;">
                    <strong style="color: #555;">Email:</strong>
                    <div style="color: #333; font-size: 15px; margin-top: 4px;">${email}</div>
                  </div>
                  <div>
                    <strong style="color: #555;">Mật khẩu tạm thời:</strong>
                    <div style="background: white; padding: 12px; border-radius: 4px; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #667eea; margin-top: 4px; border: 2px dashed #667eea; letter-spacing: 1px;">
                      ${tempPassword}
                    </div>
                  </div>
                </div>

                <!-- Warning Box -->
                <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 25px 0; border-radius: 4px;">
                  <div style="display: flex; align-items: flex-start;">
                    <span style="font-size: 20px; margin-right: 10px;">⚠️</span>
                    <div>
                      <strong style="color: #856404; display: block; margin-bottom: 5px;">BẮT BUỘC ĐỔI MẬT KHẨU</strong>
                      <p style="color: #856404; margin: 0; font-size: 14px;">
                        Bạn phải đổi mật khẩu ngay khi đăng nhập lần đầu tiên để bảo mật tài khoản.
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Login Button -->
                <div style="text-align: center; margin: 35px 0;">
                  <a href="${loginUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    Đăng nhập ngay →
                  </a>
                </div>

                <!-- Instructions -->
                <div style="background-color: #e7f3ff; padding: 20px; border-radius: 6px; margin: 25px 0;">
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
      `
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }

    console.log('✅ Email sent successfully:', data);

    return new Response(
      JSON.stringify({ success: true, emailId: data?.id }),
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
