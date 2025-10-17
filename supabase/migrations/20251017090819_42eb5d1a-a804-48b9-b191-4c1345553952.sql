-- Drop existing policy that's blocking INSERT
DROP POLICY IF EXISTS "Authenticated users can create businesses" ON public.businesses;

-- Create simplified policy - only check owner_id matches auth.uid()
CREATE POLICY "Users can create own businesses"
ON public.businesses
FOR INSERT
WITH CHECK (owner_id = auth.uid());