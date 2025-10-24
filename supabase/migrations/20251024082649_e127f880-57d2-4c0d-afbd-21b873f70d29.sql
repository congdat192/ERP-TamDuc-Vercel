-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view lens images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload lens images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update lens images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete lens images" ON storage.objects;

-- Ensure lens-images bucket exists with public access
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('lens-images', 'lens-images', true, 52428800, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Grant SELECT to everyone (public bucket)
CREATE POLICY "Anyone can view lens images"
ON storage.objects FOR SELECT
USING (bucket_id = 'lens-images');

-- Grant INSERT to authenticated users
CREATE POLICY "Authenticated users can upload lens images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'lens-images');

-- Grant UPDATE to authenticated users (for metadata)
CREATE POLICY "Authenticated users can update lens images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'lens-images')
WITH CHECK (bucket_id = 'lens-images');

-- Grant DELETE to authenticated users
CREATE POLICY "Authenticated users can delete lens images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'lens-images');