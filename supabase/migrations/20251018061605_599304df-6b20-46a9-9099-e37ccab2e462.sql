-- Enable realtime for profiles table to detect status changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;