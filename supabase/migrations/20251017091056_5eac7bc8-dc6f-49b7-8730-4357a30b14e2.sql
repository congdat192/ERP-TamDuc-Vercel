-- Add policy to allow owners to view their own businesses
-- This is needed because when creating a business, we need to fetch it
-- before adding the owner as a member
CREATE POLICY "Owners can view own businesses"
ON public.businesses
FOR SELECT
USING (owner_id = auth.uid());