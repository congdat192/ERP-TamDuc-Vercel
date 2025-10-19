import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { EXTERNAL_API } from "../_shared/token-manager.ts";
import { handleCors, createResponse, createErrorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const body = await req.json();
    const { phone, campaign_id } = body;

    if (!phone || !campaign_id) {
      return createErrorResponse(
        { message: 'Phone and campaign_id are required' }, 
        400
      );
    }

    console.log('[claim-voucher] Phone:', phone, 'Campaign:', campaign_id);

    const data = await EXTERNAL_API.request<any>('/claim-voucher', {
      method: 'POST',
      body: JSON.stringify({ phone, campaign_id })
    });

    console.log('[claim-voucher] Success:', data.voucher?.code || 'Voucher claimed');
    return createResponse(data);

  } catch (error) {
    return createErrorResponse(error);
  }
});
