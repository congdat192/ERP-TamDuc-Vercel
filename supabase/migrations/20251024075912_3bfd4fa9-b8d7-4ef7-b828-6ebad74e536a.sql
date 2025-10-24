-- Drop lens_media_library table and related functions (Migration to Storage-only approach)

-- Drop trigger first
DROP TRIGGER IF EXISTS track_product_image_usage ON lens_products;

-- Drop functions
DROP FUNCTION IF EXISTS update_media_usage() CASCADE;
DROP FUNCTION IF EXISTS get_unused_media(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS can_manage_lens_media(UUID) CASCADE;

-- Drop table
DROP TABLE IF EXISTS lens_media_library CASCADE;