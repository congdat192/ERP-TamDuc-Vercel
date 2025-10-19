import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { EXTERNAL_API } from "../_shared/token-manager.ts";
import { handleCors, createResponse, createErrorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '20';
    const status = url.searchParams.get('status');
    const campaignId = url.searchParams.get('campaign_id');

    if (!phone) {
      return createErrorResponse({ message: 'Phone number is required' }, 400);
    }

    let query = `/voucher-history-customer?phone=${encodeURIComponent(phone)}&page=${page}&limit=${limit}`;
    if (status) query += `&status=${status}`;
    if (campaignId) query += `&campaign_id=${campaignId}`;

    console.log('[get-voucher-history] Query:', query);

    const data = await EXTERNAL_API.request<any>(query);

    console.log('[get-voucher-history] Found:', data.data?.pagination?.total || 0, 'records');
    return createResponse(data);

  } catch (error) {
    return createErrorResponse(error);
  }
});
