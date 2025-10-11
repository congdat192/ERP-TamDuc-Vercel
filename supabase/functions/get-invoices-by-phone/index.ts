import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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

    console.log('[get-invoices-by-phone] Fetching invoices for phone:', phone);

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
      console.error('[get-invoices-by-phone] Failed to get OAuth token:', errorText);
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

    console.log('[get-invoices-by-phone] OAuth token obtained, fetching invoices...');

    // Step 2: Fetch invoices using OAuth token
    const invoicesResponse = await fetch(
      `https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/invoices-history-customer?phone=${encodeURIComponent(phone.trim())}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${oauthToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!invoicesResponse.ok) {
      const errorText = await invoicesResponse.text();
      console.error('[get-invoices-by-phone] Failed to fetch invoices:', invoicesResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch invoices',
          status: invoicesResponse.status,
          details: errorText
        }),
        {
          status: invoicesResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const invoicesData = await invoicesResponse.json();
    console.log('[get-invoices-by-phone] Invoices fetched successfully, count:', invoicesData.data?.summary?.total_invoices || 0);

    return new Response(
      JSON.stringify({
        success: true,
        data: invoicesData
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[get-invoices-by-phone] Exception:', error);
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
