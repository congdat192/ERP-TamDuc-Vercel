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
  clientSecret: string;
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
    const { retailerName, clientId, clientSecret }: SaveTokenRequest = await req.json();

    // Validate inputs
    if (!retailerName || !clientId || !clientSecret) {
      throw new Error('Missing required fields: retailerName, clientId, clientSecret');
    }

    console.log('✅ Inputs validated');

    // Step 1: Get Access Token from KiotViet OAuth
    console.log('🔑 Requesting access token from KiotViet OAuth...');
    const oauthResponse = await fetch('https://id.kiotviet.vn/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        scopes: 'PublicApi.Access',
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      }).toString()
    });

    if (!oauthResponse.ok) {
      const errorText = await oauthResponse.text();
      console.error('❌ OAuth error:', errorText);
      throw new Error(`Failed to obtain access token: ${oauthResponse.status} ${errorText}`);
    }

    const oauthData = await oauthResponse.json();
    const accessToken = oauthData.access_token;
    const expiresIn = oauthData.expires_in; // seconds

    if (!accessToken) {
      throw new Error('No access token returned from KiotViet OAuth');
    }

    console.log(`✅ Access token obtained (expires in ${expiresIn}s)`);

    // Step 2: Test connection with KiotViet API
    console.log('🔍 Testing KiotViet API connection...');
    const testResponse = await fetch('https://public.kiotapi.com/categories?pageSize=1', {
      headers: {
        'Retailer': retailerName,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      throw new Error(`API connection test failed: ${testResponse.status} ${errorText}`);
    }

    console.log('✅ KiotViet API connection test passed');

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

    // Calculate token expiry time
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Save new credentials
    const { data: credential, error: saveError } = await supabaseAdmin
      .from('kiotviet_credentials')
      .insert({
        user_id: user.id,
        retailer_name: retailerName,
        client_id: clientId,
        encrypted_token: encryptedToken,
        token_expires_at: tokenExpiresAt,
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
