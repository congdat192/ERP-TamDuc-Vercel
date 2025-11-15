import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TokenResponse {
  success: boolean;
  data?: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

interface CSKHApiResponse {
  success: boolean;
  data: {
    summary: {
      total_revenue: number;
      total_profit: number;
      total_commission: number;
      orders_count: number;
    };
    breakdown: {
      new_customer: {
        count: number;
        revenue: number;
        commission: number;
      };
      returning_customer: {
        count: number;
        revenue: number;
        commission: number;
      };
    };
    list: Array<{
      creatorphone: string;
      creatorname: string;
      invoicecode: string;
      invoiceid: string;
      invoicestatus: string;
      customername: string;
      customerphone: string;
      customerstatus: string;
      revenue: number;
      profit: number;
      commission: number;
      created_at: string;
    }>;
    pagination: {
      page: number;
      pagesize: number;
      total: number;
    };
  };
  meta: {
    request_id: string;
    creatorphone: string;
    fromdate?: string;
    todate?: string;
    generated_at: string;
  };
}

async function getOAuthToken(): Promise<string> {
  const clientId = Deno.env.get('EXTERNAL_API_CLIENT_ID');
  const clientSecret = Deno.env.get('EXTERNAL_API_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    console.error('[hoahong-cskh] Missing EXTERNAL_API_CLIENT_ID or EXTERNAL_API_CLIENT_SECRET');
    throw new Error('External API credentials not configured');
  }

  console.log('[hoahong-cskh] Getting OAuth token...');

  const tokenResponse = await fetch(
    'https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/get-token-supabase',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
      }),
    }
  );

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('[hoahong-cskh] Token request failed:', tokenResponse.status, errorText);
    throw new Error(`Failed to get OAuth token: ${tokenResponse.status}`);
  }

  const tokenData: TokenResponse = await tokenResponse.json();

  if (!tokenData.success) {
    console.error('[hoahong-cskh] Token response unsuccessful:', tokenData);
    throw new Error('OAuth token request was not successful');
  }

  // Handle both response formats
  const accessToken = tokenData.data?.access_token || tokenData.access_token;

  if (!accessToken) {
    console.error('[hoahong-cskh] No access token in response:', tokenData);
    throw new Error('No access token in response');
  }

  console.log('[hoahong-cskh] OAuth token obtained successfully');
  return accessToken;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();

    // Extract query parameters
    const url = new URL(req.url);
    const creatorphone = url.searchParams.get('creatorphone');
    const fromdate = url.searchParams.get('fromdate');
    const todate = url.searchParams.get('todate');
    const page = url.searchParams.get('page') || '1';
    const pagesize = url.searchParams.get('pagesize') || '20';

    console.log('[hoahong-cskh] Request params:', {
      creatorphone,
      fromdate,
      todate,
      page,
      pagesize,
    });

    // Validate required parameters
    if (!creatorphone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'MISSING_PARAMETER',
          message: 'Missing required parameter: creatorphone',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get OAuth token
    const oauthToken = await getOAuthToken();

    // Build external API URL with query params
    const externalApiParams = new URLSearchParams();
    externalApiParams.append('creatorphone', creatorphone);
    if (fromdate) externalApiParams.append('fromdate', fromdate);
    if (todate) externalApiParams.append('todate', todate);
    externalApiParams.append('page', page);
    externalApiParams.append('pagesize', pagesize);

    const externalApiUrl = `https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/hoahong-cskh?${externalApiParams.toString()}`;

    console.log('[hoahong-cskh] Calling external API:', externalApiUrl);

    // Call external API
    const apiResponse = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${oauthToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('[hoahong-cskh] External API error:', apiResponse.status, errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'EXTERNAL_API_ERROR',
          message: `External API returned ${apiResponse.status}`,
          details: errorText,
        }),
        {
          status: apiResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const apiData: CSKHApiResponse = await apiResponse.json();

    // Transform response: flatten data.* to top level
    const transformedResponse = {
      success: apiData.success,
      summary: apiData.data.summary,
      breakdown: apiData.data.breakdown,
      list: apiData.data.list,
      pagination: apiData.data.pagination,
      meta: apiData.meta,
    };

    const endTime = Date.now();
    console.log('[hoahong-cskh] Request completed in', endTime - startTime, 'ms');
    console.log('[hoahong-cskh] Response summary:', {
      success: transformedResponse.success,
      orders_count: transformedResponse.summary.orders_count,
      list_length: transformedResponse.list.length,
    });

    return new Response(JSON.stringify(transformedResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[hoahong-cskh] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({
        success: false,
        error: 'INTERNAL_ERROR',
        message: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
