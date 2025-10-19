import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { requestId, approved, reviewNote } = await req.json();
    
    console.log('📝 Processing change request:', { requestId, approved });
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }
    
    console.log('✅ User authenticated:', user.id);
    
    const { data: userRoles } = await supabaseAdmin
      .from('user_roles')
      .select('*, roles!inner(*)')
      .eq('user_id', user.id);
    
    const hasPermission = userRoles?.some((ur: any) => 
      ['Owner', 'Admin', 'HR Manager'].includes(ur.roles.name)
    );
    
    if (!hasPermission) {
      throw new Error('Insufficient permissions');
    }
    
    console.log('✅ Permission verified');
    
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('employee_change_requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (fetchError || !request) {
      throw new Error('Change request not found');
    }
    
    console.log('✅ Request fetched:', request.id);
    
    if (approved) {
      const updates: any = {};
      
      for (const [field, value] of Object.entries(request.changes as any)) {
        if (field !== 'avatar_path') {
          updates[field] = value.new;
        }
      }
      
      const { error: updateError } = await supabaseAdmin
        .from('employees')
        .update(updates)
        .eq('id', request.employee_id);
      
      if (updateError) {
        console.error('❌ Error updating employee:', updateError);
        throw updateError;
      }
      
      console.log('✅ Employee updated');
    }
    
    const { error: statusError } = await supabaseAdmin
      .from('employee_change_requests')
      .update({
        status: approved ? 'approved' : 'rejected',
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        review_note: reviewNote || null
      })
      .eq('id', requestId);
    
    if (statusError) {
      console.error('❌ Error updating request status:', statusError);
      throw statusError;
    }
    
    console.log('✅ Request status updated');
    
    if (approved) {
      await supabaseAdmin
        .from('employee_audit_log')
        .update({ change_request_id: requestId })
        .eq('employee_id', request.employee_id)
        .is('change_request_id', null)
        .order('changed_at', { ascending: false })
        .limit(1);
      
      console.log('✅ Audit log linked');
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
