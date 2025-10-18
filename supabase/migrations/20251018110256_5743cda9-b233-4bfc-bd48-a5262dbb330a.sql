-- ============================================
-- PHASE 1: ADMINISTRATIVE DOCUMENTS MODULE
-- ============================================

-- 1. Create administrative_documents table
CREATE TABLE IF NOT EXISTS public.administrative_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_type text NOT NULL CHECK (doc_type IN ('decision', 'notice', 'contract', 'form')),
  doc_no text UNIQUE,
  subject text NOT NULL,
  content text NOT NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  effective_date date,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'published', 'archived')),
  file_path text,
  file_name text,
  file_size integer,
  mime_type text,
  employee_id uuid REFERENCES public.employees(id) ON DELETE SET NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_admin_docs_doc_type ON public.administrative_documents(doc_type);
CREATE INDEX idx_admin_docs_status ON public.administrative_documents(status);
CREATE INDEX idx_admin_docs_employee_id ON public.administrative_documents(employee_id);
CREATE INDEX idx_admin_docs_created_by ON public.administrative_documents(created_by);
CREATE INDEX idx_admin_docs_created_at ON public.administrative_documents(created_at);

-- 2. Create document_versions table (Version History)
CREATE TABLE IF NOT EXISTS public.document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES public.administrative_documents(id) ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  content text NOT NULL,
  file_path text,
  file_name text,
  file_size integer,
  mime_type text,
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
  change_note text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(document_id, version_number)
);

CREATE INDEX idx_doc_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_doc_versions_created_at ON public.document_versions(created_at);

-- 3. Create document_sequences table (Auto Numbering)
CREATE TABLE IF NOT EXISTS public.document_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_type text NOT NULL CHECK (doc_type IN ('decision', 'notice', 'contract', 'form')),
  year integer NOT NULL,
  last_number integer NOT NULL DEFAULT 0,
  prefix text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(doc_type, year)
);

-- Seed document sequences for current year
INSERT INTO public.document_sequences (doc_type, year, last_number, prefix)
VALUES 
  ('decision', EXTRACT(YEAR FROM CURRENT_DATE)::integer, 0, 'QĐ'),
  ('notice', EXTRACT(YEAR FROM CURRENT_DATE)::integer, 0, 'TB'),
  ('contract', EXTRACT(YEAR FROM CURRENT_DATE)::integer, 0, 'HĐ'),
  ('form', EXTRACT(YEAR FROM CURRENT_DATE)::integer, 0, 'BM')
ON CONFLICT (doc_type, year) DO NOTHING;

-- 4. Create document_templates table
CREATE TABLE IF NOT EXISTS public.document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  doc_type text NOT NULL CHECK (doc_type IN ('decision', 'notice', 'contract', 'form')),
  template_content text NOT NULL,
  variables jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_doc_templates_doc_type ON public.document_templates(doc_type);
CREATE INDEX idx_doc_templates_is_active ON public.document_templates(is_active);

