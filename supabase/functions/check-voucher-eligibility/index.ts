import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { EXTERNAL_API } from "../_shared/token-manager.ts";
import { handleCors, createResponse, createErrorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');

    if (!phone) {
      return createErrorResponse({ message: 'Phone number is required' }, 400);
    }

    console.log('[check-voucher-eligibility] Checking for phone:', phone);

    const data = await EXTERNAL_API.request<any>(
      `/check-voucher-eligibility?phone=${encodeURIComponent(phone)}`
    );

    console.log('[check-voucher-eligibility] Found:', 
      data.received_vouchers?.length || 0, 'received,',
      data.available_campaigns?.length || 0, 'available'
    );

    return createResponse(data);

  } catch (error) {
    console.error('[check-voucher-eligibility] Error:', error);
    return createErrorResponse(error);
  }
});
