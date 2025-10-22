-- Step 1: Migrate existing single image_url to array format
ALTER TABLE lens_products 
ALTER COLUMN image_url TYPE JSONB USING 
  CASE 
    WHEN image_url IS NULL THEN '[]'::jsonb
    WHEN image_url = '' THEN '[]'::jsonb
    ELSE jsonb_build_array(image_url)
  END;

-- Step 2: Rename column for clarity
ALTER TABLE lens_products 
RENAME COLUMN image_url TO image_urls;

-- Step 3: Set default value
ALTER TABLE lens_products 
ALTER COLUMN image_urls SET DEFAULT '[]'::jsonb;

-- Step 4: Add comment
COMMENT ON COLUMN lens_products.image_urls IS 'Array of image URLs in JSONB format - first image is the primary/thumbnail image';