import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXTERNAL_API_BASE = Deno.env.get('EXTERNAL_API_BASE') || 'https://kcirpjxbjqagrqrjfldu.supabase.co';

// Get OAuth Token
async function getOAuthToken(): Promise<string> {
  const clientId = Deno.env.get('EXTERNAL_API_CLIENT_ID');
  const clientSecret = Deno.env.get('EXTERNAL_API_CLIENT_SECRET');

  console.log('[check-type-customer] Requesting OAuth token...');

  const response = await fetch(`${EXTERNAL_API_BASE}/functions/v1/get-token-supabase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    })
  });

  if (!response.ok) {
    throw new Error(`OAuth token request failed: ${response.status}`);
  }

  const data = await response.json();
  console.log('[check-type-customer] OAuth token obtained');
  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse phone from query params
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');

    if (!phone) {
      console.error('[check-type-customer] Missing phone parameter');
      return new Response(
        JSON.stringify({ success: false, error: 'Phone number is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[check-type-customer] Checking phone:', phone);

    // Step 1: Get OAuth token
    const token = await getOAuthToken();

    // Step 2: Call external API
    const apiUrl = `${EXTERNAL_API_BASE}/functions/v1/check-type-customer?phone=${encodeURIComponent(phone)}`;
    console.log('[check-type-customer] Calling external API:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[check-type-customer] External API error:', response.status, errorText);
      throw new Error(`External API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[check-type-customer] API response:', data);

    // Step 3: Return standardized response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          phone: data.phone,
          customer_type: data.customer_type // 'new' | 'old'
        },
        meta: {
          request_id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[check-type-customer] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
