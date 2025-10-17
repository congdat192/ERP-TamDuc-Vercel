-- Allow anonymous users to view business info for pending invitations
CREATE POLICY "Anyone can view business info for pending invitations"
ON public.businesses
FOR SELECT
USING (
  id IN (
    SELECT business_id 
    FROM public.business_invitations 
    WHERE status = 'pending'
  )
);

-- Allow anonymous users to view role info for pending invitations
CREATE POLICY "Anyone can view role info for pending invitations"
ON public.roles
FOR SELECT
USING (
  id IN (
    SELECT role_id 
    FROM public.business_invitations 
    WHERE status = 'pending'
  )
);