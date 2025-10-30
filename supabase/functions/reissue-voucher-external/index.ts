import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    throw new Error(`Failed to get OAuth token: ${response.status}`);
  }

  const data = await response.json();
  return data.success ? data.data.access_token : data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Bạn chưa đăng nhập.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { voucher_code } = body;

    if (!voucher_code) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: voucher_code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[reissue-voucher] User ${user.email} requesting reissue for: ${voucher_code}`);

    const oauthToken = await getOAuthToken();

    const response = await fetch(
      `${EXTERNAL_API_BASE}/reissue-voucher`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ voucher_code })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[reissue-voucher] API error:', response.status, errorText);

      return new Response(
        JSON.stringify({ 
          error: 'Failed to reissue voucher', 
          message: errorText || 'Không thể cấp lại voucher.',
          details: errorText 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log('[reissue-voucher] Success:', data);

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[reissue-voucher] Exception:', error);
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
