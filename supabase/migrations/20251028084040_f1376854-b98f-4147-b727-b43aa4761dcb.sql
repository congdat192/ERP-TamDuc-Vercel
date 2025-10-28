-- Migration 1: Add voucher_image_url to voucher_campaigns
ALTER TABLE voucher_campaigns 
ADD COLUMN IF NOT EXISTS voucher_image_url TEXT;

COMMENT ON COLUMN voucher_campaigns.voucher_image_url IS 'URL to voucher template image in Supabase Storage';

-- Migration 2: Create Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('voucher-templates', 'voucher-templates', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('voucher-generated', 'voucher-generated', true)
ON CONFLICT (id) DO NOTHING;

-- Migration 3: Storage RLS Policies for voucher-templates
CREATE POLICY "Admin can upload templates"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voucher-templates' AND
  is_admin(auth.uid())
);

CREATE POLICY "Anyone can view templates"
ON storage.objects FOR SELECT
USING (bucket_id = 'voucher-templates');

CREATE POLICY "Admin can delete templates"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'voucher-templates' AND
  is_admin(auth.uid())
);

-- RLS Policies for voucher-generated bucket
CREATE POLICY "Authenticated users can upload generated vouchers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'voucher-generated');

CREATE POLICY "Authenticated users can view generated vouchers"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'voucher-generated');

CREATE POLICY "System can delete generated vouchers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'voucher-generated');