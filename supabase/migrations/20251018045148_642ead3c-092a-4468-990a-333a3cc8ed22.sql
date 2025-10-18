-- Insert comprehensive features for all 11 modules

-- Module 2: Khách Hàng (Customers)
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(2, 'view_customers', 'Xem danh sách khách hàng', 'Xem và tìm kiếm thông tin khách hàng', 'view'),
(2, 'create_customers', 'Tạo khách hàng mới', 'Thêm khách hàng mới vào hệ thống', 'create'),
(2, 'edit_customers', 'Chỉnh sửa khách hàng', 'Cập nhật thông tin khách hàng', 'edit'),
(2, 'delete_customers', 'Xóa khách hàng', 'Xóa khách hàng khỏi hệ thống', 'delete'),
(2, 'export_customers', 'Xuất dữ liệu khách hàng', 'Xuất danh sách khách hàng ra file Excel/CSV', 'view');

-- Module 3: Hóa Đơn (Sales)
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(3, 'view_invoices', 'Xem hóa đơn', 'Xem và tìm kiếm hóa đơn bán hàng', 'view'),
(3, 'create_invoices', 'Tạo hóa đơn', 'Tạo hóa đơn bán hàng mới', 'create'),
(3, 'edit_invoices', 'Sửa hóa đơn', 'Chỉnh sửa thông tin hóa đơn', 'edit'),
(3, 'delete_invoices', 'Xóa hóa đơn', 'Xóa hóa đơn khỏi hệ thống', 'delete'),
(3, 'approve_invoices', 'Duyệt hóa đơn', 'Phê duyệt và xác nhận hóa đơn', 'edit'),
(3, 'export_invoices', 'Xuất báo cáo hóa đơn', 'Xuất dữ liệu hóa đơn ra file', 'view');

-- Module 4: Kho Hàng (Inventory)
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(4, 'view_inventory', 'Xem kho hàng', 'Xem danh sách sản phẩm và tồn kho', 'view'),
(4, 'create_products', 'Tạo sản phẩm', 'Thêm sản phẩm mới vào kho', 'create'),
(4, 'edit_products', 'Sửa sản phẩm', 'Chỉnh sửa thông tin sản phẩm', 'edit'),
(4, 'delete_products', 'Xóa sản phẩm', 'Xóa sản phẩm khỏi kho', 'delete'),
(4, 'manage_stock', 'Quản lý tồn kho', 'Nhập/xuất kho và điều chỉnh số lượng', 'edit'),
(4, 'export_inventory', 'Xuất báo cáo kho', 'Xuất báo cáo tồn kho ra file', 'view');

-- Module 5: Kế Toán (Accounting)
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(5, 'view_accounting', 'Xem sổ sách kế toán', 'Xem các chứng từ và bút toán', 'view'),
(5, 'create_entries', 'Tạo chứng từ', 'Tạo chứng từ kế toán mới', 'create'),
(5, 'edit_entries', 'Sửa chứng từ', 'Chỉnh sửa chứng từ kế toán', 'edit'),
(5, 'delete_entries', 'Xóa chứng từ', 'Xóa chứng từ kế toán', 'delete'),
(5, 'view_reports', 'Xem báo cáo tài chính', 'Xem các báo cáo tài chính tổng hợp', 'view'),
(5, 'close_period', 'Khóa sổ kế toán', 'Khóa sổ theo kỳ kế toán', 'edit');

-- Module 6: Nhân Sự (HR)
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(6, 'view_employees', 'Xem nhân viên', 'Xem danh sách và hồ sơ nhân viên', 'view'),
(6, 'create_employees', 'Tạo hồ sơ nhân viên', 'Thêm nhân viên mới vào hệ thống', 'create'),
(6, 'edit_employees', 'Sửa hồ sơ nhân viên', 'Cập nhật thông tin nhân viên', 'edit'),
(6, 'delete_employees', 'Xóa nhân viên', 'Xóa nhân viên khỏi hệ thống', 'delete'),
(6, 'manage_payroll', 'Quản lý lương', 'Tính lương và quản lý bảng lương', 'edit'),
(6, 'view_attendance', 'Xem chấm công', 'Xem và quản lý chấm công nhân viên', 'view');

