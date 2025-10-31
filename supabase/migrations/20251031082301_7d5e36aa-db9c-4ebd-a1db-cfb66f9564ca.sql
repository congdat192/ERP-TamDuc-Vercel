-- Add encrypted_client_secret column to kiotviet_credentials for auto-refresh
ALTER TABLE kiotviet_credentials 
ADD COLUMN IF NOT EXISTS encrypted_client_secret TEXT;