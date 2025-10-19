import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { EXTERNAL_API } from "../_shared/token-manager.ts";
import { handleCors, createResponse, createErrorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return createErrorResponse({ message: 'ID is required' }, 400);
    }

    console.log('[get-voucher-terms] ID:', id);

    const data = await EXTERNAL_API.request(
      `/voucher-popup-terms?id=${encodeURIComponent(id)}`
    );

    console.log('[get-voucher-terms] Success');
    return createResponse(data);

  } catch (error) {
    return createErrorResponse(error);
  }
});
