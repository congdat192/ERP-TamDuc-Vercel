import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXTERNAL_API_BASE = 'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1';
const EXTERNAL_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjaXJwanhianFhZ3JxcmpmbGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MTI3NjgsImV4cCI6MjA3Mjk4ODc2OH0.GXxO7aPgF00WOkQ96z2J1P3K3BluPfBcais3h8qLr1I';

interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

async function getOAuthToken(): Promise<string> {
  console.log('[claim-voucher] Fetching OAuth token...');
  
  const response = await fetch(`${EXTERNAL_API_BASE}/get-token-supabase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: 'mk_tamduc',
      client_secret: 'Tamduc@123'
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get OAuth token: ${response.status} - ${errorText}`);
  }

  const data: OAuthTokenResponse = await response.json();
  console.log('[claim-voucher] OAuth token fetched successfully');
  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { phone, campaign_id } = body;

    if (!phone || !campaign_id) {
      return new Response(
        JSON.stringify({ error: 'Phone and campaign_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[claim-voucher] Claiming voucher for phone:', phone, 'campaign:', campaign_id);

    // Get OAuth token
    const oauthToken = await getOAuthToken();

    // Call external API
    const response = await fetch(
      `${EXTERNAL_API_BASE}/claim-voucher`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, campaign_id })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[claim-voucher] API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to claim voucher',
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
    console.log('[claim-voucher] Success:', data.meta);

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[claim-voucher] Exception:', error);
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
