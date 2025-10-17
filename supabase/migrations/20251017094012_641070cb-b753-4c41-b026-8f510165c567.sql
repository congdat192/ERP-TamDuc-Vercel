-- Add policy for business owners to view invitations
CREATE POLICY "Business owners can view invitations"
ON public.business_invitations
FOR SELECT
USING (
  business_id IN (
    SELECT id FROM public.businesses
    WHERE owner_id = auth.uid()
  )
);

-- Add policy for business owners to create invitations
CREATE POLICY "Business owners can create invitations"
ON public.business_invitations
FOR INSERT
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses
    WHERE owner_id = auth.uid()
  )
);

-- Add policy for business owners to delete invitations
CREATE POLICY "Business owners can delete invitations"
ON public.business_invitations
FOR DELETE
USING (
  business_id IN (
    SELECT id FROM public.businesses
    WHERE owner_id = auth.uid()
  )
);