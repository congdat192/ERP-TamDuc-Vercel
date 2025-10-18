-- Phase 1: Storage Bucket for Employee Avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('employee-avatars', 'employee-avatars', true);

-- RLS Policy: Authenticated users can upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'employee-avatars');

-- RLS Policy: Public can view avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'employee-avatars');

-- RLS Policy: Admins can delete avatars
CREATE POLICY "Admins can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'employee-avatars' AND
  is_admin(auth.uid())
);

-- Phase 2: Employee Documents Table
CREATE TABLE employee_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN (
    'contract',
    'id_card',
    'degree',
    'certificate',
    'health_record',
    'other'
  )),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  notes TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for employee_documents
CREATE INDEX idx_employee_documents_employee ON employee_documents(employee_id);
CREATE INDEX idx_employee_documents_type ON employee_documents(document_type);

-- Enable RLS
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view documents if they have permission
CREATE POLICY "Users can view documents if they have permission"
ON employee_documents FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
      AND f.code = 'view_employees'
  ) OR is_admin(auth.uid())
);

-- RLS Policy: Users can upload documents if they have permission
CREATE POLICY "Users can upload documents if they have permission"
ON employee_documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
      AND f.code = 'edit_employees'
  ) OR is_admin(auth.uid())
);

-- RLS Policy: Users can delete documents if they have permission
CREATE POLICY "Users can delete documents if they have permission"
ON employee_documents FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
      AND f.code = 'delete_employees'
  ) OR is_admin(auth.uid())
);

-- Storage Bucket for Employee Documents (private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('employee-documents', 'employee-documents', false);

-- RLS Policy: Authenticated users can upload documents
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'employee-documents');

-- RLS Policy: Users with permission can view documents
CREATE POLICY "Users with permission can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
      AND f.code = 'view_employees'
  ) OR is_admin(auth.uid()))
);

-- RLS Policy: Users with permission can delete documents
CREATE POLICY "Users with permission can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  (EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() 
      AND f.code = 'delete_employees'
  ) OR is_admin(auth.uid()))
);