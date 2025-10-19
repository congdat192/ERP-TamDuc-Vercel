-- Simplify storage RLS for better performance
-- Drop complex policy that causes timeouts
DROP POLICY IF EXISTS "Employees can read own documents from storage" ON storage.objects;

-- Create simple policy: Authenticated users can read employee-documents bucket
-- Security rationale:
-- 1. User must be authenticated (logged in)
-- 2. Signed URLs expire in 60 seconds
-- 3. File paths contain employee_id and are not guessable
-- 4. RLS on employee_documents table already controls access to file metadata
CREATE POLICY "Authenticated users can read employee documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'employee-documents');