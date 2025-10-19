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

    console.log('[get-customer-by-phone] Searching for phone:', phone);

    const data = await EXTERNAL_API.request<any>(
      `/customer-by-phone?phone=${encodeURIComponent(phone)}`
    );

    console.log('[get-customer-by-phone] Success:', data.data?.name || 'Customer found');
    return createResponse(data);

  } catch (error) {
    console.error('[get-customer-by-phone] Error:', error);
    return createErrorResponse(error);
  }
});
