import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone } = await req.json();

    if (!phone || phone.trim() === "") {
      return new Response(JSON.stringify({ error: "Phone number is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[get-customer-by-phone] Fetching customer for phone:", phone);

    // Step 1: Get OAuth token from External API
    const tokenResponse = await fetch('https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/get-token-supabase', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: Deno.env.get("EXTERNAL_API_CLIENT_ID"),
        client_secret: Deno.env.get("EXTERNAL_API_CLIENT_SECRET"),
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[get-customer-by-phone] Failed to get OAuth token:", errorText);
      return new Response(JSON.stringify({ error: "Failed to get authentication token", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tokenData = await tokenResponse.json();

    // Parse response from External API
    let oauthToken: string;

    if (tokenData.success && tokenData.data?.access_token) {
      // Format from External API: { success: true, data: { access_token, ... } }
      oauthToken = tokenData.data.access_token;
    } else if (tokenData.access_token) {
      // Fallback for flat format: { access_token, token_type, expires_in }
      oauthToken = tokenData.access_token;
    } else {
      console.error("[get-customer-by-phone] Invalid token response structure:", tokenData);
      return new Response(JSON.stringify({ error: "Invalid token response structure", details: tokenData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[get-customer-by-phone] OAuth token obtained, token preview:", oauthToken.substring(0, 20) + "...");

    // Step 2: Fetch customer using OAuth token
    const customerUrl = `https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/customer-by-phone?phone=${encodeURIComponent(phone.trim())}`;

    console.log("[get-customer-by-phone] Calling customer API:", customerUrl);

    const customerResponse = await fetch(customerUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${oauthToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.error("[get-customer-by-phone] Failed to fetch customer:", customerResponse.status, errorText);

      return new Response(
        JSON.stringify({
          error: "Failed to fetch customer",
          status: customerResponse.status,
          details: errorText,
          token_preview: oauthToken.substring(0, 20) + "...",
        }),
        { status: customerResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const customerData = await customerResponse.json();
    console.log("[get-customer-by-phone] Customer fetched successfully");

    return new Response(
      JSON.stringify({
        success: true,
        data: customerData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[get-customer-by-phone] Exception:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
