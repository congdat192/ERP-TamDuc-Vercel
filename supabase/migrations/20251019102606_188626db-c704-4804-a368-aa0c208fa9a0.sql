-- Create document_change_requests table
CREATE TABLE document_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id),
  request_type text NOT NULL DEFAULT 'document_upload',
  
  -- Document metadata
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  mime_type text,
  notes text,
  
  -- Status tracking
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  review_note text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE document_change_requests ENABLE ROW LEVEL SECURITY;

-- Employees can create document change requests
CREATE POLICY "Employees can create document change requests"
ON document_change_requests FOR INSERT
WITH CHECK (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);

-- Employees can view own document change requests
CREATE POLICY "Employees can view own document change requests"
ON document_change_requests FOR SELECT
USING (
  employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  )
);

-- Admins can view all document change requests
CREATE POLICY "Admins can view all document change requests"
ON document_change_requests FOR SELECT
USING (is_admin(auth.uid()));

-- Admins can update document change requests
CREATE POLICY "Admins can update document change requests"
ON document_change_requests FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Storage RLS Policies for employee-documents bucket
-- Allow employees to upload to pending folder
CREATE POLICY "Employees can upload to pending folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'employee-documents' AND
  (storage.foldername(name))[1] = 'documents' AND
  (storage.foldername(name))[2] = 'pending' AND
  auth.uid() IN (
    SELECT user_id FROM employees 
    WHERE id::text = split_part((storage.foldername(name))[3], '_', 1)
  )
);

-- Allow employees to read own documents (both pending and approved)
CREATE POLICY "Employees can read own documents from storage"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  (storage.foldername(name))[1] = 'documents' AND
  (
    auth.uid() IN (
      SELECT user_id FROM employees 
      WHERE id::text = split_part(CASE 
        WHEN (storage.foldername(name))[2] = 'pending' 
        THEN (storage.foldername(name))[3]
        ELSE (storage.foldername(name))[2]
      END, '_', 1)
    )
  )
);

-- Allow employees to delete own pending documents
CREATE POLICY "Employees can delete own pending documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  (storage.foldername(name))[1] = 'documents' AND
  (storage.foldername(name))[2] = 'pending' AND
  auth.uid() IN (
    SELECT user_id FROM employees 
    WHERE id::text = split_part((storage.foldername(name))[3], '_', 1)
  )
);

-- Allow admins full access to employee-documents
CREATE POLICY "Admins can manage all documents in storage"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'employee-documents' AND
  is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'employee-documents' AND
  is_admin(auth.uid())
);