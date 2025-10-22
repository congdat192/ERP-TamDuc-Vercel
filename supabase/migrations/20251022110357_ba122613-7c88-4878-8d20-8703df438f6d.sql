-- Phase 1: Database Migration

-- Step 1.1: Drop old columns
ALTER TABLE lens_products 
DROP COLUMN IF EXISTS base_sku,
DROP COLUMN IF EXISTS product_type;

-- Step 1.2: Add sale_price and discount_percent
ALTER TABLE lens_products 
ADD COLUMN IF NOT EXISTS sale_price NUMERIC DEFAULT NULL,
ADD COLUMN IF NOT EXISTS discount_percent INTEGER DEFAULT NULL;

-- Update existing data: If is_promotion = true, simulate 20% discount
UPDATE lens_products 
SET sale_price = price * 0.8,
    discount_percent = 20
WHERE is_promotion = true AND sale_price IS NULL;

COMMENT ON COLUMN lens_products.price IS 'Giá niêm yết (giá gốc)';
COMMENT ON COLUMN lens_products.sale_price IS 'Giá giảm (nếu có khuyến mãi) - NULL nếu không KM';
COMMENT ON COLUMN lens_products.discount_percent IS '% giảm giá (tự động tính: (1 - sale_price/price) * 100)';

-- Step 1.3: Seed default attributes (truncate first to avoid duplicates)
TRUNCATE TABLE lens_product_attributes CASCADE;

INSERT INTO lens_product_attributes (name, slug, type, options, display_order, is_active) VALUES
('Chất liệu', 'material', 'select', '["Plastic", "Hi-Index", "Polycarbonate", "Trivex", "Glass"]', 1, true),
('Chiết suất', 'refractive_index', 'select', '["1.50", "1.56", "1.60", "1.67", "1.74"]', 2, true),
('Xuất xứ', 'origin', 'select', '["Đức", "Nhật Bản", "Pháp", "Hàn Quốc", "Việt Nam", "Thái Lan", "Trung Quốc"]', 3, true),
('Bảo hành', 'warranty_months', 'select', '["6", "12", "18", "24", "36"]', 4, true);