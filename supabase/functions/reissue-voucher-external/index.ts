import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const EXTERNAL_API_BASE = Deno.env.get('EXTERNAL_API_BASE');

// Get OAuth token from external API
async function getOAuthToken(): Promise<string> {
  const clientId = Deno.env.get('EXTERNAL_API_CLIENT_ID');
  const clientSecret = Deno.env.get('EXTERNAL_API_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('Missing EXTERNAL_API_CLIENT_ID or EXTERNAL_API_CLIENT_SECRET');
  }

  const response = await fetch(`${EXTERNAL_API_BASE}/get-token-supabase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret })
  });

  if (!response.ok) {
    throw new Error(`Failed to get OAuth token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập lại.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { voucher_code } = body;

    // Validate required fields
    if (!voucher_code) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: voucher_code' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Reissue Voucher] User ${user.email} requesting reissue for voucher: ${voucher_code}`);

    // Get user profile and employee data
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name, phone, email')
      .eq('id', user.id)
      .single();

    const { data: employee } = await supabaseClient
      .from('employees')
      .select('employee_code, full_name, department, position')
      .eq('user_id', user.id)
      .single();

    // Get OAuth token
    const accessToken = await getOAuthToken();

    // Call external API to reissue voucher
    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/reissue-voucher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ voucher_code }),
    });

    const externalData = await externalResponse.json();

    if (!externalResponse.ok) {
      console.error('[Reissue Voucher] External API error:', {
        status: externalResponse.status,
        statusText: externalResponse.statusText,
        data: externalData
      });

      // Log failure to database (optional, can add voucher_reissue_history table if needed)
      console.log('[Reissue Voucher] Failed:', {
        voucher_code,
        user_email: user.email,
        employee_code: employee?.employee_code,
        error: externalData
      });

      return new Response(
        JSON.stringify({
          error: 'External API Error',
          message: externalData.message || externalData.description || 'Không thể cấp lại voucher. Vui lòng thử lại.',
          details: externalData
        }),
        { 
          status: externalResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Success - log to database (optional)
    console.log('[Reissue Voucher] Success:', {
      voucher_code,
      user_email: user.email,
      employee_code: employee?.employee_code,
      result: externalData
    });

    return new Response(
      JSON.stringify(externalData),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('[Reissue Voucher] Internal error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
