import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();

    if (!phone || phone.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('[get-customer-by-phone] Fetching customer for phone:', phone);

    // Step 1: Get OAuth token
    const tokenResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/get-oauth-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        }
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[get-customer-by-phone] Failed to get OAuth token:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to get authentication token' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const tokenData = await tokenResponse.json();
    const oauthToken = tokenData.data.access_token;

    console.log('[get-customer-by-phone] OAuth token obtained');
    console.log('[get-customer-by-phone] Full token:', oauthToken);
    console.log('[get-customer-by-phone] Token type:', typeof oauthToken);
    console.log('[get-customer-by-phone] Token length:', oauthToken?.length);
    console.log('[get-customer-by-phone] Calling API with phone:', phone);

    const apiUrl = `https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/customer-by-phone?phone=${encodeURIComponent(phone.trim())}`;
    console.log('[get-customer-by-phone] API URL:', apiUrl);
    console.log('[get-customer-by-phone] Authorization header:', `Bearer ${oauthToken?.substring(0, 20)}...`);

    // Step 2: Fetch customer using OAuth token
    const customerResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[get-customer-by-phone] Customer API response status:', customerResponse.status);

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error('[get-customer-by-phone] Failed to fetch customer:', customerResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch customer',
          status: customerResponse.status,
          details: errorText
        }),
        {
          status: customerResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const customerData = await customerResponse.json();
    console.log('[get-customer-by-phone] Response structure:', {
      hasSuccess: !!customerData.success,
      hasData: !!customerData.data,
      hasMeta: !!customerData.meta,
      customerCode: customerData.data?.code
    });
    console.log('[get-customer-by-phone] Customer found:', customerData.data?.name || 'N/A', '(', customerData.data?.code || 'N/A', ')');

    return new Response(
      JSON.stringify(customerData),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[get-customer-by-phone] Exception:', error);
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
