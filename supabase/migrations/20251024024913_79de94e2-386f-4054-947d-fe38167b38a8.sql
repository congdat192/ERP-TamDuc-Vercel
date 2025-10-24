-- Standardize lens_brand values to match attribute options casing (uppercase)
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{lens_brand}',
  to_jsonb(UPPER(attributes->>'lens_brand'))
)
WHERE attributes ? 'lens_brand'
  AND attributes->>'lens_brand' IS NOT NULL;

-- Standardize tinh_nang_trong values to match attribute options casing (uppercase)
UPDATE lens_products
SET attributes = jsonb_set(
  attributes,
  '{tinh_nang_trong}',
  to_jsonb(UPPER(attributes->>'tinh_nang_trong'))
)
WHERE attributes ? 'tinh_nang_trong'
  AND attributes->>'tinh_nang_trong' IS NOT NULL;