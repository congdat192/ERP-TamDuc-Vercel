-- Phase 0: Fix Owner Permissions - Grant full access to all modules

-- Insert all features from all modules for Owner role
INSERT INTO public.role_permissions (role_id, feature_id)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'Owner' LIMIT 1) as role_id,
  f.id as feature_id
FROM public.features f
WHERE NOT EXISTS (
  SELECT 1 
  FROM public.role_permissions rp 
  WHERE rp.role_id = (SELECT id FROM public.roles WHERE name = 'Owner' LIMIT 1)
    AND rp.feature_id = f.id
);