-- ============================================
-- STEP 1: Tạo 5 features mới cho Voucher module
-- ============================================

-- Feature cho Tab "Lịch sử"
INSERT INTO features (module_id, code, name, description, feature_type) VALUES
(7, 'view_voucher_history', 'Xem Lịch Sử Voucher', 'Xem lịch sử phát hành voucher', 'view');

-- 4 Features cho các sub-tabs trong "Cài đặt"
INSERT INTO features (module_id, code, name, description, feature_type) VALUES
(7, 'manage_voucher_images', 'Quản lý Ảnh Voucher', 'Upload/xóa template ảnh voucher', 'edit'),
(7, 'manage_voucher_templates', 'Quản lý Templates', 'Tạo/sửa/xóa voucher templates', 'edit'),
(7, 'manage_customer_types', 'Quản lý Loại Khách Hàng', 'Tạo/sửa/xóa loại khách hàng', 'edit'),
(7, 'manage_voucher_sources', 'Quản lý Nguồn Voucher', 'Tạo/sửa/xóa nguồn phát hành', 'edit');

-- ============================================
-- STEP 2: Tạo 2 roles mới
-- ============================================

-- AdminVoucher: Toàn quyền (level 2)
INSERT INTO roles (name, description, level, is_system) VALUES
('AdminVoucher', 'Quản trị viên Voucher - Toàn quyền', 2, false);

-- StaffVoucher: Chỉ Phát hành + Lịch sử (level 3)
INSERT INTO roles (name, description, level, is_system) VALUES
('StaffVoucher', 'Nhân viên Voucher - Chỉ phát hành và xem lịch sử', 3, false);

-- ============================================
-- STEP 3: Gán ALL 11 permissions cho AdminVoucher
-- ============================================

WITH admin_voucher_role AS (
  SELECT id FROM roles WHERE name = 'AdminVoucher'
),
voucher_features AS (
  SELECT id FROM features WHERE module_id = 7
)
INSERT INTO role_permissions (role_id, feature_id)
SELECT 
  (SELECT id FROM admin_voucher_role),
  f.id
FROM voucher_features f;

-- ============================================
-- STEP 4: Gán 6 permissions cho StaffVoucher
-- (CHỈ: CRUD + issue_vouchers + view_voucher_history)
-- (KHÔNG CÓ: 5 settings features)
-- ============================================

WITH staff_voucher_role AS (
  SELECT id FROM roles WHERE name = 'StaffVoucher'
)
INSERT INTO role_permissions (role_id, feature_id)
SELECT 
  (SELECT id FROM staff_voucher_role),
  f.id
FROM features f
WHERE f.module_id = 7
  AND f.code IN (
    'view_vouchers',
    'create_vouchers',
    'edit_vouchers',
    'delete_vouchers',
    'issue_vouchers',
    'view_voucher_history'
  );