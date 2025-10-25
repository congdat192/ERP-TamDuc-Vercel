-- Fix RLS policy for lens_banners to allow admins to view ALL banners (active + inactive)

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Anyone can view active banners" ON lens_banners;

-- Create new SELECT policy: Public sees only active, Admins see all
CREATE POLICY "Public can view active banners, admins see all"
ON lens_banners FOR SELECT
USING (
  is_active = true OR is_admin(auth.uid())
);