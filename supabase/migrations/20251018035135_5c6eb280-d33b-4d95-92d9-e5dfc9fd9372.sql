-- Remove business_id from roles table (single-tenant architecture)
ALTER TABLE roles DROP COLUMN IF EXISTS business_id CASCADE;

-- Ensure roles table is ready for single-tenant
-- Add any missing constraints if needed