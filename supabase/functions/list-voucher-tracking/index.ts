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
  console.log('[list-voucher-tracking] Fetching OAuth token...');
  
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
  console.log('[list-voucher-tracking] OAuth token fetched successfully');
  
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
      console.error('[list-voucher-tracking] Missing required secrets');
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

    // Extract ALL possible filters (không require phone)
    const params = new URLSearchParams();
    const allowedParams = [
      'code', 'campaign_id', 'campaign_code', 'activation_status',
      'recipient_phone', 'creator_phone', 'creator_name',
      'customer_type', 'customer_source', 'voucher_used',
      'invoice_id', 'invoice_code', 'invoice_status', 'invoice_amount',
      'created_at_from', 'created_at_to', 
      'activated_at_from', 'activated_at_to',
      'expired_at_from', 'expired_at_to',
      'page_size', 'offset', 'order_by', 'sort',
      'note',
      // Reissue 1
      'reissue_1_code', 'reissue_1_status',
      'reissue_1_invoice_id', 'reissue_1_invoice_code',
      'reissue_1_invoice_status', 'reissue_1_invoice_amount',
      // Reissue 2
      'reissue_2_code', 'reissue_2_status',
      'reissue_2_invoice_id', 'reissue_2_invoice_code',
      'reissue_2_invoice_status', 'reissue_2_invoice_amount'
    ];

    allowedParams.forEach(key => {
      const value = url.searchParams.get(key);
      if (value !== null && value !== '') {
        params.append(key, value);
      }
    });

    console.log('[list-voucher-tracking] Filters:', params.toString());

    // Get OAuth token
    const oauthToken = await getOAuthToken();

    // Call external API
    const response = await fetch(
      `${EXTERNAL_API_BASE}/list-voucher-tracking?${params.toString()}`,
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
      console.error('[list-voucher-tracking] API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch voucher tracking',
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
    console.log('[list-voucher-tracking] Success:', data.pagination);

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[list-voucher-tracking] Exception:', error);
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
