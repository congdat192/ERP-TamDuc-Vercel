-- Drop existing constraint if it exists (might have different name)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'business_invitations_invited_by_fkey' 
        AND table_name = 'business_invitations'
    ) THEN
        ALTER TABLE public.business_invitations 
        DROP CONSTRAINT business_invitations_invited_by_fkey;
    END IF;
END $$;

-- Create foreign key constraint from business_invitations.invited_by to profiles.id
ALTER TABLE public.business_invitations
ADD CONSTRAINT business_invitations_invited_by_fkey 
FOREIGN KEY (invited_by) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_business_invitations_invited_by 
ON public.business_invitations(invited_by);

COMMENT ON CONSTRAINT business_invitations_invited_by_fkey 
ON public.business_invitations 
IS 'Links invitation creator to their profile for displaying inviter information';