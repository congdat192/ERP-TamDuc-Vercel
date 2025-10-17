-- Step 1: Create security definer function to check business membership
CREATE OR REPLACE FUNCTION public.is_business_member(_user_id uuid, _business_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.business_members
    WHERE user_id = _user_id
      AND business_id = _business_id
      AND status = 'ACTIVE'::member_status
  )
$$;

-- Step 2: Drop problematic policies that cause recursion
DROP POLICY IF EXISTS "Admins can view business members" ON public.business_members;
DROP POLICY IF EXISTS "Admins can manage members" ON public.business_members;

-- Step 3: Create new policies using security definer function
CREATE POLICY "Admins can view business members" 
ON public.business_members
FOR SELECT 
USING (
  public.is_business_member(auth.uid(), business_id) 
  AND public.has_permission(auth.uid(), business_id, 'view_members'::text)
);

CREATE POLICY "Business owners can add members"
ON public.business_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses
    WHERE id = business_id
      AND owner_id = auth.uid()
  )
);

CREATE POLICY "Admins can update members"
ON public.business_members
FOR UPDATE
USING (
  public.is_business_member(auth.uid(), business_id)
  AND public.has_permission(auth.uid(), business_id, 'manage_members'::text)
);

CREATE POLICY "Admins can delete members"
ON public.business_members
FOR DELETE
USING (
  public.is_business_member(auth.uid(), business_id)
  AND public.has_permission(auth.uid(), business_id, 'manage_members'::text)
);