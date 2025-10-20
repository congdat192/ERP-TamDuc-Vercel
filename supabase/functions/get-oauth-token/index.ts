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
    // Validate required secrets
    const externalApiKey = Deno.env.get('EXTERNAL_API_KEY');
    const clientId = Deno.env.get('EXTERNAL_API_CLIENT_ID');
    const clientSecret = Deno.env.get('EXTERNAL_API_CLIENT_SECRET');

    if (!externalApiKey || !clientId || !clientSecret) {
      console.error('[get-oauth-token] Missing required secrets');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error',
          message: 'Missing external API credentials'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[get-oauth-token] Fetching OAuth token...');

    const response = await fetch(
      'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/oauth-token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('EXTERNAL_API_KEY')}`
        },
        body: JSON.stringify({
          client_id: Deno.env.get('EXTERNAL_API_CLIENT_ID'),
          client_secret: Deno.env.get('EXTERNAL_API_CLIENT_SECRET'),
          grant_type: 'client_credentials'
        })
      }
    );

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

    const data: OAuthTokenResponse = await response.json();
    console.log('[get-oauth-token] Token fetched successfully, expires in:', data.expires_in);

    return new Response(
      JSON.stringify({
        success: true,
        data: data
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
