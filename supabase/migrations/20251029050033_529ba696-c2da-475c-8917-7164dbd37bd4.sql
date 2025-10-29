-- Enable Realtime publication for user_roles table
-- This allows frontend to receive real-time notifications when user roles change
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;