-- Phase 1: Tạo feature manage_lens_admin
INSERT INTO features (module_id, code, name, description, feature_type)
VALUES (8, 'manage_lens_admin', 'Quản lý Lens Admin', 'Quyền truy cập toàn bộ module Lens Admin (products, attributes, supply tiers, use cases, recommendations, banners, catalogs)', 'edit');

-- Phase 2: Cập nhật RLS Policies cho 8 tables

-- 2.1. lens_products
DROP POLICY IF EXISTS "Admins can manage products" ON lens_products;

CREATE POLICY "Users can manage products with lens_admin permission"
ON lens_products FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);

-- 2.2. lens_product_attributes
DROP POLICY IF EXISTS "Admins can manage attributes" ON lens_product_attributes;

CREATE POLICY "Users can manage attributes with lens_admin permission"
ON lens_product_attributes FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);

-- 2.3. lens_supply_tiers
DROP POLICY IF EXISTS "Admins can manage tiers" ON lens_supply_tiers;

CREATE POLICY "Users can manage supply tiers with lens_admin permission"
ON lens_supply_tiers FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);

-- 2.4. lens_use_cases
DROP POLICY IF EXISTS "Admins can manage use cases" ON lens_use_cases;

CREATE POLICY "Users can manage use cases with lens_admin permission"
ON lens_use_cases FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);

-- 2.5. lens_product_use_case_scores
DROP POLICY IF EXISTS "Admins can manage scores" ON lens_product_use_case_scores;

CREATE POLICY "Users can manage use case scores with lens_admin permission"
ON lens_product_use_case_scores FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);

-- 2.6. lens_recommendation_groups
DROP POLICY IF EXISTS "Admins can manage recommendation groups" ON lens_recommendation_groups;

CREATE POLICY "Users can manage recommendation groups with lens_admin permission"
ON lens_recommendation_groups FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);

-- 2.7. lens_recommendation_products
DROP POLICY IF EXISTS "Admins can manage recommendation products" ON lens_recommendation_products;

CREATE POLICY "Users can manage recommendation products with lens_admin permission"
ON lens_recommendation_products FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);

-- 2.8. lens_banners
DROP POLICY IF EXISTS "Admins can manage banners" ON lens_banners;

CREATE POLICY "Users can manage banners with lens_admin permission"
ON lens_banners FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);

-- 2.9. supplier_catalogs
DROP POLICY IF EXISTS "Admins can manage catalogs" ON supplier_catalogs;

CREATE POLICY "Users can manage catalogs with lens_admin permission"
ON supplier_catalogs FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
)
WITH CHECK (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid()
      AND f.code = 'manage_lens_admin'
  )
);