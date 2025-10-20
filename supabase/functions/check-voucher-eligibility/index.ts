import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXTERNAL_API_BASE = 'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1';
const EXTERNAL_API_KEY = Deno.env.get('EXTERNAL_API_KEY');

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

async function getOAuthToken(): Promise<string> {
  console.log('[check-voucher-eligibility] Fetching OAuth token...');
  
  const response = await fetch(`${EXTERNAL_API_BASE}/get-token-supabase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: Deno.env.get('EXTERNAL_API_CLIENT_ID'),
      client_secret: Deno.env.get('EXTERNAL_API_CLIENT_SECRET')
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get OAuth token: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('[check-voucher-eligibility] OAuth token fetched successfully');
  
  // Handle response format: { success: true, data: { access_token, ... } }
  if (data.success && data.data?.access_token) {
    return data.data.access_token;
  } else if (data.access_token) {
    return data.access_token;
  } else {
    throw new Error('Invalid token response structure');
  }
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
      console.error('[check-voucher-eligibility] Missing required secrets');
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
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[check-voucher-eligibility] Checking eligibility for phone:', phone);

    // Get OAuth token
    const oauthToken = await getOAuthToken();

    // Call external API
    const response = await fetch(
      `${EXTERNAL_API_BASE}/check-voucher-eligibility?phone=${encodeURIComponent(phone)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[check-voucher-eligibility] API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to check voucher eligibility',
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
    console.log('[check-voucher-eligibility] Success:', data.meta);

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[check-voucher-eligibility] Exception:', error);
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
