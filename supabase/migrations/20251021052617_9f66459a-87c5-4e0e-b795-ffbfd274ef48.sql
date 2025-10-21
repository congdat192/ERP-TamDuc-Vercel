-- =====================================================
-- TRAINING MODULE - COMPLETE DATABASE SCHEMA
-- =====================================================

-- 1. TRAINING PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS public.training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'technical', 'soft_skills', 'leadership', 'compliance', 'onboarding'
  duration_hours INTEGER NOT NULL DEFAULT 0,
  max_participants INTEGER,
  passing_score INTEGER DEFAULT 70,
  is_mandatory BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'completed', 'cancelled'
  start_date DATE,
  end_date DATE,
  trainer_name TEXT,
  trainer_email TEXT,
  location TEXT,
  online_meeting_link TEXT,
  prerequisites TEXT,
  learning_objectives TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- 2. TRAINING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  session_number INTEGER NOT NULL,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  online_meeting_link TEXT,
  trainer_name TEXT,
  agenda TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TRAINING ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.training_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'enrolled', -- 'enrolled', 'in_progress', 'completed', 'failed', 'cancelled'
  completion_date DATE,
  final_score NUMERIC(5,2),
  attendance_rate NUMERIC(5,2) DEFAULT 0,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  notes TEXT,
  enrolled_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(program_id, employee_id)
);

-- 4. TRAINING DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.training_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.training_programs(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL, -- 'slide', 'reading', 'video', 'exercise'
  file_url TEXT,
  embed_url TEXT,
  file_size INTEGER,
  is_required BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. TRAINING QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.training_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.training_programs(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  quiz_type TEXT NOT NULL, -- 'pre_test', 'mid_test', 'post_test'
  time_limit_minutes INTEGER NOT NULL DEFAULT 60,
  passing_score INTEGER NOT NULL DEFAULT 70,
  total_questions INTEGER NOT NULL DEFAULT 0,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  randomize_questions BOOLEAN DEFAULT false,
  show_correct_answers BOOLEAN DEFAULT true,
  max_attempts INTEGER DEFAULT 3,
  score_policy TEXT DEFAULT 'best', -- 'best', 'last', 'average'
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. TRAINING QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.training_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.training_quizzes(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.training_enrollments(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  time_taken_minutes INTEGER,
  score NUMERIC(5,2),
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'graded'
  passed BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. TRAINING FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.training_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES public.training_programs(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  trainer_rating INTEGER CHECK (trainer_rating >= 1 AND trainer_rating <= 5),
  content_rating INTEGER CHECK (content_rating >= 1 AND content_rating <= 5),
  facility_rating INTEGER CHECK (facility_rating >= 1 AND facility_rating <= 5),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  comments TEXT,
  suggestions TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. TRAINING COMPETENCIES TABLE (link programs to competencies)
CREATE TABLE IF NOT EXISTS public.training_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  competency_code TEXT NOT NULL,
  competency_name TEXT NOT NULL,
  target_level INTEGER NOT NULL CHECK (target_level >= 1 AND target_level <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(program_id, competency_code)
);

-- 9. EMPLOYEE COMPETENCIES TABLE
CREATE TABLE IF NOT EXISTS public.employee_competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  competency_code TEXT NOT NULL,
  competency_name TEXT NOT NULL,
  current_level INTEGER NOT NULL CHECK (current_level >= 1 AND current_level <= 5),
  target_level INTEGER CHECK (target_level >= 1 AND target_level <= 5),
  last_assessed_date DATE,
  assessed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(employee_id, competency_code)
);

-- 10. COURSE RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.course_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
  competency_gap TEXT,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'high', 'medium', 'low'
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'dismissed'
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  dismissed_at TIMESTAMPTZ,
  UNIQUE(employee_id, program_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_training_programs_status ON public.training_programs(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_training_programs_category ON public.training_programs(category) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_training_sessions_program ON public.training_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON public.training_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_employee ON public.training_enrollments(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_program ON public.training_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_training_enrollments_status ON public.training_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_training_documents_program ON public.training_documents(program_id);
CREATE INDEX IF NOT EXISTS idx_training_documents_session ON public.training_documents(session_id);
CREATE INDEX IF NOT EXISTS idx_training_quizzes_program ON public.training_quizzes(program_id);
CREATE INDEX IF NOT EXISTS idx_training_quiz_attempts_employee ON public.training_quiz_attempts(employee_id);
CREATE INDEX IF NOT EXISTS idx_training_feedback_program ON public.training_feedback(program_id);
CREATE INDEX IF NOT EXISTS idx_training_feedback_employee ON public.training_feedback(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_competencies_employee ON public.employee_competencies(employee_id);
CREATE INDEX IF NOT EXISTS idx_course_recommendations_employee ON public.course_recommendations(employee_id);

-- =====================================================
-- ENABLE RLS
-- =====================================================

ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_recommendations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - TRAINING PROGRAMS
-- =====================================================

CREATE POLICY "Users can view active training programs" ON public.training_programs
FOR SELECT USING (
  deleted_at IS NULL AND (
    is_admin(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN features f ON f.id = rp.feature_id
      WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
    )
  )
);

CREATE POLICY "Admins can manage training programs" ON public.training_programs
FOR ALL USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'manage_training'
  )
);

-- =====================================================
-- RLS POLICIES - TRAINING SESSIONS
-- =====================================================

CREATE POLICY "Users can view training sessions" ON public.training_sessions
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  )
);

CREATE POLICY "Admins can manage training sessions" ON public.training_sessions
FOR ALL USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'manage_training'
  )
);

-- =====================================================
-- RLS POLICIES - TRAINING ENROLLMENTS
-- =====================================================

CREATE POLICY "Employees can view own enrollments" ON public.training_enrollments
FOR SELECT USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view enrollments with permission" ON public.training_enrollments
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  )
);

