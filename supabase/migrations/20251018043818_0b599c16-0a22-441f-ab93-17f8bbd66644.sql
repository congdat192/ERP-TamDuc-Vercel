-- Phase 1: Delete all existing data
DELETE FROM public.role_permissions;
DELETE FROM public.user_roles;
DELETE FROM public.roles;
DELETE FROM public.features;
DELETE FROM public.modules;

-- Phase 2.1: Create single Owner role
INSERT INTO public.roles (id, name, description, is_system)
VALUES (1, 'Owner', 'Chủ sở hữu - Toàn quyền trên hệ thống', true);

-- Phase 2.2: Create 11 basic modules
INSERT INTO public.modules (id, code, name, description, icon, display_order, is_active)
VALUES 
(1, 'dashboard', 'Tổng Quan', 'Dashboard và thống kê', 'LayoutDashboard', 1, true),
(2, 'customers', 'Khách Hàng', 'Quản lý khách hàng', 'Users', 2, true),
(3, 'sales', 'Hóa Đơn', 'Quản lý bán hàng', 'TrendingUp', 3, true),
(4, 'inventory', 'Kho Hàng', 'Quản lý sản phẩm', 'Package', 4, true),
(5, 'accounting', 'Kế Toán', 'Quản lý tài chính', 'Calculator', 5, true),
(6, 'hr', 'Nhân Sự', 'Quản lý nhân viên', 'UserCheck', 6, true),
(7, 'voucher', 'Voucher', 'Quản lý voucher', 'Ticket', 7, true),
(8, 'marketing', 'Marketing', 'Chiến dịch marketing', 'Megaphone', 8, true),
(9, 'affiliate', 'Affiliate', 'Chương trình giới thiệu', 'UserPlus', 9, true),
(10, 'system-settings', 'Cài Đặt', 'Cài đặt hệ thống', 'Settings', 10, true),
(11, 'user-management', 'Người Dùng', 'Quản lý người dùng', 'Shield', 11, true);

-- Phase 2.3: Create single full_access feature
INSERT INTO public.features (id, module_id, code, name, description, feature_type)
VALUES (1, 1, 'full_access', 'Toàn quyền', 'Truy cập và quản lý toàn bộ hệ thống', 'manage');

-- Phase 2.4: Assign full_access to Owner role
INSERT INTO public.role_permissions (role_id, feature_id)
VALUES (1, 1);

-- Phase 2.5: Assign Owner role to congdat192@gmail.com
INSERT INTO public.user_roles (user_id, role_id)
VALUES ('34eedf96-71b2-4322-8073-95cab9d7ff93', 1);