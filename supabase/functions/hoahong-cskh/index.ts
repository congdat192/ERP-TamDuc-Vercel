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

// ✅ API v1.2 Response Format (External API now returns this directly)
interface CSKHApiResponseV1_2 {
  success: boolean;
  creator_phone: string;
  period: {
    from: string;
    to: string;
  };
  summary: {
    total_revenue: number;
    total_orders: number;
    total_vouchers: number;
    breakdown: {
      new_customers: {
        revenue: number;
        orders: number;
      };
      old_customers: {
        revenue: number;
        orders: number;
      };
    };
  };
  pagination: {
    page: number;
    pagesize: number;
    total: number;
  };
}

// ❌ DEPRECATED: Old format (kept for backward compatibility if needed)
interface CSKHApiResponseOld {
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

type CSKHApiResponse = CSKHApiResponseV1_2 | CSKHApiResponseOld;

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

    // ✅ Log response từ External API để debug
    const apiDataStr = JSON.stringify(apiData);
    console.log('[hoahong-cskh] External API response (first 1000 chars):',
      apiDataStr.substring(0, 1000));

    // ✅ DETECT FORMAT: Check if API is returning v1.2 format or old format
    const isV1_2Format = 'creator_phone' in apiData && 'period' in apiData;

    console.log('[hoahong-cskh] Response format detected:', {
      format: isV1_2Format ? 'v1.2' : 'old',
      success: apiData.success,
      has_data: !!(apiData as any).data,
      has_meta: !!(apiData as any).meta,
      has_creator_phone: !!('creator_phone' in apiData ? (apiData as CSKHApiResponseV1_2).creator_phone : null),
      has_period: !!(apiData as any).period,
      top_level_keys: Object.keys(apiData),
    });

    // ✅ If API already returns v1.2 format, just pass it through
    if (isV1_2Format) {
      const v1_2Data = apiData as CSKHApiResponseV1_2;

      // Validate v1.2 structure
      if (!v1_2Data.summary || !v1_2Data.summary.breakdown || !v1_2Data.pagination) {
        console.error('[hoahong-cskh] Incomplete v1.2 structure:', {
          has_summary: !!v1_2Data.summary,
          has_breakdown: v1_2Data.summary ? !!v1_2Data.summary.breakdown : false,
          has_pagination: !!v1_2Data.pagination,
        });
        return new Response(
          JSON.stringify({
            success: false,
            error: 'INCOMPLETE_API_RESPONSE',
            message: 'External API returned incomplete v1.2 structure',
            details: {
              has_summary: !!v1_2Data.summary,
              has_breakdown: v1_2Data.summary ? !!v1_2Data.summary.breakdown : false,
              has_pagination: !!v1_2Data.pagination,
            },
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const endTime = Date.now();
      console.log('[hoahong-cskh] Request completed in', endTime - startTime, 'ms');
      console.log('[hoahong-cskh] Passing through v1.2 response:', {
        success: v1_2Data.success,
        creator_phone: v1_2Data.creator_phone,
        total_orders: v1_2Data.summary.total_orders,
        total_revenue: v1_2Data.summary.total_revenue,
      });

      return new Response(JSON.stringify(v1_2Data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ✅ OLD FORMAT: Transform old format to v1.2
    const oldData = apiData as CSKHApiResponseOld;

    // Validate old format structure
    if (!oldData.data) {
      console.error('[hoahong-cskh] Missing data field in old format:', apiData);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INVALID_API_RESPONSE',
          message: 'External API returned response without data field (old format)',
          details: {
            received_success: oldData.success,
            has_meta: !!oldData.meta,
            raw_keys: Object.keys(oldData),
          },
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!oldData.data.summary || !oldData.data.breakdown || !oldData.data.pagination) {
      console.error('[hoahong-cskh] Incomplete old format data structure:', {
        has_summary: !!oldData.data.summary,
        has_breakdown: !!oldData.data.breakdown,
        has_list: !!oldData.data.list,
        has_pagination: !!oldData.data.pagination,
      });
      return new Response(
        JSON.stringify({
          success: false,
          error: 'INCOMPLETE_API_RESPONSE',
          message: 'External API returned incomplete old format data structure',
          details: {
            has_summary: !!oldData.data.summary,
            has_breakdown: !!oldData.data.breakdown,
            has_pagination: !!oldData.data.pagination,
          },
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Transform old format to v1.2
    const transformedResponse = {
      success: oldData.success,
      creator_phone: oldData.meta.creatorphone,
      period: {
        from: oldData.meta.fromdate || '',
        to: oldData.meta.todate || '',
      },
      summary: {
        total_revenue: oldData.data.summary.total_revenue,
        total_orders: oldData.data.summary.orders_count,
        total_vouchers: 0, // API cũ không có field này, set default 0
        breakdown: {
          new_customers: {
            revenue: oldData.data.breakdown.new_customer.revenue,
            orders: oldData.data.breakdown.new_customer.count,
          },
          old_customers: {
            revenue: oldData.data.breakdown.returning_customer.revenue,
            orders: oldData.data.breakdown.returning_customer.count,
          },
        },
      },
      pagination: oldData.data.pagination,
    };

    const endTime = Date.now();
    console.log('[hoahong-cskh] Request completed in', endTime - startTime, 'ms');
    console.log('[hoahong-cskh] Transformed old format to v1.2:', {
      success: transformedResponse.success,
      creator_phone: transformedResponse.creator_phone,
      total_orders: transformedResponse.summary.total_orders,
      total_revenue: transformedResponse.summary.total_revenue,
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
