import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PasswordResetEmailRequest {
  email: string;
  resetUrl: string;
  userName?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetUrl, userName }: PasswordResetEmailRequest = await req.json();

    console.log('Sending password reset email to:', email);
    console.log('Reset URL:', resetUrl);

    const emailResponse = await resend.emails.send({
      from: 'ERP System <noreply@dangphuocquan.cloud>',
      to: email,
      subject: 'Đặt lại mật khẩu ERP System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin: 0;">🔐 Đặt lại mật khẩu</h1>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Xin chào ${userName || 'bạn'},
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản ERP System của bạn. Nhấn vào nút bên dưới để tạo mật khẩu mới.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetUrl}" 
                 style="background-color: #ef4444; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                Đặt lại mật khẩu
              </a>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                ⏰ Link đặt lại mật khẩu này sẽ hết hạn sau <strong>1 giờ</strong> vì lý do bảo mật.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Hoặc copy link sau vào trình duyệt:
            </p>
            <p style="color: #3b82f6; font-size: 13px; word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0;">
              <p style="color: #991b1b; font-size: 13px; margin: 0;">
                ⚠️ <strong>Quan trọng:</strong> Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi cho đến khi bạn click vào link trên và tạo mật khẩu mới.
              </p>
            </div>
            
            <div style="background-color: #e0f2fe; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #0c4a6e; font-size: 14px; margin: 0; line-height: 1.6;">
                <strong>💡 Mẹo bảo mật:</strong><br/>
                • Chọn mật khẩu mạnh với ít nhất 8 ký tự<br/>
                • Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt<br/>
                • Không sử dụng lại mật khẩu từ tài khoản khác
              </p>
            </div>
            
            <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">
              © 2025 ERP System. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log('Password reset email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Password reset email sent successfully',
        response: emailResponse
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error sending password reset email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
