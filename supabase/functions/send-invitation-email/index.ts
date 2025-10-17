import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';
import { Resend } from 'https://esm.sh/resend@2.0.0';

const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resend = new Resend(Deno.env.get('RESEND_API_KEY')!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationEmailRequest {
  invitationId: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { invitationId }: InvitationEmailRequest = await req.json();

    // Fetch invitation details with related data
    const { data: invitation, error: invError } = await supabase
      .from('business_invitations')
      .select(`
        id,
        email,
        token,
        expires_at,
        businesses!inner (
          name
        ),
        roles!inner (
          name,
          description
        ),
        profiles!business_invitations_invited_by_fkey (
          full_name
        )
      `)
      .eq('id', invitationId)
      .single();

    if (invError || !invitation) {
      throw new Error('Invitation not found: ' + (invError?.message || 'Unknown error'));
    }

    const businessName = (invitation.businesses as any)?.name || 'Doanh nghiệp';
    const inviterName = (invitation.profiles as any)?.full_name || 'Quản trị viên';
    const roleName = (invitation.roles as any)?.name || 'Thành viên';
    const siteUrl = Deno.env.get('SITE_URL') || 'https://tam-duc-erp-final.lovable.app';
    const acceptLink = `${siteUrl}/invitation/accept?token=${invitation.token}`;

    console.log('Sending invitation email to:', invitation.email);
    console.log('Business:', businessName);
    console.log('Role:', roleName);
    console.log('Accept link:', acceptLink);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: 'ERP System <onboarding@resend.dev>',
      to: invitation.email,
      subject: `Lời mời tham gia ${businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #1f2937; margin-bottom: 20px;">Lời mời tham gia doanh nghiệp</h1>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Xin chào,</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              <strong style="color: #1f2937;">${inviterName}</strong> đã mời bạn tham gia doanh nghiệp 
              <strong style="color: #1f2937;">${businessName}</strong> với vai trò 
              <strong style="color: #1f2937;">${roleName}</strong>.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${acceptLink}" 
                 style="background-color: #0070f3; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
                Chấp nhận lời mời
              </a>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                ⏰ Lời mời này sẽ hết hạn vào <strong>${new Date(invitation.expires_at).toLocaleDateString('vi-VN')}</strong>
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              Hoặc copy link sau vào trình duyệt:
            </p>
            <p style="color: #3b82f6; font-size: 13px; word-break: break-all; background-color: #f3f4f6; padding: 10px; border-radius: 4px;">
              ${acceptLink}
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
            
            <p style="color: #9ca3af; font-size: 13px; margin: 0;">
              Nếu bạn không mong đợi email này, vui lòng bỏ qua. Không có thay đổi nào được thực hiện với tài khoản của bạn.
            </p>
          </div>
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation email sent successfully',
        response: emailResponse
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error sending invitation email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
