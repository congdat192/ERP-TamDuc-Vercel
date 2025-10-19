-- ====================================
-- ESS IMPLEMENTATION: EMPLOYEE CHANGE REQUESTS & AUDIT TRAIL
-- ====================================

-- 1. Create employee_change_requests table
CREATE TABLE employee_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  
  -- Request metadata
  request_type text NOT NULL DEFAULT 'personal_info',
  
  -- Change data (JSONB for 7 fields + avatar)
  changes jsonb NOT NULL,
  
  -- Status tracking
  status text DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  
  -- Approval tracking
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  review_note text,
  
  -- Audit trail
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Indexes for performance
CREATE INDEX idx_change_requests_employee ON employee_change_requests(employee_id);
CREATE INDEX idx_change_requests_status ON employee_change_requests(status);
CREATE INDEX idx_change_requests_requested_at ON employee_change_requests(requested_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_change_requests_updated_at
BEFORE UPDATE ON employee_change_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE employee_change_requests IS 'Lưu yêu cầu thay đổi thông tin từ nhân viên';
COMMENT ON COLUMN employee_change_requests.changes IS 'JSONB chứa old/new values của các field được request thay đổi';

-- 2. Create employee_audit_log table
CREATE TABLE employee_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES employees(id) ON DELETE SET NULL,
  
  -- Change metadata
  action text NOT NULL,
  table_name text DEFAULT 'employees',
  
  -- Change details
  old_values jsonb,
  new_values jsonb,
  changed_fields text[],
  
  -- Who made the change
  changed_by uuid REFERENCES auth.users(id),
  change_source text,
  change_request_id uuid REFERENCES employee_change_requests(id),
  
  -- Timestamp
  changed_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_action CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  CONSTRAINT valid_change_source CHECK (change_source IN ('admin_update', 'change_request_approval', 'import', 'self_update'))
);

-- Indexes
CREATE INDEX idx_audit_log_employee ON employee_audit_log(employee_id);
CREATE INDEX idx_audit_log_changed_at ON employee_audit_log(changed_at DESC);
CREATE INDEX idx_audit_log_changed_by ON employee_audit_log(changed_by);
CREATE INDEX idx_audit_log_change_request ON employee_audit_log(change_request_id) WHERE change_request_id IS NOT NULL;

COMMENT ON TABLE employee_audit_log IS 'Audit trail cho mọi thay đổi trên bảng employees';

-- 3. Create auto-audit trigger function
CREATE OR REPLACE FUNCTION log_employee_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  changed_fields_arr text[];
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Calculate changed fields
    SELECT ARRAY_AGG(key)
    INTO changed_fields_arr
    FROM jsonb_each(to_jsonb(NEW))
    WHERE to_jsonb(NEW) -> key IS DISTINCT FROM to_jsonb(OLD) -> key
      AND key NOT IN ('updated_at');
    
    -- Only log if there are actual changes
    IF changed_fields_arr IS NOT NULL AND array_length(changed_fields_arr, 1) > 0 THEN
      INSERT INTO employee_audit_log (
        employee_id,
        action,
        old_values,
        new_values,
        changed_fields,
        changed_by,
        change_source
      )
      VALUES (
        NEW.id,
        'UPDATE',
        to_jsonb(OLD),
        to_jsonb(NEW),
        changed_fields_arr,
        auth.uid(),
        COALESCE(current_setting('app.change_source', true), 'admin_update')
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Attach trigger to employees table
CREATE TRIGGER log_employee_changes_trigger
AFTER UPDATE ON employees
FOR EACH ROW EXECUTE FUNCTION log_employee_changes();

COMMENT ON FUNCTION log_employee_changes IS 'Auto-log mọi thay đổi trên bảng employees vào audit_log';

-- 4. Enable RLS
ALTER TABLE employee_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_audit_log ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for employee_change_requests

-- Employees can view own requests
CREATE POLICY "Employees can view own change requests"
ON employee_change_requests FOR SELECT
USING (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);

-- Employees can create own requests
CREATE POLICY "Employees can create change requests"
ON employee_change_requests FOR INSERT
WITH CHECK (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);

-- Admins can view all requests
CREATE POLICY "Admins can view all change requests"
ON employee_change_requests FOR SELECT
USING (is_admin(auth.uid()));

-- Admins + HR Managers can update requests
CREATE POLICY "Admins and HR Managers can update change requests"
ON employee_change_requests FOR UPDATE
USING (
  is_admin(auth.uid()) OR 
  has_role(auth.uid(), 'HR Manager'::text)
);

-- 6. RLS Policies for employee_audit_log

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON employee_audit_log FOR SELECT
USING (is_admin(auth.uid()));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON employee_audit_log FOR INSERT
WITH CHECK (true);

-- 7. Create approve_change_requests feature
INSERT INTO features (module_id, code, name, description, feature_type)
VALUES (
  (SELECT id FROM modules WHERE code = 'hr'),
  'approve_change_requests',
  'Phê Duyệt Yêu Cầu Thay Đổi',
  'Cho phép phê duyệt/từ chối yêu cầu thay đổi thông tin từ nhân viên',
  'approve'
)
ON CONFLICT (code) DO NOTHING;

-- 8. Assign feature to HR Manager role
INSERT INTO role_permissions (role_id, feature_id)
SELECT 
  12, -- HR Manager role_id
  f.id
FROM features f
WHERE f.code = 'approve_change_requests'
ON CONFLICT DO NOTHING;