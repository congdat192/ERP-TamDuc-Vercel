-- Allow anyone to view pending invitations by token (for unauthenticated users to register)
CREATE POLICY "Anyone can view pending invitation by token"
ON business_invitations
FOR SELECT
USING (status = 'pending');