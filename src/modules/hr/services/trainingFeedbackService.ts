import { supabase } from '@/integrations/supabase/client';

export interface TrainingFeedback {
  id: string;
  enrollment_id: string;
  employee_id: string;
  session_id: string;
  program_id: string;
  trainer_rating?: number;
  content_rating?: number;
  facility_rating?: number;
  overall_rating?: number;
  comments?: string;
  suggestions?: string;
  created_at: string;
  employees?: any;
  training_sessions?: any;
  training_programs?: any;
}

export interface CreateFeedbackData {
  enrollment_id: string;
  employee_id: string;
  session_id: string;
  program_id: string;
  trainer_rating?: number;
  content_rating?: number;
  facility_rating?: number;
  overall_rating?: number;
  comments?: string;
  suggestions?: string;
}

export class TrainingFeedbackService {
  static async getFeedbackBySession(sessionId: string): Promise<TrainingFeedback[]> {
    console.log('🔍 [TrainingFeedbackService] Fetching feedback for session:', sessionId);

    const { data, error } = await supabase
      .from('training_feedbacks' as any)
      .select(`
        *,
        employees(full_name, employee_code),
        training_sessions(session_name),
        training_programs(title)
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [TrainingFeedbackService] Error:', error);
      throw new Error(`Không thể tải feedback: ${error.message}`);
    }

    return (data || []) as unknown as TrainingFeedback[];
  }

  static async getFeedbackByProgram(programId: string): Promise<TrainingFeedback[]> {
    console.log('🔍 [TrainingFeedbackService] Fetching feedback for program:', programId);

    const { data, error } = await supabase
      .from('training_feedbacks' as any)
      .select(`
        *,
        employees(full_name, employee_code),
        training_sessions(session_name),
        training_programs(title)
      `)
      .eq('program_id', programId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [TrainingFeedbackService] Error:', error);
      throw new Error(`Không thể tải feedback: ${error.message}`);
    }

    return (data || []) as unknown as TrainingFeedback[];
  }

  static async getMyFeedback(employeeId: string): Promise<TrainingFeedback[]> {
    console.log('🔍 [TrainingFeedbackService] Fetching feedback for employee:', employeeId);

    const { data, error } = await supabase
      .from('training_feedbacks' as any)
      .select(`
        *,
        training_sessions(session_name),
        training_programs(title)
      `)
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [TrainingFeedbackService] Error:', error);
      throw new Error(`Không thể tải feedback: ${error.message}`);
    }

    return (data || []) as unknown as TrainingFeedback[];
  }

  static async createFeedback(feedbackData: CreateFeedbackData): Promise<TrainingFeedback> {
    console.log('🔍 [TrainingFeedbackService] Creating feedback');

    // Calculate overall rating as average
    const ratings = [
      feedbackData.trainer_rating,
      feedbackData.content_rating,
      feedbackData.facility_rating
    ].filter(r => r !== undefined) as number[];

    const overall_rating = ratings.length > 0
      ? Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length)
      : undefined;

    const { data, error } = await supabase
      .from('training_feedbacks' as any)
      .insert({
        ...feedbackData,
        overall_rating
      } as any)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingFeedbackService] Error:', error);
      if (error.code === '23505') throw new Error('Bạn đã gửi feedback cho khóa học này');
      throw new Error(`Không thể gửi feedback: ${error.message}`);
    }

    console.log('✅ [TrainingFeedbackService] Feedback created');
    return data as unknown as TrainingFeedback;
  }

  static async updateFeedback(feedbackId: string, updates: Partial<CreateFeedbackData>): Promise<TrainingFeedback> {
    console.log('🔍 [TrainingFeedbackService] Updating feedback:', feedbackId);

    // Recalculate overall rating if any rating changed
    let overall_rating: number | undefined;
    if (updates.trainer_rating || updates.content_rating || updates.facility_rating) {
      const ratings = [
        updates.trainer_rating,
        updates.content_rating,
        updates.facility_rating
      ].filter(r => r !== undefined) as number[];

      if (ratings.length > 0) {
        overall_rating = Math.round(ratings.reduce((sum, r) => sum + r, 0) / ratings.length);
      }
    }

    const { data, error } = await supabase
      .from('training_feedbacks' as any)
      .update({
        ...updates,
        ...(overall_rating !== undefined && { overall_rating })
      } as any)
      .eq('id', feedbackId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingFeedbackService] Error:', error);
      throw new Error(`Không thể cập nhật feedback: ${error.message}`);
    }

    console.log('✅ [TrainingFeedbackService] Feedback updated');
    return data as unknown as TrainingFeedback;
  }

  static async deleteFeedback(feedbackId: string): Promise<void> {
    console.log('🔍 [TrainingFeedbackService] Deleting feedback:', feedbackId);

    const { error } = await supabase
      .from('training_feedbacks' as any)
      .delete()
      .eq('id', feedbackId);

    if (error) {
      console.error('❌ [TrainingFeedbackService] Error:', error);
      throw new Error(`Không thể xóa feedback: ${error.message}`);
    }

    console.log('✅ [TrainingFeedbackService] Feedback deleted');
  }
}
