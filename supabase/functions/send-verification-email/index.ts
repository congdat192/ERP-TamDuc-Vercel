import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationEmailRequest {
  email: string;
  confirmationUrl: string;
  userName?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, userName }: VerificationEmailRequest = await req.json();

    console.log('Sending verification email to:', email);
    console.log('Confirmation URL:', confirmationUrl);

    const emailResponse = await resend.emails.send({
      from: 'ERP System <onboarding@resend.dev>',
      to: email,
      subject: 'Xác thực tài khoản ERP System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin: 0;">🎉 Chào mừng đến với ERP System!</h1>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Xin chào ${userName || 'bạn'},
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Cảm ơn bạn đã đăng ký tài khoản ERP System. Để hoàn tất quá trình đăng ký, vui lòng xác thực địa chỉ email của bạn.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${confirmationUrl}" 
                 style="background-color: #10b981; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                Xác thực Email
              </a>
            </div>
            
            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 12px; margin: 20px 0;">
              <p style="color: #1e40af; font-size: 14px; margin: 0;">
                💡 Link xác thực này sẽ hết hạn sau 24 giờ. Vui lòng xác thực email càng sớm càng tốt.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Hoặc copy link sau vào trình duyệt:
            </p>
            <p style="color: #3b82f6; font-size: 13px; word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${confirmationUrl}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            
            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px; margin: 20px 0;">
              <p style="color: #991b1b; font-size: 13px; margin: 0;">
                ⚠️ Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này. Tài khoản sẽ không được kích hoạt nếu không xác thực.
              </p>
            </div>
            
            <p style="color: #9ca3af; font-size: 13px; margin: 0; text-align: center;">
              © 2025 ERP System. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log('Verification email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification email sent successfully',
        response: emailResponse
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
