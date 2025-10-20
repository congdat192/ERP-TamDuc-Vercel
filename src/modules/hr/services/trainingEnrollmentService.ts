import { supabase } from '@/integrations/supabase/client';

export interface TrainingEnrollment {
  id: string;
  session_id: string;
  employee_id: string;
  program_id: string;
  enrollment_type: 'mandatory' | 'optional' | 'self_registered';
  enrolled_date: string;
  attendance_rate?: number;
  pre_test_score?: number;
  post_test_score?: number;
  final_score?: number;
  status: 'enrolled' | 'in_progress' | 'completed' | 'failed' | 'dropped';
  completion_date?: string;
  certificate_url?: string;
  trainer_remarks?: string;
  created_at: string;
  updated_at: string;
  employees?: any;
  training_sessions?: any;
  training_programs?: any;
}

export interface CreateEnrollmentData {
  session_id: string;
  employee_id: string;
  program_id: string;
  enrollment_type: 'mandatory' | 'optional' | 'self_registered';
}

export interface UpdateEnrollmentScores {
  pre_test_score?: number;
  post_test_score?: number;
  final_score?: number;
  attendance_rate?: number;
  trainer_remarks?: string;
}

export class TrainingEnrollmentService {
  static async getEnrollments(filters?: { sessionId?: string; employeeId?: string; programId?: string }): Promise<TrainingEnrollment[]> {
    console.log('🔍 [TrainingEnrollmentService] Fetching enrollments', filters);

    let query = supabase
      .from('training_enrollments' as any)
      .select(`
        *,
        employees(full_name, employee_code, email, department, position),
        training_sessions(session_name, start_date, end_date),
        training_programs(title, course_category)
      `)
      .order('enrolled_date', { ascending: false });

    if (filters?.sessionId) query = query.eq('session_id', filters.sessionId);
    if (filters?.employeeId) query = query.eq('employee_id', filters.employeeId);
    if (filters?.programId) query = query.eq('program_id', filters.programId);

    const { data, error } = await query;

    if (error) {
      console.error('❌ [TrainingEnrollmentService] Error:', error);
      throw new Error(`Không thể tải danh sách học viên: ${error.message}`);
    }

    console.log('✅ [TrainingEnrollmentService] Enrollments loaded:', data?.length);
    return (data || []) as TrainingEnrollment[];
  }

  static async createEnrollment(enrollmentData: CreateEnrollmentData): Promise<TrainingEnrollment> {
    console.log('🔍 [TrainingEnrollmentService] Creating enrollment');

    const { data, error } = await supabase
      .from('training_enrollments' as any)
      .insert({
        ...enrollmentData,
        status: 'enrolled'
      } as any)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingEnrollmentService] Error:', error);
      if (error.code === '23505') throw new Error('Nhân viên đã được gán vào lớp học này');
      if (error.code === '42501') throw new Error('Không có quyền gán học viên');
      throw new Error(`Không thể gán học viên: ${error.message}`);
    }

    // Update session participant count
    await this.updateSessionParticipantCount(enrollmentData.session_id);

    console.log('✅ [TrainingEnrollmentService] Enrollment created:', data.id);
    return data as TrainingEnrollment;
  }

  static async bulkCreateEnrollments(enrollments: CreateEnrollmentData[]): Promise<void> {
    console.log('🔍 [TrainingEnrollmentService] Bulk creating enrollments:', enrollments.length);

    const { error } = await supabase
      .from('training_enrollments' as any)
      .insert(
        enrollments.map(e => ({
          ...e,
          status: 'enrolled'
        })) as any
      );

    if (error) {
      console.error('❌ [TrainingEnrollmentService] Error:', error);
      if (error.code === '23505') throw new Error('Một số nhân viên đã được gán vào lớp học này');
      throw new Error(`Không thể gán học viên: ${error.message}`);
    }

    // Update session participant count
    if (enrollments.length > 0) {
      await this.updateSessionParticipantCount(enrollments[0].session_id);
    }

    console.log('✅ [TrainingEnrollmentService] Bulk enrollments created');
  }

  static async updateEnrollmentScores(enrollmentId: string, scores: UpdateEnrollmentScores): Promise<TrainingEnrollment> {
    console.log('🔍 [TrainingEnrollmentService] Updating enrollment scores:', enrollmentId);

    const { data, error } = await supabase
      .from('training_enrollments' as any)
      .update(scores as any)
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingEnrollmentService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền cập nhật điểm');
      throw new Error(`Không thể cập nhật điểm: ${error.message}`);
    }

    console.log('✅ [TrainingEnrollmentService] Enrollment scores updated');
    return data as TrainingEnrollment;
  }

  static async completeEnrollment(enrollmentId: string, finalScore: number, certificateUrl?: string): Promise<TrainingEnrollment> {
    console.log('🔍 [TrainingEnrollmentService] Completing enrollment:', enrollmentId);

    const status = finalScore >= 70 ? 'completed' : 'failed';

    const { data, error } = await supabase
      .from('training_enrollments' as any)
      .update({
        final_score: finalScore,
        status,
        completion_date: new Date().toISOString(),
        certificate_url: certificateUrl
      } as any)
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingEnrollmentService] Error:', error);
      throw new Error(`Không thể hoàn thành khóa học: ${error.message}`);
    }

    console.log('✅ [TrainingEnrollmentService] Enrollment completed');
    return data as TrainingEnrollment;
  }

  static async deleteEnrollment(enrollmentId: string): Promise<void> {
    console.log('🔍 [TrainingEnrollmentService] Deleting enrollment:', enrollmentId);

    // Get session_id before delete
    const { data: enrollment } = await supabase
      .from('training_enrollments' as any)
      .select('session_id')
      .eq('id', enrollmentId)
      .maybeSingle();

    const { error } = await supabase
      .from('training_enrollments' as any)
      .delete()
      .eq('id', enrollmentId);

    if (error) {
      console.error('❌ [TrainingEnrollmentService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền xóa học viên');
      throw new Error(`Không thể xóa học viên: ${error.message}`);
    }

    // Update session participant count
    if (enrollment?.session_id) {
      await this.updateSessionParticipantCount(enrollment.session_id);
    }

    console.log('✅ [TrainingEnrollmentService] Enrollment deleted');
  }

  private static async updateSessionParticipantCount(sessionId: string): Promise<void> {
    const { count } = await supabase
      .from('training_enrollments' as any)
      .select('id', { count: 'exact', head: true })
      .eq('session_id', sessionId);

    await supabase
      .from('training_sessions' as any)
      .update({ current_participants: count || 0 } as any)
      .eq('id', sessionId);
  }
}