-- Seed default templates
INSERT INTO public.document_templates (name, doc_type, template_content, variables, is_active)
VALUES 
  (
    'Mẫu Quyết Định Bổ Nhiệm',
    'decision',
    E'QUYẾT ĐỊNH\nVề việc bổ nhiệm {{position}}\n\nGIÁM ĐỐC CÔNG TY\n\nCăn cứ Luật Lao động năm 2019;\nCăn cứ Điều lệ tổ chức và hoạt động của Công ty;\nXét đề nghị của Phòng Nhân sự;\n\nQUYẾT ĐỊNH:\n\nĐiều 1. Bổ nhiệm Ông/Bà: {{employee_name}}\nMã nhân viên: {{employee_code}}\nNgày sinh: {{birth_date}}\nVào vị trí: {{position}}\nThuộc Phòng/Ban: {{department}}\n\nĐiều 2. Quyết định này có hiệu lực kể từ ngày {{effective_date}}\n\nĐiều 3. Các Ông/Bà liên quan chịu trách nhiệm thi hành Quyết định này.',
    '{"employee_name": "Tên nhân viên", "employee_code": "Mã NV", "position": "Chức vụ", "department": "Phòng ban", "birth_date": "Ngày sinh", "effective_date": "Ngày hiệu lực", "current_date": "Ngày hiện tại"}'::jsonb,
    true
  ),
  (
    'Mẫu Thông Báo Nghỉ Lễ',
    'notice',
    E'THÔNG BÁO\nVề việc nghỉ lễ {{holiday_name}}\n\nKính gửi: Toàn thể Cán bộ nhân viên Công ty\n\nCăn cứ Bộ luật Lao động năm 2019;\nCăn cứ Nghị định về ngày nghỉ lễ, tết trong năm;\n\nCông ty thông báo lịch nghỉ lễ {{holiday_name}} như sau:\n\nThời gian nghỉ: Từ ngày {{start_date}} đến ngày {{end_date}}\n\nCông ty thông báo để toàn thể cán bộ nhân viên biết và sắp xếp công việc.',
    '{"holiday_name": "Tên ngày lễ", "start_date": "Ngày bắt đầu", "end_date": "Ngày kết thúc", "current_date": "Ngày hiện tại"}'::jsonb,
    true
  ),
  (
    'Mẫu Hợp Đồng Lao Động',
    'contract',
    E'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nHỢP ĐỒNG LAO ĐỘNG\nSố: {{doc_no}}\n\nHôm nay, ngày {{current_date}}, tại Công ty, chúng tôi gồm:\n\nBÊN A: CÔNG TY (Người sử dụng lao động)\nĐại diện: Giám đốc\n\nBÊN B: NGƯỜI LAO ĐỘNG\nHọ và tên: {{employee_name}}\nNgày sinh: {{birth_date}}\nSố CCCD: {{id_number}}\nĐịa chỉ thường trú: {{address}}\n\nHai bên thỏa thuận ký kết Hợp đồng lao động với các điều khoản sau:\n\nĐiều 1: Công việc\nBên B làm công việc: {{position}}\nTại Phòng/Ban: {{department}}\n\nĐiều 2: Thời hạn hợp đồng\nLoại hợp đồng: {{employment_type}}\nThời hạn: Từ ngày {{join_date}}\n\nĐiều 3: Lương và phụ cấp\nLương cơ bản: {{salary_p1}} VNĐ/tháng\nPhụ cấp ăn trưa: {{allowance_meal}} VNĐ/tháng\nPhụ cấp xăng xe: {{allowance_fuel}} VNĐ/tháng',
    '{"employee_name": "Tên nhân viên", "employee_code": "Mã NV", "birth_date": "Ngày sinh", "id_number": "Số CCCD", "address": "Địa chỉ", "position": "Chức vụ", "department": "Phòng ban", "employment_type": "Loại hợp đồng", "join_date": "Ngày bắt đầu", "salary_p1": "Lương cơ bản", "allowance_meal": "PC ăn trưa", "allowance_fuel": "PC xăng xe", "doc_no": "Số hợp đồng", "current_date": "Ngày hiện tại"}'::jsonb,
    true
  ),
  (
    'Mẫu Đơn Xin Nghỉ Phép',
    'form',
    E'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n\nĐơn xin nghỉ phép\n\nKính gửi: Ban Giám đốc Công ty\n\nTôi tên là: {{employee_name}}\nMã nhân viên: {{employee_code}}\nChức vụ: {{position}}\nPhòng/Ban: {{department}}\n\nTôi xin được nghỉ phép từ ngày {{start_date}} đến ngày {{end_date}}\nLý do: {{reason}}\n\nTrong thời gian nghỉ, tôi đã bàn giao công việc cho: {{backup_person}}\n\nTôi xin cam đoan hoàn thành công việc trước khi nghỉ và sẽ quay lại làm việc đúng hạn.\n\nTôi xin chân thành cảm ơn!',
    '{"employee_name": "Tên nhân viên", "employee_code": "Mã NV", "position": "Chức vụ", "department": "Phòng ban", "start_date": "Ngày bắt đầu nghỉ", "end_date": "Ngày kết thúc nghỉ", "reason": "Lý do nghỉ", "backup_person": "Người thay thế", "current_date": "Ngày hiện tại"}'::jsonb,
    true
  )
ON CONFLICT DO NOTHING;

-- 5. Function: Generate document number
CREATE OR REPLACE FUNCTION public.generate_doc_number(_doc_type text, _year integer)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _prefix text;
  _last_number integer;
  _new_number text;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT prefix, last_number INTO _prefix, _last_number
  FROM public.document_sequences
  WHERE doc_type = _doc_type AND year = _year
  FOR UPDATE;
  
  -- If no record exists, create one
  IF NOT FOUND THEN
    SELECT CASE 
      WHEN _doc_type = 'decision' THEN 'QĐ'
      WHEN _doc_type = 'notice' THEN 'TB'
      WHEN _doc_type = 'contract' THEN 'HĐ'
      WHEN _doc_type = 'form' THEN 'BM'
      ELSE 'DOC'
    END INTO _prefix;
    
    INSERT INTO public.document_sequences (doc_type, year, last_number, prefix)
    VALUES (_doc_type, _year, 1, _prefix);
    
    _last_number := 1;
  ELSE
    -- Increment the last number
    UPDATE public.document_sequences
    SET last_number = last_number + 1,
        updated_at = now()
    WHERE doc_type = _doc_type AND year = _year;
    
    _last_number := _last_number + 1;
  END IF;
  
  -- Format: PREFIX-NNN/YYYY (e.g., QĐ-001/2024)
  _new_number := _prefix || '-' || LPAD(_last_number::text, 3, '0') || '/' || _year::text;
  
  RETURN _new_number;
END;
$$;

