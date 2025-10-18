import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

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

    // Verify the user making the request
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('🔍 [delete-user] Request from user:', user.id);

    // Check if user is admin
    const { data: userRoles, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select(`
        roles!user_roles_role_id_fkey (
          name
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (roleError || !userRoles) {
      throw new Error('Unable to verify user role');
    }

    const roleName = (userRoles.roles as any).name.toLowerCase();
    if (!['owner', 'admin'].includes(roleName)) {
      throw new Error('Only admins can delete users');
    }

    console.log('✅ [delete-user] User is admin:', roleName);

    // Get user ID to delete from request body
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('userId is required');
    }

    // Prevent self-deletion
    if (userId === user.id) {
      throw new Error('Cannot delete your own account');
    }

    console.log('🗑️ [delete-user] Deleting user:', userId);

    // Delete user from auth.users (cascades to profiles and user_roles)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('❌ [delete-user] Error:', deleteError);
      throw deleteError;
    }

    console.log('✅ [delete-user] User deleted successfully:', userId);

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ [delete-user] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
