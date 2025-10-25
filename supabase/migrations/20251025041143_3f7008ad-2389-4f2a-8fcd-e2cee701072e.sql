-- Update lens-images bucket to support PDF files
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/webp', 
  'image/gif',
  'application/pdf'
]
WHERE id = 'lens-images';