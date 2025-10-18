-- Create function to revoke all refresh tokens for a user
-- This fixes the JWT parse error in invalidate-user-sessions Edge Function
CREATE OR REPLACE FUNCTION public.revoke_user_sessions(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Revoke all active refresh tokens for the target user
  -- This will force logout on all devices
  UPDATE auth.refresh_tokens
  SET revoked = true
  WHERE user_id = target_user_id
    AND revoked = false;
END;
$$;