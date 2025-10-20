import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

console.info("Get Token Supabase API started");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "method_not_allowed",
        error_description: "Chỉ chấp nhận phương thức POST",
      }),
      { status: 405 },
    );
  }

  const requestId = crypto.randomUUID();
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { client_id, client_secret } = body;

    if (!client_id || !client_secret) {
      return new Response(
        JSON.stringify({
          error: "invalid_request",
          error_description: "Thiếu client_id hoặc client_secret",
          request_id: requestId,
        }),
        { status: 400 },
      );
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), {
      db: { schema: "api" },
    });

    // BƯỚC 1: Xác thực client
    const { data: client, error: clientError } = await supabase
      .from("oauth_clients")
      .select("client_id, client_name, active")
      .eq("client_id", client_id)
      .eq("client_secret", client_secret)
      .eq("active", true)
      .single();

    if (clientError || !client) {
      console.error(`Authentication failed for client_id: ${client_id}`);
      return new Response(
        JSON.stringify({
          error: "unauthorized",
          error_description: "Client không tồn tại hoặc bị khóa",
          request_id: requestId,
        }),
        { status: 401 },
      );
    }

    // BƯỚC 2: Kiểm tra token hiện tại
    const now = new Date();
    const { data: existingToken } = await supabase
      .from("oauth_tokens")
      .select("access_token, expires_at_vn")
      .eq("client_id", client_id)
      .eq("revoked", false)
      .gt("expires_at_vn", now.toISOString())
      .single();

    // Nếu có token còn hạn, trả về luôn
    if (existingToken) {
      const expiresAt = new Date(existingToken.expires_at_vn);
      const expiresIn = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

      console.info(`Returning existing token for client: ${client_id}`);
      return new Response(
        JSON.stringify({
          access_token: existingToken.access_token,
          token_type: "Bearer",
          expires_in: expiresIn,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // BƯỚC 3: Tạo token mới
    const newToken = "mktd_" + crypto.randomUUID() + "_" + crypto.randomUUID();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 năm

    const { error: insertError } = await supabase.from("oauth_tokens").insert({
      client_id: client_id,
      access_token: newToken,
      token_type: "Bearer",
      expires_at_vn: expiresAt.toISOString(),
      revoked: false,
      created_at_vn: now.toISOString(),
      last_used_at_vn: now.toISOString(),
    });

    if (insertError) {
      console.error("Failed to create token:", insertError);
      return new Response(
        JSON.stringify({
          error: "server_error",
          error_description: "Không thể tạo token mới",
          request_id: requestId,
        }),
        { status: 500 },
      );
    }

    console.info(`New token created for client: ${client_id}`);

    return new Response(
      JSON.stringify({
        access_token: newToken,
        token_type: "Bearer",
        expires_in: 365 * 24 * 60 * 60, // 1 năm (giây)
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "server_error",
        error_description: "Đã xảy ra lỗi khi xử lý yêu cầu",
        request_id: requestId,
      }),
      { status: 500 },
    );
  }
});
