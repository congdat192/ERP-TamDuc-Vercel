# 🕐 KiotViet Auto Sync Scheduler

## Overview
This feature enables automatic scheduled synchronization of KiotViet data (products, categories, inventory) to the local database.

## Architecture

### Database Layer
- **Table**: `kiotviet_sync_schedules`
  - Stores sync configurations per credential
  - Auto-calculates `next_run_at` via trigger function
  - Supports hourly, daily, and custom interval frequencies

### Backend Layer
- **Edge Function**: `kiotviet-schedule-sync`
  - Queries enabled schedules that are due to run
  - Invokes `kiotviet-sync` for each due schedule
  - Updates `last_run_at` after successful sync
  - Runs via pg_cron every 5 minutes

- **pg_cron Job**: 
  - Job Name: `kiotviet-sync-scheduler`
  - Frequency: Every 5 minutes (`*/5 * * * *`)
  - Action: HTTP POST to `kiotviet-schedule-sync` edge function

### Frontend Layer
- **Component**: `KiotVietScheduleConfig`
  - Enable/disable toggle
  - Frequency selector (hourly/daily/custom)
  - Custom interval hours input (1-168)
  - Next sync countdown display
  - Last sync timestamp

## Setup Instructions

### 1. Database Migration
The migration has been automatically applied:
- ✅ `pg_cron` and `pg_net` extensions enabled
- ✅ `kiotviet_sync_schedules` table created
- ✅ Indexes added for performance
- ✅ RLS policies configured (admin only)
- ✅ Trigger function `calculate_next_run_time()` created

### 2. Setup pg_cron Job (ONE-TIME MANUAL STEP)
Run this SQL in Supabase SQL Editor:

```sql
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
```

### 3. Verify Cron Job is Running
```sql
-- Check if job exists
SELECT * FROM cron.job WHERE jobname = 'kiotviet-sync-scheduler';

-- Check recent job runs
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'kiotviet-sync-scheduler') 
ORDER BY start_time DESC 
LIMIT 10;
```

### 4. Edge Function Deployment
The edge function is automatically deployed:
- ✅ `supabase/functions/kiotviet-schedule-sync/index.ts`

## Usage

### Admin UI
1. Go to `/ERP/Setting/Integrations/KiotViet`
2. Connect your KiotViet credentials (if not already)
3. Find "Đồng Bộ Tự Động" card
4. Toggle "Bật đồng bộ tự động" to ON
5. Select frequency:
   - **Mỗi giờ**: Syncs every 1 hour
   - **Mỗi ngày**: Syncs every 24 hours
   - **Tùy chỉnh**: Enter custom hours (1-168)
6. Click "Lưu cấu hình"
7. View "Đồng bộ tiếp theo: Trong X giờ" countdown

### How It Works
1. **User configures schedule** → Saved to `kiotviet_sync_schedules`
2. **Trigger calculates** → `next_run_at` auto-updated based on frequency
3. **pg_cron checks** → Every 5 minutes, runs `kiotviet-schedule-sync` function
4. **Edge function queries** → Finds enabled schedules where `next_run_at <= now()`
5. **For each due schedule** → Invokes `kiotviet-sync` edge function
6. **After sync** → Updates `last_run_at`, trigger recalculates `next_run_at`

## Monitoring

### Check Sync Schedules
```sql
SELECT 
  s.*,
  c.retailer_name,
  (next_run_at <= now()) as is_due
FROM kiotviet_sync_schedules s
JOIN kiotviet_credentials c ON c.id = s.credential_id
WHERE s.enabled = true;
```

### Check Sync Logs
```sql
SELECT * FROM kiotviet_sync_logs 
ORDER BY started_at DESC 
LIMIT 20;
```

### Check Cron Job Status
```sql
-- Last 10 cron runs
SELECT 
  jobid, 
  start_time, 
  end_time,
  status,
  return_message
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'kiotviet-sync-scheduler')
ORDER BY start_time DESC
LIMIT 10;
```

## Troubleshooting

### Schedule Not Running
1. Check if pg_cron job exists:
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'kiotviet-sync-scheduler';
   ```
   - If empty → Run setup SQL from step 2

2. Check cron job execution logs:
   ```sql
   SELECT * FROM cron.job_run_details 
   WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'kiotviet-sync-scheduler')
   ORDER BY start_time DESC;
   ```
   - Look for errors in `return_message`

3. Check edge function logs in Supabase dashboard

### Sync Failing
1. Check `kiotviet_sync_logs` for error messages
2. Verify KiotViet credentials are valid
3. Check if token is expired (auto-refresh should handle this)
4. Test manual sync from UI

### Unschedule Job (if needed)
```sql
SELECT cron.unschedule('kiotviet-sync-scheduler');
```

## Security
- ✅ RLS enabled on `kiotviet_sync_schedules` (admin only)
- ✅ Edge function uses service role key (not exposed to client)
- ✅ KiotViet access tokens encrypted with AES-256
- ✅ pg_cron job uses anon key (safe for scheduled tasks)

## Future Enhancements
- [ ] Email notifications on sync failures
- [ ] Slack/Discord webhooks for sync status
- [ ] Multiple schedules per credential (different sync types)
- [ ] Sync progress bar in real-time
- [ ] Sync history analytics dashboard