-- Module 7: Voucher
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(7, 'view_vouchers', 'Xem voucher', 'Xem danh sách và chi tiết voucher', 'view'),
(7, 'create_vouchers', 'Tạo voucher', 'Tạo mã voucher mới', 'create'),
(7, 'edit_vouchers', 'Sửa voucher', 'Chỉnh sửa thông tin voucher', 'edit'),
(7, 'delete_vouchers', 'Xóa voucher', 'Xóa voucher khỏi hệ thống', 'delete'),
(7, 'issue_vouchers', 'Phát hành voucher', 'Kích hoạt và phát hành voucher cho khách hàng', 'edit'),
(7, 'manage_campaigns', 'Quản lý chiến dịch', 'Tạo và quản lý chiến dịch voucher', 'edit');

-- Module 8: Marketing
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(8, 'view_campaigns', 'Xem chiến dịch marketing', 'Xem danh sách chiến dịch', 'view'),
(8, 'create_campaigns', 'Tạo chiến dịch', 'Tạo chiến dịch marketing mới', 'create'),
(8, 'edit_campaigns', 'Sửa chiến dịch', 'Chỉnh sửa chiến dịch marketing', 'edit'),
(8, 'delete_campaigns', 'Xóa chiến dịch', 'Xóa chiến dịch marketing', 'delete'),
(8, 'send_messages', 'Gửi tin nhắn', 'Gửi tin nhắn marketing đến khách hàng', 'edit'),
(8, 'view_analytics', 'Xem phân tích marketing', 'Xem báo cáo hiệu quả chiến dịch', 'view');

-- Module 9: Affiliate
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(9, 'view_affiliates', 'Xem đại lý F0', 'Xem danh sách và thông tin đại lý', 'view'),
(9, 'create_affiliates', 'Tạo đại lý F0', 'Thêm đại lý mới vào hệ thống', 'create'),
(9, 'edit_affiliates', 'Sửa đại lý F0', 'Chỉnh sửa thông tin đại lý', 'edit'),
(9, 'delete_affiliates', 'Xóa đại lý F0', 'Xóa đại lý khỏi hệ thống', 'delete'),
(9, 'approve_withdrawals', 'Duyệt rút tiền', 'Phê duyệt yêu cầu rút tiền của đại lý', 'edit'),
(9, 'view_commissions', 'Xem hoa hồng', 'Xem báo cáo hoa hồng đại lý', 'view');

-- Module 10: Cài Đặt (System Settings)
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(10, 'view_settings', 'Xem cài đặt hệ thống', 'Xem các cấu hình hệ thống', 'view'),
(10, 'edit_general_settings', 'Sửa cài đặt chung', 'Chỉnh sửa cấu hình chung của hệ thống', 'edit'),
(10, 'edit_security_settings', 'Cài đặt bảo mật', 'Cấu hình bảo mật và xác thực', 'edit'),
(10, 'manage_integrations', 'Quản lý tích hợp', 'Cấu hình tích hợp với hệ thống bên ngoài', 'edit'),
(10, 'view_audit_logs', 'Xem nhật ký hệ thống', 'Xem lịch sử hoạt động và audit logs', 'view'),
(10, 'backup_restore', 'Sao lưu và phục hồi', 'Thực hiện sao lưu và phục hồi dữ liệu', 'edit');

-- Module 11: Người Dùng (User Management)
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
(11, 'view_users', 'Xem người dùng', 'Xem danh sách người dùng hệ thống', 'view'),
(11, 'create_users', 'Tạo tài khoản', 'Tạo tài khoản người dùng mới', 'create'),
(11, 'edit_users', 'Sửa tài khoản', 'Chỉnh sửa thông tin người dùng', 'edit'),
(11, 'delete_users', 'Xóa tài khoản', 'Xóa tài khoản người dùng', 'delete'),
(11, 'manage_roles', 'Quản lý vai trò', 'Tạo và chỉnh sửa vai trò hệ thống', 'edit'),
(11, 'assign_permissions', 'Phân quyền', 'Gán quyền và vai trò cho người dùng', 'edit');