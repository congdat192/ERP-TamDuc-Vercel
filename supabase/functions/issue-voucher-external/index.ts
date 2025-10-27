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

  if (!response.ok) throw new Error(`OAuth failed: ${response.status}`);
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
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { phone, campaign_id, source, customer_info } = body;

    if (!phone || !campaign_id || !source) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('id', user.id)
      .single();

    const { data: employee } = await supabase
      .from('employees')
      .select('employee_code')
      .eq('user_id', user.id)
      .maybeSingle();

    console.log('[issue-voucher] Issuing voucher for phone:', phone);

    const payload = {
      phone,
      campaign_id,
      source,
      actor: {
        employee_id: user.id,
        employee_name: profile?.full_name || 'Unknown',
        employee_code: employee?.employee_code || 'N/A'
      },
      customer_info: customer_info || {}
    };

    const oauthToken = await getOAuthToken();

    const response = await fetch(
      `${EXTERNAL_API_BASE}/issue-voucher`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[issue-voucher] API error:', response.status, errorText);
      
      await supabase.from('voucher_issuance_history').insert({
        phone,
        campaign_id,
        source,
        customer_type: customer_info?.customer_type,
        issued_by: user.id,
        status: 'failed',
        error_message: errorText
      });

      return new Response(
        JSON.stringify({ error: 'Failed to issue voucher', details: errorText }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    console.log('[issue-voucher] Success:', data);

    await supabase.from('voucher_issuance_history').insert({
      phone,
      campaign_id,
      source,
      customer_type: customer_info?.customer_type,
      issued_by: user.id,
      voucher_code: data.data?.voucher_code,
      status: 'success',
      api_response: data
    });

    return new Response(
      JSON.stringify(data),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[issue-voucher] Exception:', error);
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
