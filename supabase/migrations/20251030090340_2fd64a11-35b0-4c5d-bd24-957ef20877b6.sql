-- Setup pg_cron job for KiotViet auto-sync scheduler
-- This job runs every 5 minutes and triggers the kiotviet-schedule-sync edge function

-- Unschedule if job exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'kiotviet-sync-scheduler') THEN
    PERFORM cron.unschedule('kiotviet-sync-scheduler');
  END IF;
END $$;

-- Schedule the job
SELECT cron.schedule(
  'kiotviet-sync-scheduler',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://dtdtwhrqvkrymtyqbatn.supabase.co/functions/v1/kiotviet-schedule-sync',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0ZHR3aHJxdmtyeW10eXFiYXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTMzMDAsImV4cCI6MjA3NTQ2OTMwMH0.XVcOtsEUKJZelvIdy63VJv0B37_NutXMu1hvGK8m6lk"}'::jsonb,
      body := '{}'::jsonb
    ) as request_id;
  $$
);