CREATE POLICY "Users can manage enrollments with permission" ON public.training_enrollments
FOR ALL USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'enroll_training'
  )
);

-- =====================================================
-- RLS POLICIES - TRAINING DOCUMENTS
-- =====================================================

CREATE POLICY "Users can view training documents" ON public.training_documents
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  ) OR
  EXISTS (
    SELECT 1 FROM training_enrollments te
    WHERE te.program_id = training_documents.program_id
    AND te.employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Admins can manage training documents" ON public.training_documents
FOR ALL USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'manage_training'
  )
);

-- =====================================================
-- RLS POLICIES - TRAINING QUIZZES
-- =====================================================

CREATE POLICY "Users can view training quizzes" ON public.training_quizzes
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  ) OR
  EXISTS (
    SELECT 1 FROM training_enrollments te
    WHERE te.program_id = training_quizzes.program_id
    AND te.employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
  )
);

CREATE POLICY "Admins can manage training quizzes" ON public.training_quizzes
FOR ALL USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'manage_training'
  )
);

-- =====================================================
-- RLS POLICIES - TRAINING QUIZ ATTEMPTS
-- =====================================================

CREATE POLICY "Employees can view own quiz attempts" ON public.training_quiz_attempts
FOR SELECT USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "Employees can create own quiz attempts" ON public.training_quiz_attempts
FOR INSERT WITH CHECK (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view quiz attempts with permission" ON public.training_quiz_attempts
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'grade_training'
  )
);

CREATE POLICY "Users can update quiz attempts with permission" ON public.training_quiz_attempts
FOR UPDATE USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'grade_training'
  )
);

-- =====================================================
-- RLS POLICIES - TRAINING FEEDBACK
-- =====================================================

CREATE POLICY "Employees can create own feedback" ON public.training_feedback
FOR INSERT WITH CHECK (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "Employees can view own feedback" ON public.training_feedback
FOR SELECT USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view feedback with permission" ON public.training_feedback
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  )
);

-- =====================================================
-- RLS POLICIES - TRAINING COMPETENCIES
-- =====================================================

CREATE POLICY "Users can view training competencies" ON public.training_competencies
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  )
);

CREATE POLICY "Admins can manage training competencies" ON public.training_competencies
FOR ALL USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'manage_training'
  )
);

-- =====================================================
-- RLS POLICIES - EMPLOYEE COMPETENCIES
-- =====================================================

CREATE POLICY "Employees can view own competencies" ON public.employee_competencies
FOR SELECT USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view competencies with permission" ON public.employee_competencies
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  )
);

CREATE POLICY "Users can manage competencies with permission" ON public.employee_competencies
FOR ALL USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'manage_training'
  )
);

-- =====================================================
-- RLS POLICIES - COURSE RECOMMENDATIONS
-- =====================================================

CREATE POLICY "Employees can view own recommendations" ON public.course_recommendations
FOR SELECT USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "Employees can dismiss own recommendations" ON public.course_recommendations
FOR UPDATE USING (
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid())
);

CREATE POLICY "Users can view recommendations with permission" ON public.course_recommendations
FOR SELECT USING (
  is_admin(auth.uid()) OR
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN features f ON f.id = rp.feature_id
    WHERE ur.user_id = auth.uid() AND f.code = 'view_training'
  )
);

CREATE POLICY "System can manage recommendations" ON public.course_recommendations
FOR ALL USING (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE TRIGGER update_training_programs_updated_at
  BEFORE UPDATE ON public.training_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at
  BEFORE UPDATE ON public.training_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_enrollments_updated_at
  BEFORE UPDATE ON public.training_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_documents_updated_at
  BEFORE UPDATE ON public.training_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_quizzes_updated_at
  BEFORE UPDATE ON public.training_quizzes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_competencies_updated_at
  BEFORE UPDATE ON public.employee_competencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();