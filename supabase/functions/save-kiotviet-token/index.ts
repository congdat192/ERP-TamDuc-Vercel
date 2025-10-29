import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encrypt } from '../_shared/crypto.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SaveTokenRequest {
  retailerName: string;
  clientId: string;
  accessToken: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔐 Save KiotViet token started');

    // Get auth user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Parse request
    const { retailerName, clientId, accessToken }: SaveTokenRequest = await req.json();

    // Validate inputs
    if (!retailerName || !clientId || !accessToken) {
      throw new Error('Missing required fields: retailerName, clientId, accessToken');
    }

    console.log('✅ Inputs validated');

    // Test connection with KiotViet API
    console.log('🔍 Testing KiotViet connection...');
    const testResponse = await fetch('https://public.kiotapi.com/categories?pageSize=1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      throw new Error(`Invalid access token or connection failed: ${testResponse.status} ${errorText}`);
    }

    console.log('✅ KiotViet connection test passed');

    // Encrypt token
    console.log('🔐 Encrypting access token...');
    const encryptedToken = await encrypt(accessToken);

    // Use service role client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Deactivate existing credentials
    await supabaseAdmin
      .from('kiotviet_credentials')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Save new credentials
    const { data: credential, error: saveError } = await supabaseAdmin
      .from('kiotviet_credentials')
      .insert({
        user_id: user.id,
        retailer_name: retailerName,
        client_id: clientId,
        encrypted_token: encryptedToken,
        is_active: true
      })
      .select()
      .single();

    if (saveError) {
      console.error('❌ Error saving credentials:', saveError);
      throw saveError;
    }

    console.log('✅ Credentials saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      credentialId: credential.id,
      message: 'KiotViet credentials saved successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('❌ Error saving token:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Unknown error occurred' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
