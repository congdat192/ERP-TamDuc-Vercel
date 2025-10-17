import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    // For now, just log the email content
    // In production, integrate with Resend or other email service
    const emailContent = {
      from: 'ERP System <noreply@erp.com>',
      to: invitation.email,
      subject: `Lời mời tham gia ${businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333;">Lời mời tham gia doanh nghiệp</h1>
          <p>Xin chào,</p>
          <p><strong>${inviterName}</strong> đã mời bạn tham gia doanh nghiệp <strong>${businessName}</strong> với vai trò <strong>${roleName}</strong>.</p>
          
          <div style="margin: 30px 0;">
            <a href="${acceptLink}" 
               style="background-color: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Chấp nhận lời mời
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Lời mời này sẽ hết hạn vào ${new Date(invitation.expires_at).toLocaleDateString('vi-VN')}.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Hoặc copy link sau vào trình duyệt: <br/>
            <a href="${acceptLink}">${acceptLink}</a>
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Nếu bạn không mong đợi email này, vui lòng bỏ qua.
          </p>
        </div>
      `,
    };

    console.log('Email content prepared:', emailContent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invitation email logged (email service not configured)',
        emailContent 
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
