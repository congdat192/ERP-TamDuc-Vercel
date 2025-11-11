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

    // Parse request body (keep original structure)
    const requestBody = await req.json();

    // Validate required fields according to API spec
    if (!requestBody.action || !requestBody.customer_sdt) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: action and customer_sdt',
          error_description: 'Thiếu trường bắt buộc: action và customer_sdt'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('[customer-family-members] Action:', requestBody.action, 'Phone:', requestBody.customer_sdt);

    // Get OAuth token
    const accessToken = await getOAuthToken();

    // Forward entire request body to External Supabase (preserve API spec structure)
    const externalResponse = await fetch(
      'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/customer-family-members',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    const responseData = await externalResponse.json();

    if (!externalResponse.ok) {
      console.error('[customer-family-members] External API error:', responseData);
      return new Response(
        JSON.stringify({
          success: false,
          error: responseData.error || 'External API error',
          error_description: responseData.error_description,
          details: responseData
        }),
        {
          status: externalResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('[customer-family-members] Success:', requestBody.action);

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
        error: error.message,
        error_description: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
