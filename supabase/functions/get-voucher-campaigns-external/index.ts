import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXTERNAL_API_BASE = 'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1';

async function getOAuthToken(): Promise<string> {
  const response = await fetch(`${EXTERNAL_API_BASE}/get-token-supabase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: Deno.env.get('EXTERNAL_API_CLIENT_ID'),
      client_secret: Deno.env.get('EXTERNAL_API_CLIENT_SECRET')
    })
  });

  if (!response.ok) {
    throw new Error(`OAuth failed: ${response.status}`);
  }

  const data = await response.json();
  return data.success ? data.data.access_token : data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[get-voucher-campaigns-external] Fetching campaigns from external API');

    // Get OAuth token
    const oauthToken = await getOAuthToken();

    // TODO: Thay endpoint khi user cung cấp
    const response = await fetch(
      `${EXTERNAL_API_BASE}/voucher-campaigns`,
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
      console.error('[get-voucher-campaigns-external] API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to fetch campaigns',
          details: errorText
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    
    // Filter chỉ lấy campaigns active
    let campaigns = data.data || data;
    if (Array.isArray(campaigns)) {
      campaigns = campaigns.filter((c: any) => c.is_active === true);
    }
    
    console.log(`[get-voucher-campaigns-external] Success: ${campaigns.length} active campaigns`);

    return new Response(
      JSON.stringify({
        success: true,
        data: campaigns
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[get-voucher-campaigns-external] Exception:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
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
