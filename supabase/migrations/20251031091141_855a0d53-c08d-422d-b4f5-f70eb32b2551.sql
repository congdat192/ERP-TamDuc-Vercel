-- ============================================
-- PHASE 1: Add parent_id and display_order columns
-- ============================================

-- Add parent_id column for parent-child hierarchy
ALTER TABLE features 
ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES features(id) ON DELETE CASCADE;

-- Add display_order column for sorting
ALTER TABLE features 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_features_parent_id ON features(parent_id);

-- Update feature_type to be consistent
UPDATE features SET feature_type = 'view' WHERE code LIKE 'view_%';
UPDATE features SET feature_type = 'create' WHERE code LIKE 'create_%' OR code LIKE 'issue_%';
UPDATE features SET feature_type = 'edit' WHERE code LIKE 'edit_%';
UPDATE features SET feature_type = 'delete' WHERE code LIKE 'delete_%';
UPDATE features SET feature_type = 'manage' WHERE feature_type IS NULL;

-- ============================================
-- PHASE 2: Create Parent Features for Voucher Module
-- ============================================

-- Get voucher module id (should be 7)
DO $$
DECLARE
  voucher_module_id INTEGER;
  parent_basic_id INTEGER;
  parent_issuance_id INTEGER;
  parent_reissue_id INTEGER;
  parent_settings_id INTEGER;
BEGIN
  -- Get voucher module ID
  SELECT id INTO voucher_module_id FROM modules WHERE code = 'voucher';
  
  IF voucher_module_id IS NULL THEN
    RAISE EXCEPTION 'Voucher module not found';
  END IF;

  -- Create Parent Features
  INSERT INTO features (module_id, code, name, description, feature_type, display_order, parent_id)
  VALUES 
    (voucher_module_id, 'voucher_basic', 'Voucher Cơ Bản', 'Quản lý voucher cơ bản', 'parent', 1, NULL),
    (voucher_module_id, 'voucher_issuance', 'Phát Hành', 'Phát hành voucher cho khách hàng', 'parent', 2, NULL),
    (voucher_module_id, 'voucher_reissue', 'Cấp Lại', 'Cấp lại voucher', 'parent', 3, NULL),
    (voucher_module_id, 'voucher_settings', 'Cài Đặt', 'Cấu hình voucher', 'parent', 4, NULL)
  ON CONFLICT (code) DO NOTHING;

  -- Get parent IDs
  SELECT id INTO parent_basic_id FROM features WHERE code = 'voucher_basic';
  SELECT id INTO parent_issuance_id FROM features WHERE code = 'voucher_issuance';
  SELECT id INTO parent_reissue_id FROM features WHERE code = 'voucher_reissue';
  SELECT id INTO parent_settings_id FROM features WHERE code = 'voucher_settings';

  -- Update existing Voucher Basic features
  UPDATE features SET parent_id = parent_basic_id, display_order = 1, feature_type = 'view'
  WHERE code = 'view_vouchers' AND module_id = voucher_module_id;
  
  UPDATE features SET parent_id = parent_basic_id, display_order = 2, feature_type = 'create'
  WHERE code = 'create_vouchers' AND module_id = voucher_module_id;
  
  UPDATE features SET parent_id = parent_basic_id, display_order = 3, feature_type = 'edit'
  WHERE code = 'edit_vouchers' AND module_id = voucher_module_id;
  
  UPDATE features SET parent_id = parent_basic_id, display_order = 4, feature_type = 'delete'
  WHERE code = 'delete_vouchers' AND module_id = voucher_module_id;

  -- Update Issuance features
  UPDATE features SET parent_id = parent_issuance_id, display_order = 1, feature_type = 'view'
  WHERE code = 'view_voucher_history' AND module_id = voucher_module_id;
  
  UPDATE features SET parent_id = parent_issuance_id, display_order = 2, feature_type = 'create'
  WHERE code = 'issue_vouchers' AND module_id = voucher_module_id;

  -- Add Reissue features
  INSERT INTO features (module_id, code, name, description, feature_type, display_order, parent_id, created_at)
  VALUES 
    (voucher_module_id, 'view_reissue_vouchers', 'Xem', 'Xem form cấp lại', 'view', 1, parent_reissue_id, now()),
    (voucher_module_id, 'create_reissue_vouchers', 'Cấp lại', 'Thực hiện cấp lại voucher', 'create', 2, parent_reissue_id, now())
  ON CONFLICT (code) DO NOTHING;

  -- Update Settings features (existing manage_* features)
  UPDATE features SET parent_id = parent_settings_id, display_order = 1
  WHERE code = 'manage_campaigns' AND module_id = voucher_module_id;
  
  UPDATE features SET parent_id = parent_settings_id, display_order = 2
  WHERE code = 'manage_voucher_images' AND module_id = voucher_module_id;
  
  UPDATE features SET parent_id = parent_settings_id, display_order = 3
  WHERE code = 'manage_voucher_templates' AND module_id = voucher_module_id;
  
  UPDATE features SET parent_id = parent_settings_id, display_order = 4
  WHERE code = 'manage_customer_types' AND module_id = voucher_module_id;
  
  UPDATE features SET parent_id = parent_settings_id, display_order = 5
  WHERE code = 'manage_voucher_sources' AND module_id = voucher_module_id;

  RAISE NOTICE 'Successfully created parent-child feature structure for Voucher module';
END $$;