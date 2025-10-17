-- PHASE 1: DATABASE SCHEMA SETUP FOR AUTHENTICATION & RBAC SYSTEM

-- ============================================================================
-- 1. CREATE ENUMS
-- ============================================================================

-- Platform-level roles
CREATE TYPE public.app_role AS ENUM (
  'user',              -- Default role for all users
  'business_owner',    -- Owner of a business
  'super_admin'        -- Platform administrator
);

-- Business member status
CREATE TYPE public.member_status AS ENUM (
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'SUSPENDED'
);

-- ============================================================================
-- 2. CREATE CORE TABLES
-- ============================================================================

-- User profiles (public data linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Platform-level user roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  address TEXT,
  phone_number TEXT,
  email_address TEXT,
  website_url TEXT,
  tax_number TEXT,
  logo_path TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules table (ERP modules)
CREATE TABLE public.modules (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Features table (permissions within modules)
CREATE TABLE public.features (
  id SERIAL PRIMARY KEY,
  module_id INT REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  feature_type TEXT, -- 'view', 'create', 'edit', 'delete', 'manage'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles table (custom roles per business)
CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, name)
);

-- Role permissions (many-to-many: roles <-> features)
CREATE TABLE public.role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INT REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
  feature_id INT REFERENCES public.features(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role_id, feature_id)
);

-- Business members (users within businesses)
CREATE TABLE public.business_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role_id INT REFERENCES public.roles(id) ON DELETE SET NULL,
  status member_status DEFAULT 'ACTIVE',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, user_id)
);

-- ============================================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_business_members_user ON public.business_members(user_id);
CREATE INDEX idx_business_members_business ON public.business_members(business_id);
CREATE INDEX idx_business_members_role ON public.business_members(role_id);
CREATE INDEX idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- ============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. CREATE SECURITY DEFINER FUNCTIONS (CRITICAL - Prevents RLS recursion)
-- ============================================================================

-- Check if user has a platform role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Check if user has specific permission in a business
CREATE OR REPLACE FUNCTION public.has_permission(
  _user_id UUID,
  _business_id UUID,
  _feature_code TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM business_members bm
    JOIN roles r ON r.id = bm.role_id
    JOIN role_permissions rp ON rp.role_id = r.id
    JOIN features f ON f.id = rp.feature_id
    WHERE bm.user_id = _user_id
      AND bm.business_id = _business_id
      AND f.code = _feature_code
      AND bm.status = 'ACTIVE'
  )
$$;

