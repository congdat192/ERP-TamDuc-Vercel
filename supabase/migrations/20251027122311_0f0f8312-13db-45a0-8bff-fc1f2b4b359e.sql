-- =============================================
-- Migration: Create Operations Module and Features
-- Purpose: Enable role-based permissions for Lens Catalog Admin
-- =============================================

-- Step 1: Insert "operations" module
INSERT INTO public.modules (code, name, description, icon, display_order, is_active)
VALUES (
  'operations',
  'Vận Hành',
  'Quản lý vận hành hệ thống: Lens Catalog, cấu hình sản phẩm',
  'Wrench',
  8,
  true
)
ON CONFLICT (code) DO NOTHING;

-- Step 2: Get module_id for operations and insert features
DO $$
DECLARE
  operations_module_id INT;
BEGIN
  SELECT id INTO operations_module_id FROM public.modules WHERE code = 'operations';

  -- Step 3: Insert features for operations module
  INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  
  -- Base access permission
  (operations_module_id, 'view_lens_admin', 'Xem Lens Admin', 'Truy cập module Lens Catalog Admin', 'view'),
  
  -- Super admin permission (backward compatible)
  (operations_module_id, 'manage_lens_admin', 'Quản lý toàn bộ Lens Admin', 'Quyền quản trị viên: Truy cập và quản lý tất cả chức năng Lens Admin', 'manage'),
  
  -- Tab 1: Products
  (operations_module_id, 'manage_lens_products', 'Quản lý sản phẩm Lens', 'Thêm/sửa/xóa sản phẩm tròng kính', 'manage'),
  (operations_module_id, 'import_lens_products', 'Nhập Excel sản phẩm', 'Import danh sách sản phẩm từ file Excel', 'create'),
  (operations_module_id, 'export_lens_products', 'Xuất Excel sản phẩm', 'Export danh sách sản phẩm ra file Excel', 'view'),
  
  -- Tab 2: Attributes
  (operations_module_id, 'manage_lens_attributes', 'Quản lý thuộc tính sản phẩm', 'Quản lý các thuộc tính như chỉ số, tính năng, loại tròng', 'manage'),
  
  -- Tab 3: Supply Tiers
  (operations_module_id, 'manage_supply_tiers', 'Quản lý tầng cung ứng', 'Cấu hình giá theo tầng cung ứng cho từng sản phẩm', 'manage'),
  
  -- Tab 4: Use Cases
  (operations_module_id, 'manage_lens_usecases', 'Quản lý Use Cases', 'Chấm điểm và cấu hình use cases cho sản phẩm', 'manage'),
  
  -- Tab 5: Recommendations
  (operations_module_id, 'manage_lens_recommendations', 'Quản lý nhóm tư vấn', 'Tạo và quản lý recommendation groups', 'manage'),
  
  -- Tab 6: Banners
  (operations_module_id, 'manage_lens_banners', 'Quản lý Banner', 'Thêm/sửa/xóa banner quảng cáo Lens', 'manage'),
  
  -- Tab 7: PDF Catalogs
  (operations_module_id, 'manage_lens_catalogs', 'Quản lý PDF Catalogs', 'Upload và quản lý catalogs của nhà cung cấp', 'manage')
  
  ON CONFLICT (code) DO NOTHING;

END $$;

-- Step 4: Add comment for documentation
COMMENT ON TABLE public.modules IS 'ERP modules including operations for system operations management';
COMMENT ON TABLE public.features IS 'Granular permissions for each module. Operations module has 11 features for Lens Admin.';