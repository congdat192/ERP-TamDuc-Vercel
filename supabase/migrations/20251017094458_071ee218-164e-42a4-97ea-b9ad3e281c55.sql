-- Fix RLS policy for business_invitations to avoid querying auth.users
DROP POLICY IF EXISTS "Users can view own invitations by email" ON public.business_invitations;

-- Create new policy using auth.jwt() instead of querying auth.users
CREATE POLICY "Users can view own invitations by email"
ON public.business_invitations
FOR SELECT
USING (
  email = (auth.jwt()->>'email')::text
);

-- Add UPDATE policies for business owners
CREATE POLICY "Business owners can update invitations"
ON public.business_invitations
FOR UPDATE
USING (
  business_id IN (
    SELECT id FROM public.businesses
    WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses
    WHERE owner_id = auth.uid()
  )
);

-- Add UPDATE policies for business members
CREATE POLICY "Business members can update invitations"
ON public.business_invitations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM business_members
    WHERE business_members.business_id = business_invitations.business_id
      AND business_members.user_id = auth.uid()
      AND business_members.status = 'ACTIVE'::member_status
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM business_members
    WHERE business_members.business_id = business_invitations.business_id
      AND business_members.user_id = auth.uid()
      AND business_members.status = 'ACTIVE'::member_status
  )
);