-- Get user's all permissions for a business
CREATE OR REPLACE FUNCTION public.get_user_permissions(
  _user_id UUID,
  _business_id UUID
)
RETURNS TABLE (
  module_code TEXT,
  feature_code TEXT,
  feature_name TEXT,
  feature_type TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    m.code as module_code,
    f.code as feature_code,
    f.name as feature_name,
    f.feature_type as feature_type
  FROM business_members bm
  JOIN roles r ON r.id = bm.role_id
  JOIN role_permissions rp ON rp.role_id = r.id
  JOIN features f ON f.id = rp.feature_id
  JOIN modules m ON m.id = f.module_id
  WHERE bm.user_id = _user_id
    AND bm.business_id = _business_id
    AND bm.status = 'ACTIVE'
    AND m.is_active = true
  ORDER BY m.display_order, f.feature_type
$$;

-- Get businesses where user is a member
CREATE OR REPLACE FUNCTION public.get_user_businesses(_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  owner_id UUID,
  description TEXT,
  logo_path TEXT,
  is_owner BOOLEAN,
  user_role TEXT,
  role_name TEXT,
  member_status member_status
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.name,
    b.owner_id,
    b.description,
    b.logo_path,
    (b.owner_id = _user_id) as is_owner,
    CASE WHEN b.owner_id = _user_id THEN 'owner' ELSE 'member' END as user_role,
    r.name as role_name,
    bm.status as member_status
  FROM businesses b
  JOIN business_members bm ON bm.business_id = b.id
  LEFT JOIN roles r ON r.id = bm.role_id
  WHERE bm.user_id = _user_id
    AND bm.status = 'ACTIVE'
    AND b.is_active = true
  ORDER BY b.created_at DESC
$$;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Businesses policies
CREATE POLICY "Members can view their businesses"
  ON public.businesses FOR SELECT
  USING (
    id IN (
      SELECT business_id 
      FROM public.business_members 
      WHERE user_id = auth.uid()
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "Owners can update own businesses"
  ON public.businesses FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND owner_id = auth.uid());

-- Modules & Features policies (public read-only reference data)
CREATE POLICY "Anyone can view modules"
  ON public.modules FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view features"
  ON public.features FOR SELECT
  USING (true);

-- Roles policies
CREATE POLICY "Members can view roles in their businesses"
  ON public.roles FOR SELECT
  USING (
    business_id IN (
      SELECT business_id 
      FROM public.business_members 
      WHERE user_id = auth.uid()
        AND status = 'ACTIVE'
    )
  );

CREATE POLICY "Admins can manage roles"
  ON public.roles FOR ALL
  USING (
    public.has_permission(auth.uid(), business_id, 'manage_roles')
  );

-- Role permissions policies
CREATE POLICY "Members can view role permissions"
  ON public.role_permissions FOR SELECT
  USING (
    role_id IN (
      SELECT r.id 
      FROM roles r
      JOIN business_members bm ON bm.business_id = r.business_id
      WHERE bm.user_id = auth.uid()
        AND bm.status = 'ACTIVE'
    )
  );

-- Business members policies
CREATE POLICY "Users can view own memberships"
  ON public.business_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view business members"
  ON public.business_members FOR SELECT
  USING (
    business_id IN (
      SELECT business_id 
      FROM business_members 
      WHERE user_id = auth.uid() 
        AND status = 'ACTIVE'
    )
    AND public.has_permission(auth.uid(), business_id, 'view_members')
  );

CREATE POLICY "Admins can manage members"
  ON public.business_members FOR ALL
  USING (
    public.has_permission(auth.uid(), business_id, 'manage_members')
  );

-- ============================================================================
-- 7. CREATE TRIGGERS
-- ============================================================================

-- Trigger function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_businesses
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_roles
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-create profile and assign default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'phone'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 8. SEED DATA - Insert 11 ERP modules and features
-- ============================================================================

-- Insert modules
INSERT INTO public.modules (code, name, description, icon, display_order) VALUES
  ('dashboard', 'Tổng Quan', 'Dashboard và thống kê', 'LayoutDashboard', 1),
  ('customers', 'Khách Hàng', 'Quản lý khách hàng', 'Users', 2),
  ('sales', 'Hóa Đơn', 'Quản lý bán hàng', 'TrendingUp', 3),
  ('inventory', 'Kho Hàng', 'Quản lý sản phẩm', 'Package', 4),
  ('accounting', 'Kế Toán', 'Quản lý tài chính', 'Calculator', 5),
  ('hr', 'Nhân Sự', 'Quản lý nhân viên', 'UserCheck', 6),
  ('voucher', 'Voucher', 'Quản lý voucher', 'Ticket', 7),
  ('marketing', 'Marketing', 'Chiến dịch marketing', 'Megaphone', 8),
  ('affiliate', 'Affiliate', 'Chương trình giới thiệu', 'UserPlus', 9),
  ('system-settings', 'Cài Đặt', 'Cài đặt hệ thống', 'Settings', 10),
  ('user-management', 'Người Dùng', 'Quản lý người dùng', 'Shield', 11);

-- Insert features for DASHBOARD module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'dashboard'), 'view_dashboard', 'Xem Dashboard', 'Xem tổng quan và thống kê', 'view');

-- Insert features for CUSTOMERS module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'customers'), 'view_customers', 'Xem Khách Hàng', 'Xem danh sách và chi tiết khách hàng', 'view'),
  ((SELECT id FROM modules WHERE code = 'customers'), 'create_customers', 'Tạo Khách Hàng', 'Tạo khách hàng mới', 'create'),
  ((SELECT id FROM modules WHERE code = 'customers'), 'edit_customers', 'Sửa Khách Hàng', 'Chỉnh sửa thông tin khách hàng', 'edit'),
  ((SELECT id FROM modules WHERE code = 'customers'), 'delete_customers', 'Xóa Khách Hàng', 'Xóa khách hàng', 'delete');

-- Insert features for SALES module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'sales'), 'view_sales', 'Xem Hóa Đơn', 'Xem danh sách hóa đơn', 'view'),
  ((SELECT id FROM modules WHERE code = 'sales'), 'create_sales', 'Tạo Hóa Đơn', 'Tạo hóa đơn mới', 'create'),
  ((SELECT id FROM modules WHERE code = 'sales'), 'edit_sales', 'Sửa Hóa Đơn', 'Chỉnh sửa hóa đơn', 'edit'),
  ((SELECT id FROM modules WHERE code = 'sales'), 'delete_sales', 'Xóa Hóa Đơn', 'Xóa hóa đơn', 'delete');

-- Insert features for INVENTORY module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'inventory'), 'view_inventory', 'Xem Kho Hàng', 'Xem danh sách sản phẩm', 'view'),
  ((SELECT id FROM modules WHERE code = 'inventory'), 'create_inventory', 'Tạo Sản Phẩm', 'Thêm sản phẩm mới', 'create'),
  ((SELECT id FROM modules WHERE code = 'inventory'), 'edit_inventory', 'Sửa Sản Phẩm', 'Chỉnh sửa sản phẩm', 'edit'),
  ((SELECT id FROM modules WHERE code = 'inventory'), 'delete_inventory', 'Xóa Sản Phẩm', 'Xóa sản phẩm', 'delete');

