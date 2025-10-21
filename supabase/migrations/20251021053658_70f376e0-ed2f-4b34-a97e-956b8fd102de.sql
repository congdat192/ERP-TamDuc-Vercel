-- ================================================
-- BƯỚC 1: Tạo bảng training_trainers
-- ================================================
CREATE TABLE IF NOT EXISTS public.training_trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  expertise TEXT, -- Chuyên môn
  bio TEXT, -- Giới thiệu
  avatar_path TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_training_trainers_status ON public.training_trainers(status);
CREATE INDEX IF NOT EXISTS idx_training_trainers_email ON public.training_trainers(email);

-- RLS
ALTER TABLE public.training_trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view trainers with permission"
ON public.training_trainers FOR SELECT
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  )
);

CREATE POLICY "Users can manage trainers with permission"
ON public.training_trainers FOR ALL
USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'manage_training'
  )
);

-- Trigger updated_at
CREATE TRIGGER update_training_trainers_updated_at
BEFORE UPDATE ON public.training_trainers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ================================================
-- BƯỚC 2: Tạo bảng training_competency_levels
-- ================================================
CREATE TABLE IF NOT EXISTS public.training_competency_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INTEGER NOT NULL UNIQUE CHECK (level >= 1 AND level <= 5),
  name TEXT NOT NULL, -- Ví dụ: "Cơ bản", "Trung bình", "Khá", "Giỏi", "Xuất sắc"
  description TEXT,
  color TEXT NOT NULL DEFAULT '#gray', -- Màu sắc hiển thị badge
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.training_competency_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view competency levels"
ON public.training_competency_levels FOR SELECT
USING (true);

CREATE POLICY "Admins can manage competency levels"
ON public.training_competency_levels FOR ALL
USING (is_admin(auth.uid()));

-- Insert default 5 levels
INSERT INTO public.training_competency_levels (level, name, description, color) VALUES
  (1, 'Cơ bản', 'Hiểu biết cơ bản, cần hướng dẫn', '#ef4444'),
  (2, 'Trung bình', 'Có thể làm việc với ít hướng dẫn', '#f97316'),
  (3, 'Khá', 'Làm việc độc lập tốt', '#eab308'),
  (4, 'Giỏi', 'Thành thạo, có thể hướng dẫn người khác', '#22c55e'),
  (5, 'Xuất sắc', 'Chuyên gia, dẫn dắt và đổi mới', '#3b82f6')
ON CONFLICT (level) DO NOTHING;

-- ================================================
-- BƯỚC 3: Thêm FK trainer_id vào training_sessions
-- ================================================
ALTER TABLE public.training_sessions 
ADD COLUMN IF NOT EXISTS trainer_id UUID REFERENCES public.training_trainers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_training_sessions_trainer_id ON public.training_sessions(trainer_id);