-- Fix RLS for backup table
ALTER TABLE lens_product_attributes_backup ENABLE ROW LEVEL SECURITY;

-- Admin-only access to backup table
CREATE POLICY "Admins can view backup data"
ON lens_product_attributes_backup
FOR SELECT
USING (is_admin(auth.uid()));