-- Insert features for ACCOUNTING module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'accounting'), 'view_accounting', 'Xem Kế Toán', 'Xem thông tin tài chính', 'view'),
  ((SELECT id FROM modules WHERE code = 'accounting'), 'create_accounting', 'Tạo Giao Dịch', 'Tạo giao dịch mới', 'create'),
  ((SELECT id FROM modules WHERE code = 'accounting'), 'edit_accounting', 'Sửa Giao Dịch', 'Chỉnh sửa giao dịch', 'edit'),
  ((SELECT id FROM modules WHERE code = 'accounting'), 'delete_accounting', 'Xóa Giao Dịch', 'Xóa giao dịch', 'delete');

-- Insert features for HR module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'hr'), 'view_hr', 'Xem Nhân Sự', 'Xem thông tin nhân viên', 'view'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'create_hr', 'Tạo Nhân Viên', 'Thêm nhân viên mới', 'create'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'edit_hr', 'Sửa Nhân Viên', 'Chỉnh sửa thông tin nhân viên', 'edit'),
  ((SELECT id FROM modules WHERE code = 'hr'), 'delete_hr', 'Xóa Nhân Viên', 'Xóa nhân viên', 'delete');

-- Insert features for VOUCHER module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'voucher'), 'view_voucher', 'Xem Voucher', 'Xem danh sách voucher', 'view'),
  ((SELECT id FROM modules WHERE code = 'voucher'), 'create_voucher', 'Tạo Voucher', 'Tạo voucher mới', 'create'),
  ((SELECT id FROM modules WHERE code = 'voucher'), 'edit_voucher', 'Sửa Voucher', 'Chỉnh sửa voucher', 'edit'),
  ((SELECT id FROM modules WHERE code = 'voucher'), 'delete_voucher', 'Xóa Voucher', 'Xóa voucher', 'delete'),
  ((SELECT id FROM modules WHERE code = 'voucher'), 'approve_voucher', 'Duyệt Voucher', 'Duyệt và phát hành voucher', 'manage');

-- Insert features for MARKETING module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'marketing'), 'view_marketing', 'Xem Chiến Dịch', 'Xem danh sách chiến dịch', 'view'),
  ((SELECT id FROM modules WHERE code = 'marketing'), 'create_marketing', 'Tạo Chiến Dịch', 'Tạo chiến dịch mới', 'create'),
  ((SELECT id FROM modules WHERE code = 'marketing'), 'edit_marketing', 'Sửa Chiến Dịch', 'Chỉnh sửa chiến dịch', 'edit'),
  ((SELECT id FROM modules WHERE code = 'marketing'), 'delete_marketing', 'Xóa Chiến Dịch', 'Xóa chiến dịch', 'delete');

-- Insert features for AFFILIATE module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'affiliate'), 'view_affiliate', 'Xem Affiliate', 'Xem chương trình giới thiệu', 'view'),
  ((SELECT id FROM modules WHERE code = 'affiliate'), 'create_affiliate', 'Tạo Affiliate', 'Tạo chương trình mới', 'create'),
  ((SELECT id FROM modules WHERE code = 'affiliate'), 'edit_affiliate', 'Sửa Affiliate', 'Chỉnh sửa chương trình', 'edit'),
  ((SELECT id FROM modules WHERE code = 'affiliate'), 'delete_affiliate', 'Xóa Affiliate', 'Xóa chương trình', 'delete');

-- Insert features for SYSTEM SETTINGS module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'system-settings'), 'view_settings', 'Xem Cài Đặt', 'Xem cài đặt hệ thống', 'view'),
  ((SELECT id FROM modules WHERE code = 'system-settings'), 'edit_settings', 'Sửa Cài Đặt', 'Chỉnh sửa cài đặt', 'edit');

-- Insert features for USER MANAGEMENT module
INSERT INTO public.features (module_id, code, name, description, feature_type) VALUES
  ((SELECT id FROM modules WHERE code = 'user-management'), 'view_members', 'Xem Thành Viên', 'Xem danh sách thành viên', 'view'),
  ((SELECT id FROM modules WHERE code = 'user-management'), 'manage_members', 'Quản Lý Thành Viên', 'Thêm/sửa/xóa thành viên', 'manage'),
  ((SELECT id FROM modules WHERE code = 'user-management'), 'manage_roles', 'Quản Lý Vai Trò', 'Tạo và chỉnh sửa vai trò', 'manage'),
  ((SELECT id FROM modules WHERE code = 'user-management'), 'manage_permissions', 'Quản Lý Quyền Hạn', 'Phân quyền cho vai trò', 'manage');