-- Phase 1: Copy all permissions from role_id = 6 (ERP Admin) to role_id = 9 (Admin)
INSERT INTO public.role_permissions (role_id, feature_id)
SELECT 9, feature_id
FROM public.role_permissions
WHERE role_id = 6
ON CONFLICT DO NOTHING;

-- Phase 5: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_feature_id ON public.role_permissions(feature_id);