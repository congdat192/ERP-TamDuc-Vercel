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
      .from('training_quizzes')
      .select('*')
      .eq('program_id', programId)
      .order('quiz_type', { ascending: true });

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể tải danh sách quiz: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quizzes loaded:', data?.length);
    return data || [];
  }

  static async createQuiz(quizData: CreateQuizData): Promise<TrainingQuiz> {
    console.log('🔍 [TrainingQuizService] Creating quiz:', quizData.title);

    const { data, error } = await supabase
      .from('training_quizzes')
      .insert(quizData)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền tạo quiz');
      throw new Error(`Không thể tạo quiz: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz created:', data.id);
    return data;
  }

  static async updateQuiz(quizId: string, updates: Partial<CreateQuizData>): Promise<TrainingQuiz> {
    console.log('🔍 [TrainingQuizService] Updating quiz:', quizId);

    const { data, error } = await supabase
      .from('training_quizzes')
      .update(updates)
      .eq('id', quizId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể cập nhật quiz: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz updated');
    return data;
  }

  static async deleteQuiz(quizId: string): Promise<void> {
    console.log('🔍 [TrainingQuizService] Deleting quiz:', quizId);

    const { error } = await supabase
      .from('training_quizzes')
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
      .from('training_quiz_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('quiz_id', quizId)
      .eq('enrollment_id', enrollmentId);

    const attemptNumber = (count || 0) + 1;

    // Check max attempts
    const { data: quiz } = await supabase
      .from('training_quizzes')
      .select('max_attempts')
      .eq('id', quizId)
      .single();

    if (quiz && quiz.max_attempts > 0 && attemptNumber > quiz.max_attempts) {
      throw new Error(`Đã vượt quá số lần làm bài cho phép (${quiz.max_attempts})`);
    }

    const { data, error } = await supabase
      .from('training_quiz_attempts')
      .insert({
        quiz_id: quizId,
        enrollment_id: enrollmentId,
        employee_id: employeeId,
        attempt_number: attemptNumber
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể bắt đầu làm bài: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz attempt started:', data.id);
    return data;
  }

  static async submitQuizAttempt(attemptId: string, submitData: SubmitQuizData): Promise<QuizAttempt> {
    console.log('🔍 [TrainingQuizService] Submitting quiz attempt:', attemptId);

    // Calculate score
    const score = this.calculateScore(submitData.answers);

    // Get quiz passing score
    const { data: attempt } = await supabase
      .from('training_quiz_attempts')
      .select('quiz_id')
      .eq('id', attemptId)
      .single();

    const { data: quiz } = await supabase
      .from('training_quizzes')
      .select('passing_score')
      .eq('id', attempt?.quiz_id)
      .single();

    const passed = score >= (quiz?.passing_score || 70);

    const { data, error } = await supabase
      .from('training_quiz_attempts')
      .update({
        submitted_at: new Date().toISOString(),
        answers: submitData.answers,
        score,
        passed,
        time_spent_minutes: submitData.time_spent_minutes
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể nộp bài: ${error.message}`);
    }

    console.log('✅ [TrainingQuizService] Quiz attempt submitted, score:', score);
    return data;
  }

  static async getAttemptsByEnrollment(enrollmentId: string): Promise<QuizAttempt[]> {
    console.log('🔍 [TrainingQuizService] Fetching attempts for enrollment:', enrollmentId);

    const { data, error } = await supabase
      .from('training_quiz_attempts')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .order('attempt_number', { ascending: true });

    if (error) {
      console.error('❌ [TrainingQuizService] Error:', error);
      throw new Error(`Không thể tải lịch sử làm bài: ${error.message}`);
    }

    return data || [];
  }

  static async getBestScore(quizId: string, enrollmentId: string): Promise<number> {
    const { data } = await supabase.rpc('get_best_quiz_score', {
      p_quiz_id: quizId,
      p_enrollment_id: enrollmentId
    });

    return data || 0;
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
