-- Step 1: Insert features for Lens Catalog module
INSERT INTO features (module_id, code, name, description, feature_type, created_at)
SELECT 
  m.id,
  vals.code,
  vals.name,
  vals.description,
  vals.feature_type,
  now()
FROM modules m
CROSS JOIN (
  VALUES 
    ('view_lens_catalog', 'Xem Lens Catalog', 'Quyền xem danh sách sản phẩm tròng kính', 'view'),
    ('manage_lens_products', 'Quản lý Sản phẩm Tròng', 'Quyền tạo/sửa/xóa sản phẩm tròng kính', 'edit'),
    ('manage_lens_brands', 'Quản lý Thương hiệu Tròng', 'Quyền quản lý thương hiệu tròng kính', 'edit'),
    ('manage_lens_features', 'Quản lý Đặc tính Tròng', 'Quyền quản lý các đặc tính tròng kính', 'edit'),
    ('manage_lens_banners', 'Quản lý Banner Tròng', 'Quyền quản lý banner quảng cáo tròng kính', 'edit')
) AS vals(code, name, description, feature_type)
WHERE m.code = 'marketing'
ON CONFLICT (code) DO NOTHING;

-- Step 2: Fix role level for "MKT manager" 
UPDATE roles 
SET level = 3 
WHERE id = 14 AND name = 'MKT manager' AND level IS NULL;