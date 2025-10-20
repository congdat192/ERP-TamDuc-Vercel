-- Bảng tracking email gửi đi (audit trail)
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Sender info
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  
  -- Email content
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL, -- 'otp', 'password_reset', 'user_credentials', 'payroll'
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  
  -- Metadata
  sent_by UUID REFERENCES auth.users(id), -- NULL nếu system-generated
  metadata JSONB, -- Thông tin thêm (VD: employee_id, otp_code, etc.)
  
  -- Performance
  sent_at TIMESTAMPTZ,
  response_time_ms INTEGER
);

-- Index for fast lookup
CREATE INDEX idx_email_logs_to_email ON public.email_logs(to_email);
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_email_type ON public.email_logs(email_type);

-- RLS policies (Admin only)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all email logs"
  ON public.email_logs
  FOR SELECT
  USING (is_admin(auth.uid()));

-- No INSERT/UPDATE/DELETE from client
-- Edge functions sẽ dùng service_role_key để insert