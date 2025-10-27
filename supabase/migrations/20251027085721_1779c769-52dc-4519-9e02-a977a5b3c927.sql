-- ============================================
-- FIX: Change campaign_id from TEXT to BIGINT
-- Required for numeric campaign IDs from external API
-- ============================================

-- Step 1: Truncate existing data (as approved by user)
TRUNCATE TABLE voucher_campaigns CASCADE;

-- Step 2: Drop old constraint
ALTER TABLE voucher_campaigns DROP CONSTRAINT IF EXISTS voucher_campaigns_campaign_id_key;

-- Step 3: Change column type from TEXT to BIGINT
ALTER TABLE voucher_campaigns 
  ALTER COLUMN campaign_id TYPE BIGINT USING campaign_id::BIGINT;

-- Step 4: Re-add UNIQUE constraint
ALTER TABLE voucher_campaigns 
  ADD CONSTRAINT voucher_campaigns_campaign_id_key UNIQUE (campaign_id);

-- Step 5: Add comment for clarity
COMMENT ON COLUMN voucher_campaigns.campaign_id IS 'Numeric ID from external API (c.id), not c.code';

-- Verify the change
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'voucher_campaigns' 
    AND column_name = 'campaign_id' 
    AND data_type = 'bigint'
  ) THEN
    RAISE NOTICE 'SUCCESS: campaign_id column type changed to BIGINT';
  ELSE
    RAISE EXCEPTION 'FAILED: campaign_id column type is not BIGINT';
  END IF;
END $$;