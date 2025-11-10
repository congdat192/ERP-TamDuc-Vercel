import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXTERNAL_API_BASE = Deno.env.get('EXTERNAL_API_BASE');

interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

async function getOAuthToken(): Promise<string> {
  const clientId = Deno.env.get('EXTERNAL_API_CLIENT_ID');
  const clientSecret = Deno.env.get('EXTERNAL_API_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('Missing EXTERNAL_API_CLIENT_ID or EXTERNAL_API_CLIENT_SECRET');
  }

  const tokenResponse = await fetch(`${EXTERNAL_API_BASE}/get-token-supabase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error(`Failed to get OAuth token: ${tokenResponse.statusText}`);
  }

  const tokenData: OAuthTokenResponse = await tokenResponse.json();
  return tokenData.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[customer-family-members] Request received');

    // Parse request body
    const body = await req.json();
    const { customer_phone, action, data } = body;

    if (!customer_phone || !action) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: customer_phone and action' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('[customer-family-members] Action:', action, 'Phone:', customer_phone);

    // Get OAuth token
    const accessToken = await getOAuthToken();

    // Forward request to External Supabase
    const externalResponse = await fetch(
      'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/customer-family-members',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_phone,
          action,
          data,
        }),
      }
    );

    const responseData = await externalResponse.json();

    if (!externalResponse.ok) {
      console.error('[customer-family-members] External API error:', responseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: responseData.error || 'External API error',
          details: responseData
        }),
        { 
          status: externalResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('[customer-family-members] Success:', action);

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[customer-family-members] Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
