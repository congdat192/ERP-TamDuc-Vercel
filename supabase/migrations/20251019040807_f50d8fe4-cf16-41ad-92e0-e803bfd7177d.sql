-- ============================================
-- CUSTOM OTP SYSTEM: DATABASE TABLES
-- ============================================

-- Store OTP codes for email authentication
CREATE TABLE email_otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp_code text NOT NULL, -- 6 digit OTP
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  ip_address text
);

-- Index for fast lookup
CREATE INDEX idx_email_otp_email ON email_otp_codes(email);
CREATE INDEX idx_email_otp_expires ON email_otp_codes(expires_at);
CREATE INDEX idx_email_otp_verified ON email_otp_codes(verified);

-- Enable RLS (Edge Functions will use service role)
ALTER TABLE email_otp_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can access (blocks direct client access)
CREATE POLICY "Service role only"
ON email_otp_codes
USING (false);

-- ============================================
-- CLEANUP FUNCTION FOR EXPIRED OTP CODES
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_expired_otp()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM email_otp_codes
  WHERE expires_at < now() - INTERVAL '1 hour';
END;
$$;