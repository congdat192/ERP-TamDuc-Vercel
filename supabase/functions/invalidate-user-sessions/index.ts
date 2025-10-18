import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.10';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the caller is authenticated
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(jwt);
    
    if (authError || !callerUser) {
      throw new Error('Unauthorized');
    }

    console.log('🔍 [invalidate-user-sessions] Request from user:', callerUser.id);

    // Verify caller is admin/owner
    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', callerUser.id)
      .single();

    const roleName = (callerRole as any)?.roles?.name?.toLowerCase();
    if (!['owner', 'admin'].includes(roleName)) {
      throw new Error('Only admins can invalidate user sessions');
    }

    console.log('✅ [invalidate-user-sessions] Caller is authorized:', roleName);

    // Get the userId to invalidate
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('Missing userId parameter');
    }

    console.log('🔐 [invalidate-user-sessions] Invalidating all sessions for user:', userId);

    // Revoke all refresh tokens for the user (global logout)
    const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(userId, 'global');
    
    if (signOutError) {
      console.error('❌ [invalidate-user-sessions] Error:', signOutError);
      throw signOutError;
    }

    console.log('✅ [invalidate-user-sessions] Successfully invalidated all sessions for:', userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'All sessions invalidated successfully',
        userId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('❌ [invalidate-user-sessions] Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
