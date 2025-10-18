-- Add new columns for address and emergency contact
ALTER TABLE employees 
  ADD COLUMN current_address text,
  ADD COLUMN emergency_contact_relationship text CHECK (
    emergency_contact_relationship IN ('Cha', 'Mẹ', 'Vợ', 'Chồng', 'Anh', 'Chị', 'Em', 'Khác')
  ),
  ADD COLUMN emergency_contact_name text,
  ADD COLUMN emergency_contact_phone text;

-- Add comments for documentation
COMMENT ON COLUMN employees.current_address IS 'Địa chỉ nơi ở hiện tại của nhân viên';
COMMENT ON COLUMN employees.emergency_contact_relationship IS 'Mối quan hệ với người liên hệ khẩn cấp';
COMMENT ON COLUMN employees.emergency_contact_name IS 'Tên người liên hệ khẩn cấp';
COMMENT ON COLUMN employees.emergency_contact_phone IS 'Số điện thoại người liên hệ khẩn cấp';