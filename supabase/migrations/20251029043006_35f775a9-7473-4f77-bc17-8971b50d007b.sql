-- BƯỚC 1: Di chuyển Lens Features từ marketing (id: 8) → operations (id: 12)
-- Features: view_lens_catalog, manage_lens_products, manage_lens_brands, manage_lens_features, manage_lens_banners, manage_lens_admin
UPDATE features 
SET module_id = 12 
WHERE id IN (145, 146, 147, 148, 149, 150);

-- COMMENT: Sau migration này, MKT Manager (tiendatabv@gmail.com) sẽ tự động có 'operations' module
-- vì get_user_profile_simple() function tính toán modules dựa trên features
-- User có lens features → tự động được gán operations module