import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  jti: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[get-oauth-token] Fetching OAuth token...');
    console.log('[get-oauth-token] Request URL:', 'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/get-token-supabase');

    const response = await fetch(
      'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/get-token-supabase',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: 'mk_tamduc',
          client_secret: 'Tamduc@123'
        })
      }
    );

    console.log('[get-oauth-token] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[get-oauth-token] Failed to fetch token:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get OAuth token',
          status: response.status,
          details: errorText
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log('[get-oauth-token] Full response data:', JSON.stringify(data));
    console.log('[get-oauth-token] Response keys:', Object.keys(data));
    
    // ✅ FIX: Extract token from nested structure
    const actualToken = data.data?.access_token || data.access_token;
    const expiresAt = data.data?.expires_at_vn || data.expires_at_vn;
    
    console.log('[get-oauth-token] Has access_token:', !!actualToken);
    console.log('[get-oauth-token] Token (first 20 chars):', actualToken?.substring(0, 20));
    console.log('[get-oauth-token] Expires at:', expiresAt);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          access_token: actualToken,
          expires_at_vn: expiresAt
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[get-oauth-token] Exception:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
