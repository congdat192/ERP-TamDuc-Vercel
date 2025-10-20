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
    const clientId = Deno.env.get("EXTERNAL_API_CLIENT_ID");
    const clientSecret = Deno.env.get("EXTERNAL_API_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      console.error("[get-oauth-token] Missing required secrets");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("[get-oauth-token] Fetching OAuth token...");

    const response = await fetch("https://kcirpjxbjqagrqrjfldu.supabase.co/functions/v1/get-token-supabase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[get-oauth-token] Failed to fetch token:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Failed to get OAuth token",
          status: response.status,
          details: errorText,
        }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();

    console.log("[get-oauth-token] Token fetched successfully, expires in:", data.expires_in);

    // Trả về trực tiếp data, không wrap
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[get-oauth-token] Exception:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
