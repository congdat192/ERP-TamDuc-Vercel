import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const supabaseUrl = Deno.env.get('VITE_SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessInvitationRequest {
  token: string;
  action: 'accept' | 'reject';
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Get user from JWT
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { token, action }: ProcessInvitationRequest = await req.json();

    console.log(`Processing invitation: ${action} for user ${user.email}`);

    // Fetch invitation
    const { data: invitation, error: invError } = await supabase
      .from('business_invitations')
      .select('*')
      .eq('token', token)
      .eq('email', user.email)
      .eq('status', 'pending')
      .single();

    if (invError || !invitation) {
      console.error('Invitation error:', invError);
      throw new Error('Invalid or expired invitation');
    }

    // Check if invitation expired
    if (new Date(invitation.expires_at) < new Date()) {
      await supabase
        .from('business_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);
      
      throw new Error('Invitation has expired');
    }

    if (action === 'accept') {
      console.log('Accepting invitation for business:', invitation.business_id);
      
      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('business_members')
        .select('id')
        .eq('business_id', invitation.business_id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        // Update existing membership
        const { error: updateError } = await supabase
          .from('business_members')
          .update({
            role_id: invitation.role_id,
            status: 'ACTIVE'
          })
          .eq('id', existingMember.id);

        if (updateError) {
          throw new Error('Failed to update member: ' + updateError.message);
        }
      } else {
        // Add user to business_members
        const { error: memberError } = await supabase
          .from('business_members')
          .insert({
            business_id: invitation.business_id,
            user_id: user.id,
            role_id: invitation.role_id,
            status: 'ACTIVE',
            invited_by: invitation.invited_by
          });

        if (memberError) {
          console.error('Member insert error:', memberError);
          throw new Error('Failed to add member: ' + memberError.message);
        }
      }

      // Update invitation status
      await supabase
        .from('business_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      console.log('Invitation accepted successfully');

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Invitation accepted',
          business_id: invitation.business_id
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    } else {
      // Reject invitation
      await supabase
        .from('business_invitations')
        .update({ status: 'rejected' })
        .eq('id', invitation.id);

      console.log('Invitation rejected');

      return new Response(
        JSON.stringify({ success: true, message: 'Invitation rejected' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error('Error processing invitation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