-- 6. Trigger: Auto-generate doc_no on INSERT
CREATE OR REPLACE FUNCTION public.auto_generate_doc_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _year integer;
BEGIN
  -- Only generate if doc_no is NULL
  IF NEW.doc_no IS NULL THEN
    _year := EXTRACT(YEAR FROM NEW.issue_date)::integer;
    NEW.doc_no := public.generate_doc_number(NEW.doc_type, _year);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_generate_doc_number
BEFORE INSERT ON public.administrative_documents
FOR EACH ROW
EXECUTE FUNCTION public.auto_generate_doc_number();

-- 7. Trigger: Update updated_at timestamp
CREATE TRIGGER update_administrative_documents_updated_at
BEFORE UPDATE ON public.administrative_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at
BEFORE UPDATE ON public.document_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_sequences_updated_at
BEFORE UPDATE ON public.document_sequences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Enable RLS on all tables
ALTER TABLE public.administrative_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies for administrative_documents
-- Admins can do everything
CREATE POLICY "Admins have full access to admin documents"
ON public.administrative_documents FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Users with view_admin_documents permission can view all documents
CREATE POLICY "Users with permission can view admin documents"
ON public.administrative_documents FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'view_admin_documents'
  )
);

-- Users with create permission can insert
CREATE POLICY "Users with permission can create admin documents"
ON public.administrative_documents FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'create_admin_documents'
  )
);

-- Users with approve permission can update
CREATE POLICY "Users with permission can update admin documents"
ON public.administrative_documents FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code IN ('create_admin_documents', 'approve_admin_documents')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code IN ('create_admin_documents', 'approve_admin_documents')
  )
);

-- Users with delete permission can delete
CREATE POLICY "Users with permission can delete admin documents"
ON public.administrative_documents FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'delete_admin_documents'
  )
);

-- Employees can view their own documents
CREATE POLICY "Employees can view own documents"
ON public.administrative_documents FOR SELECT
TO authenticated
USING (employee_id = auth.uid());

-- Employees can view published company-wide documents
CREATE POLICY "Anyone can view published company documents"
ON public.administrative_documents FOR SELECT
TO authenticated
USING (employee_id IS NULL AND status = 'published');

-- 10. RLS Policies for document_versions
-- Users can view versions if they can view the document
CREATE POLICY "Users can view versions of accessible documents"
ON public.document_versions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM administrative_documents ad
    WHERE ad.id = document_versions.document_id
      AND (
        is_admin(auth.uid())
        OR ad.employee_id = auth.uid()
        OR (ad.employee_id IS NULL AND ad.status = 'published')
        OR EXISTS (
          SELECT 1
          FROM user_roles ur
          JOIN role_permissions rp ON rp.role_id = ur.role_id
          JOIN features f ON f.id = rp.feature_id
          WHERE ur.user_id = auth.uid()
            AND f.code = 'view_admin_documents'
        )
      )
  )
);

-- Users with edit permission can create versions
CREATE POLICY "Users with permission can create versions"
ON public.document_versions FOR INSERT
TO authenticated
WITH CHECK (
  is_admin(auth.uid())
  OR EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'create_admin_documents'
  )
);

-- 11. RLS Policies for document_templates
-- Anyone authenticated can view active templates
CREATE POLICY "Users can view active templates"
ON public.document_templates FOR SELECT
TO authenticated
USING (is_active = true OR is_admin(auth.uid()));

-- Only admins and users with create permission can manage templates
CREATE POLICY "Admins can manage templates"
ON public.document_templates FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 12. RLS Policies for document_sequences
-- Only admins can view sequences
CREATE POLICY "Admins can view sequences"
ON public.document_sequences FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- 13. Add features to the features table
INSERT INTO public.features (module_id, code, name, description, feature_type)
SELECT 
  m.id,
  'view_admin_documents',
  'Xem Hồ Sơ Hành Chính',
  'Xem danh sách và chi tiết văn bản hành chính',
  'read'
FROM public.modules m
WHERE m.code = 'hr'
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.features (module_id, code, name, description, feature_type)
SELECT 
  m.id,
  'create_admin_documents',
  'Tạo Hồ Sơ Hành Chính',
  'Tạo mới và chỉnh sửa văn bản hành chính',
  'write'
FROM public.modules m
WHERE m.code = 'hr'
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.features (module_id, code, name, description, feature_type)
SELECT 
  m.id,
  'approve_admin_documents',
  'Phê Duyệt Hồ Sơ Hành Chính',
  'Phê duyệt và xuất bản văn bản hành chính',
  'write'
FROM public.modules m
WHERE m.code = 'hr'
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.features (module_id, code, name, description, feature_type)
SELECT 
  m.id,
  'delete_admin_documents',
  'Xóa Hồ Sơ Hành Chính',
  'Xóa văn bản hành chính',
  'delete'
FROM public.modules m
WHERE m.code = 'hr'
ON CONFLICT (code) DO NOTHING;