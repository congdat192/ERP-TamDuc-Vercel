import { supabase } from '@/integrations/supabase/client';

export interface TrainingQuiz {
  id: string;
  program_id: string;
  quiz_type: 'pre_test' | 'post_test' | 'mid_test';
  title: string;
  description?: string;
  total_questions: number;
  questions?: any; // JSONB
  passing_score: number;
  time_limit_minutes?: number;
  max_attempts: number;
  score_policy: 'best' | 'latest' | 'average';
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  enrollment_id: string;
  employee_id: string;
  attempt_number: number;
  started_at: string;
  submitted_at?: string;
  answers?: any; // JSONB
  score?: number;
  passed?: boolean;
  time_spent_minutes?: number;
}

export interface CreateQuizData {
  program_id: string;
  quiz_type: 'pre_test' | 'post_test' | 'mid_test';
  title: string;
  description?: string;
  total_questions: number;
  questions: any[];
  passing_score?: number;
  time_limit_minutes?: number;
  max_attempts?: number;
  score_policy?: 'best' | 'latest' | 'average';
}

export interface SubmitQuizData {
  answers: any[];
  time_spent_minutes: number;
}

export class TrainingQuizService {
  static async getQuizzesByProgram(programId: string): Promise<TrainingQuiz[]> {
    console.log('🔍 [TrainingQuizService] Fetching quizzes for program:', programId);

    const { data, error } = await supabase
      .from('training_quizzes' as any)
      .select('*')
      .eq('program_id', programId)
      .order('quiz_type', { ascending: true });

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể tải danh sách quiz: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quizzes loaded:', data?.length);
    return (data || []) as unknown as TrainingQuiz[];
  }

  static async createQuiz(quizData: CreateQuizData): Promise<TrainingQuiz> {
    console.log('🔍 [TrainingQuizService] Creating quiz:', quizData.title);

    const { data, error } = await supabase
      .from('training_quizzes' as any)
      .insert(quizData as any)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền tạo quiz');
      throw new Error(`Không thể tạo quiz: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz created:', (data as any).id);
    return data as unknown as TrainingQuiz;
  }

  static async updateQuiz(quizId: string, updates: Partial<CreateQuizData>): Promise<TrainingQuiz> {
    console.log('🔍 [TrainingQuizService] Updating quiz:', quizId);

    const { data, error } = await supabase
      .from('training_quizzes' as any)
      .update(updates as any)
      .eq('id', quizId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể cập nhật quiz: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz updated');
    return data as unknown as TrainingQuiz;
  }

  static async deleteQuiz(quizId: string): Promise<void> {
    console.log('🔍 [TrainingQuizService] Deleting quiz:', quizId);

    const { error } = await supabase
      .from('training_quizzes' as any)
      .delete()
      .eq('id', quizId);

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể xóa quiz: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz deleted');
  }

  static async startQuizAttempt(quizId: string, enrollmentId: string, employeeId: string): Promise<QuizAttempt> {
    console.log('🔍 [TrainingQuizService] Starting quiz attempt');

    // Get current attempt count
    const { count } = await supabase
      .from('training_quiz_attempts' as any)
      .select('id', { count: 'exact', head: true })
      .eq('quiz_id', quizId)
      .eq('enrollment_id', enrollmentId);

    const attemptNumber = (count || 0) + 1;

    // Check max attempts
    const { data: quiz } = await supabase
      .from('training_quizzes' as any)
      .select('max_attempts')
      .eq('id', quizId)
      .single();

    const quizData = quiz as any;
    if (quizData && quizData.max_attempts > 0 && attemptNumber > quizData.max_attempts) {
      throw new Error(`Đã vượt quá số lần làm bài cho phép (${quizData.max_attempts})`);
    }

    const { data, error } = await supabase
      .from('training_quiz_attempts' as any)
      .insert({
        quiz_id: quizId,
        enrollment_id: enrollmentId,
        employee_id: employeeId,
        attempt_number: attemptNumber
      } as any)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể bắt đầu làm bài: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz attempt started:', (data as any).id);
    return data as unknown as QuizAttempt;
  }

  static async submitQuizAttempt(attemptId: string, submitData: SubmitQuizData): Promise<QuizAttempt> {
    console.log('🔍 [TrainingQuizService] Submitting quiz attempt:', attemptId);

    // Calculate score
    const score = this.calculateScore(submitData.answers);

    // Get quiz passing score
    const { data: attempt } = await supabase
      .from('training_quiz_attempts' as any)
      .select('quiz_id')
      .eq('id', attemptId)
      .single();

    const attemptData = attempt as any;
    const { data: quiz } = await supabase
      .from('training_quizzes' as any)
      .select('passing_score')
      .eq('id', attemptData?.quiz_id)
      .single();

    const quizData = quiz as any;
    const passed = score >= (quizData?.passing_score || 70);

    const { data, error } = await supabase
      .from('training_quiz_attempts' as any)
      .update({
        submitted_at: new Date().toISOString(),
        answers: submitData.answers,
        score,
        passed,
        time_spent_minutes: submitData.time_spent_minutes
      } as any)
      .eq('id', attemptId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể nộp bài: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz attempt submitted, score:', score);
    return data as unknown as QuizAttempt;
  }

  static async getAttemptsByEnrollment(enrollmentId: string): Promise<QuizAttempt[]> {
    console.log('🔍 [TrainingQuizService] Fetching attempts for enrollment:', enrollmentId);

    const { data, error } = await supabase
      .from('training_quiz_attempts' as any)
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('attempt_number', { ascending: true });

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể tải lịch sử làm bài: ${error.message}`);
    }

    return (data || []) as unknown as QuizAttempt[];
  }

  static async getBestScore(quizId: string, enrollmentId: string): Promise<number> {
    // Temporarily calculate directly instead of using RPC (RPC will be created later)
    const { data } = await supabase
      .from('training_quiz_attempts' as any)
      .select('score')
      .eq('quiz_id', quizId)
      .eq('enrollment_id', enrollmentId)
      .order('score', { ascending: false })
      .limit(1)
      .maybeSingle();

    return ((data as any)?.score as number) || 0;
  }

  private static calculateScore(answers: any[]): number {
    if (!answers || answers.length === 0) return 0;

    const totalPoints = answers.reduce((sum, answer) => {
      return sum + (answer.is_correct ? (answer.points_earned || 0) : 0);
    }, 0);

    const maxPoints = answers.reduce((sum, answer) => {
      return sum + (answer.points_earned || 0);
    }, 0);

    return maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
  }
}
