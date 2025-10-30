-- Phase 1: Enable extensions for cron scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create kiotviet_sync_schedules table
CREATE TABLE IF NOT EXISTS public.kiotviet_sync_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id UUID NOT NULL REFERENCES public.kiotviet_credentials(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('categories', 'products', 'inventory', 'products_full', 'all')),
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('hourly', 'daily', 'custom')),
  custom_interval_hours INTEGER CHECK (custom_interval_hours > 0 AND custom_interval_hours <= 168),
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(credential_id, sync_type)
);

-- Add index for efficient schedule queries
CREATE INDEX IF NOT EXISTS idx_sync_schedules_enabled 
ON public.kiotviet_sync_schedules(enabled, next_run_at) 
WHERE enabled = true;

-- Add index to sync_logs for performance
CREATE INDEX IF NOT EXISTS idx_sync_logs_started_at 
ON public.kiotviet_sync_logs(started_at DESC);

-- Enable RLS
ALTER TABLE public.kiotviet_sync_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can manage schedules
CREATE POLICY "Admin full access schedules"
ON public.kiotviet_sync_schedules
FOR ALL
USING (is_admin(auth.uid()));

-- Trigger function to auto-calculate next_run_at
CREATE OR REPLACE FUNCTION public.calculate_next_run_time()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  interval_hours INTEGER;
BEGIN
  -- Calculate interval based on frequency
  IF NEW.frequency = 'hourly' THEN
    interval_hours := 1;
  ELSIF NEW.frequency = 'daily' THEN
    interval_hours := 24;
  ELSIF NEW.frequency = 'custom' AND NEW.custom_interval_hours IS NOT NULL THEN
    interval_hours := NEW.custom_interval_hours;
  ELSE
    interval_hours := 24; -- Default to daily
  END IF;
  
  -- Calculate next_run_at based on last_run_at or now
  IF NEW.last_run_at IS NOT NULL THEN
    NEW.next_run_at := NEW.last_run_at + (interval_hours || ' hours')::INTERVAL;
  ELSIF NEW.next_run_at IS NULL THEN
    -- First time setup, schedule for next interval
    NEW.next_run_at := now() + (interval_hours || ' hours')::INTERVAL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Attach trigger to kiotviet_sync_schedules
CREATE TRIGGER calculate_next_run_trigger
BEFORE INSERT OR UPDATE OF frequency, custom_interval_hours, last_run_at
ON public.kiotviet_sync_schedules
FOR EACH ROW
EXECUTE FUNCTION public.calculate_next_run_time();

-- Trigger for updated_at
CREATE TRIGGER update_sync_schedules_updated_at
BEFORE UPDATE ON public.kiotviet_sync_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();