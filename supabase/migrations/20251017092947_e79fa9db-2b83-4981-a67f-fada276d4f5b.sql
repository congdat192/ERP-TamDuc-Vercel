-- Create invitations table
CREATE TABLE public.business_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email text NOT NULL,
  role_id integer NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  invited_by uuid NOT NULL REFERENCES auth.users(id),
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);

-- Create unique constraint to prevent duplicate pending invitations
CREATE UNIQUE INDEX idx_unique_pending_invitation ON business_invitations(business_id, email, status) WHERE status = 'pending';

-- Create indexes for faster lookups
CREATE INDEX idx_business_invitations_business ON business_invitations(business_id);
CREATE INDEX idx_business_invitations_email ON business_invitations(email);
CREATE INDEX idx_business_invitations_token ON business_invitations(token);
CREATE INDEX idx_business_invitations_status ON business_invitations(status);

-- Enable RLS
ALTER TABLE public.business_invitations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Admins can view invitations in their businesses
CREATE POLICY "Business members can view invitations"
ON public.business_invitations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.business_members
    WHERE business_members.business_id = business_invitations.business_id
    AND business_members.user_id = auth.uid()
    AND business_members.status = 'ACTIVE'
  )
);

-- Admins can create invitations
CREATE POLICY "Business members can create invitations"
ON public.business_invitations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.business_members
    WHERE business_members.business_id = business_invitations.business_id
    AND business_members.user_id = auth.uid()
    AND business_members.status = 'ACTIVE'
  )
);

-- Admins can delete pending invitations
CREATE POLICY "Business members can delete pending invitations"
ON public.business_invitations
FOR DELETE
USING (
  status = 'pending'
  AND EXISTS (
    SELECT 1 FROM public.business_members
    WHERE business_members.business_id = business_invitations.business_id
    AND business_members.user_id = auth.uid()
    AND business_members.status = 'ACTIVE'
  )
);

-- Users can view invitations sent to their email
CREATE POLICY "Users can view own invitations by email"
ON public.business_invitations
FOR SELECT
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Update trigger
CREATE TRIGGER update_business_invitations_updated_at
  BEFORE UPDATE ON public.business_invitations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();