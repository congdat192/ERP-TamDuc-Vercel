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

    // Call Supabase B API với filter isactive=true
    const response = await fetch(
      `${EXTERNAL_API_BASE}/list-voucher-campaigns-kiotviet?isactive=true&pageSize=200`,
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
    
    // Transform Supabase B format → Supabase A format
    let campaigns = data.data || [];
    if (Array.isArray(campaigns)) {
      campaigns = campaigns
        .filter((c: any) => c.isactive === true) // Double-check filter
        .map((c: any) => ({
          campaign_id: c.id,                      // "id" → "campaign_id" (numeric: 101111)
          campaign_code: c.code,                  // "code" → "campaign_code" (string: "PHVC000003")
          campaign_name: c.name,                  // "name" → "campaign_name"
          discount_value: c.price || 0,           // "price" → "discount_value"
          discount_type: 'fixed',                 // Default "fixed" (VND)
          description: c.price 
            ? `Mã: ${c.code} • Giá trị: ${c.price.toLocaleString('vi-VN')}đ • Hết hạn sau ${c.expiretime || 0} ngày`
            : `Mã: ${c.code} • Hết hạn sau ${c.expiretime || 0} ngày`,
          is_active: c.isactive,
          
          // Optional: Store original data for future reference
          _meta: {
            external_id: c.id,
            start_date: c.startdate,
            end_date: c.enddate,
            expire_time: c.expiretime
          }
        }));
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
