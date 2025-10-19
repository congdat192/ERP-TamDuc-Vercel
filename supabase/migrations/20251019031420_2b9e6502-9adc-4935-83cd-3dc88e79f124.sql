-- PHASE 1 & 2: Thêm Features và Roles cho HR Module

-- 1. Thêm 23 features mới cho HR module (module_id = 6)
INSERT INTO features (module_id, code, name, description, feature_type) VALUES
-- Dashboard & Analytics
(6, 'view_hr_dashboard', 'Xem Dashboard HR', 'Xem tổng quan thống kê nhân sự', 'view'),
(6, 'view_hr_analytics', 'Xem Phân Tích HR', 'Xem báo cáo và biểu đồ phân tích', 'view'),
(6, 'export_hr_data', 'Xuất Dữ Liệu HR', 'Xuất Excel/PDF các báo cáo nhân sự', 'view'),

-- Time & Attendance
(6, 'manage_attendance', 'Quản Lý Chấm Công', 'Sửa/xóa bản ghi chấm công', 'edit'),
(6, 'approve_timesheets', 'Duyệt Bảng Công', 'Phê duyệt bảng công tháng', 'edit'),

-- Payroll
(6, 'view_payroll', 'Xem Bảng Lương', 'Xem bảng lương nhân viên', 'view'),
(6, 'calculate_salary', 'Tính Lương', 'Chạy tính lương cho nhân viên', 'edit'),
(6, 'approve_payroll', 'Duyệt Bảng Lương', 'Phê duyệt bảng lương trước khi chi trả', 'edit'),
(6, 'view_salary_details', 'Xem Chi Tiết Lương', 'Xem chi tiết lương từng nhân viên', 'view'),

-- Recruitment
(6, 'view_recruitment', 'Xem Tuyển Dụng', 'Xem danh sách vị trí tuyển dụng', 'view'),
(6, 'create_jobs', 'Tạo Tin Tuyển Dụng', 'Đăng tin tuyển dụng mới', 'create'),
(6, 'manage_candidates', 'Quản Lý Ứng Viên', 'Sửa/xóa hồ sơ ứng viên', 'edit'),
(6, 'review_candidates', 'Đánh Giá Ứng Viên', 'Phỏng vấn và đánh giá ứng viên', 'edit'),

-- Training
(6, 'view_training', 'Xem Đào Tạo', 'Xem danh sách khóa đào tạo', 'view'),
(6, 'create_training', 'Tạo Khóa Đào Tạo', 'Tạo khóa đào tạo mới', 'create'),
(6, 'manage_training', 'Quản Lý Đào Tạo', 'Sửa/xóa khóa đào tạo', 'edit'),
(6, 'assign_training', 'Phân Công Đào Tạo', 'Gán nhân viên vào khóa đào tạo', 'edit'),

-- Performance (OKR/KPI)
(6, 'view_performance', 'Xem Đánh Giá', 'Xem đánh giá hiệu suất', 'view'),
(6, 'set_okr', 'Thiết Lập OKR/KPI', 'Thiết lập mục tiêu cho nhân viên', 'create'),
(6, 'review_performance', 'Đánh Giá Hiệu Suất', 'Đánh giá và phê duyệt KPI', 'edit'),
(6, 'view_360_feedback', 'Xem Đánh Giá 360°', 'Xem phản hồi 360° của nhân viên', 'view');

-- 2. Tạo vai trò HR Staff
INSERT INTO roles (name, description, is_system) 
VALUES ('HR Staff', 'Nhân viên HR - quyền hạn chế', false);

-- 3. Gán permissions cho HR Staff (33 permissions - không bao gồm delete/approve)
INSERT INTO role_permissions (role_id, feature_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'HR Staff'),
  f.id 
FROM features f
WHERE f.module_id = 6 
AND f.code IN (
  'view_hr_dashboard',
  'view_hr_analytics',
  'view_employees',
  'create_employees',
  'edit_employees',
  'view_attendance',
  'manage_attendance',
  'view_payroll',
  'view_salary_details',
  'view_recruitment',
  'create_jobs',
  'manage_candidates',
  'view_training',
  'create_training',
  'manage_training',
  'assign_training',
  'view_performance',
  'set_okr',
  'view_360_feedback',
  'view_admin_documents',
  'create_admin_documents',
  'view_benefits',
  'create_benefits',
  'edit_benefits',
  'view_rewards',
  'create_rewards',
  'edit_rewards',
  'view_discipline',
  'manage_discipline'
);

-- 4. Cập nhật HR Manager với toàn bộ permissions mới (thêm 23 permissions)
INSERT INTO role_permissions (role_id, feature_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'HR Manager'),
  f.id 
FROM features f
WHERE f.module_id = 6 
AND f.code IN (
  'view_hr_dashboard', 
  'view_hr_analytics', 
  'export_hr_data',
  'manage_attendance', 
  'approve_timesheets',
  'view_payroll', 
  'calculate_salary', 
  'approve_payroll', 
  'view_salary_details',
  'view_recruitment', 
  'create_jobs', 
  'manage_candidates', 
  'review_candidates',
  'view_training', 
  'create_training', 
  'manage_training', 
  'assign_training',
  'view_performance', 
  'set_okr', 
  'review_performance', 
  'view_360_feedback',
  'delete_benefits',
  'approve_rewards',
  'delete_rewards'
)
ON CONFLICT DO NOTHING;