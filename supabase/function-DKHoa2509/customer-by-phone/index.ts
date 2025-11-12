import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCached, setCache } from './cache-helper.ts';
import { validateToken } from './token-validator.ts';
import { checkPermission } from './permission-checker.ts';
import { findCustomerByPhone } from './customer-query.ts';
console.info('Customer by Phone API started');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*'
};
Deno.serve(async (req)=>{
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  try {
    // 1. Extract OAuth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        error: 'Missing token',
        request_id: requestId
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const oauthToken = authHeader.replace('Bearer ', '');
    // 2. Extract phone parameter
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');
    if (!phone) {
      return new Response(JSON.stringify({
        error: 'Missing phone parameter',
        request_id: requestId
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const cleanPhone = phone.replace(/\D/g, '');
    // 3. Check cache first
    const cacheKey = `customer:${cleanPhone}`;
    const cached = getCached(cacheKey);
    if (cached) {
      console.log('✅ Returning cached result');
      return new Response(JSON.stringify(cached), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Cache': 'HIT',
          'X-Response-Time': `${Date.now() - startTime}ms`
        }
      });
    }
    // 4. Initialize Supabase client
    const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), {
      db: {
        schema: 'api'
      }
    });
    // 5. Validate token
    const tokenRecord = await validateToken(supabase, oauthToken);
    if (!tokenRecord) {
      return new Response(JSON.stringify({
        error: 'Invalid token',
        request_id: requestId
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // 6. Check client active status
    if (!tokenRecord.oauth_clients?.active) {
      return new Response(JSON.stringify({
        error: 'Client suspended',
        request_id: requestId
      }), {
        status: 403,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // 7. Check permissions
    const hasAccess = await checkPermission(supabase, tokenRecord.client_id);
    if (!hasAccess) {
      return new Response(JSON.stringify({
        error: 'Insufficient permissions',
        request_id: requestId
      }), {
        status: 403,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // 8. Query customer & update usage in parallel
    const now = new Date();
    const [customerData] = await Promise.all([
      findCustomerByPhone(supabase, phone),
      // Update token usage and log (fire and forget)
      Promise.all([
        supabase.from('oauth_tokens').update({
          last_used_at_vn: now.toISOString()
        }).eq('id', tokenRecord.id),
        supabase.from('oauth_token_usage').insert({
          token_id: tokenRecord.id,
          client_id: tokenRecord.client_id,
          ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
          endpoint: 'kiotviet.customer_by_phone',
          status_code: 200,
          created_at_vn: now.toISOString()
        })
      ]).catch(console.error)
    ]);
    // 9. Check if customer found
    if (!customerData) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Customer not found',
        phone: phone,
        request_id: requestId
      }), {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // 10. Prepare response
    const responseData = {
      success: true,
      data: customerData,
      meta: {
        request_id: requestId,
        duration_ms: Date.now() - startTime
      }
    };
    // Cache response
    setCache(cacheKey, responseData);
    // 11. Return success response
    return new Response(JSON.stringify(responseData), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'X-Response-Time': `${Date.now() - startTime}ms`,
        'Cache-Control': 'private, max-age=60'
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      request_id: requestId
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
