import { supabase } from '@/integrations/supabase/client';

export interface TrainingProgram {
  id: string;
  title: string;
  description?: string;
  program_type: 'internal' | 'external' | 'hybrid';
  course_category?: string;
  duration_hours: number;
  start_date?: string;
  end_date?: string;
  status: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  competency_name?: string;
  target_competency_level?: number;
  min_score_for_competency_up?: number;
  cost_per_participant?: number;
  syllabus_url?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProgramData {
  title: string;
  description?: string;
  program_type: 'internal' | 'external' | 'hybrid';
  course_category?: string;
  duration_hours: number;
  start_date?: string;
  end_date?: string;
  competency_name?: string;
  target_competency_level?: number;
  min_score_for_competency_up?: number;
  cost_per_participant?: number;
  syllabus_url?: string;
}

export class TrainingProgramService {
  static async getPrograms(): Promise<TrainingProgram[]> {
    console.log('🔍 [TrainingProgramService] Fetching programs');

    const { data, error } = await supabase
      .from('training_programs' as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [TrainingProgramService] Error:', error);
      throw new Error(`Không thể tải danh sách chương trình: ${error.message}`);
    }

    console.log('✅ [TrainingProgramService] Programs loaded:', data?.length);
    return (data || []) as unknown as TrainingProgram[];
  }

  static async getProgramById(programId: string): Promise<TrainingProgram> {
    console.log('🔍 [TrainingProgramService] Fetching program:', programId);

    const { data, error } = await supabase
      .from('training_programs' as any)
      .select('*')
      .eq('id', programId)
      .maybeSingle();

    if (error) {
      console.error('❌ [TrainingProgramService] Error:', error);
      throw new Error(`Không thể tải chương trình: ${error.message}`);
    }

    if (!data) {
      throw new Error('Không tìm thấy chương trình');
    }

    return data as unknown as TrainingProgram;
  }

  static async createProgram(programData: CreateProgramData): Promise<TrainingProgram> {
    console.log('🔍 [TrainingProgramService] Creating program:', programData.title);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Chưa đăng nhập');

    const { data, error } = await supabase
      .from('training_programs' as any)
      .insert({
        ...programData,
        created_by: user.id,
        status: 'draft'
      } as any)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingProgramService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền tạo chương trình');
      throw new Error(`Không thể tạo chương trình: ${error.message}`);
    }

    console.log('✅ [TrainingProgramService] Program created:', data.id);
    return data as unknown as TrainingProgram;
  }

  static async updateProgram(programId: string, updates: Partial<CreateProgramData>): Promise<TrainingProgram> {
    console.log('🔍 [TrainingProgramService] Updating program:', programId);

    const { data, error } = await supabase
      .from('training_programs' as any)
      .update(updates as any)
      .eq('id', programId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingProgramService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền sửa chương trình');
      throw new Error(`Không thể cập nhật chương trình: ${error.message}`);
    }

    console.log('✅ [TrainingProgramService] Program updated');
    return data as unknown as TrainingProgram;
  }

  static async deleteProgram(programId: string): Promise<void> {
    console.log('🔍 [TrainingProgramService] Deleting program:', programId);

    const { error } = await supabase
      .from('training_programs' as any)
      .delete()
      .eq('id', programId);

    if (error) {
      console.error('❌ [TrainingProgramService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền xóa chương trình');
      if (error.code === '23503') throw new Error('Không thể xóa chương trình đang có lớp học');
      throw new Error(`Không thể xóa chương trình: ${error.message}`);
    }

    console.log('✅ [TrainingProgramService] Program deleted');
  }

  static async updateProgramStatus(programId: string, status: TrainingProgram['status']): Promise<void> {
    console.log('🔍 [TrainingProgramService] Updating program status:', programId, status);

    const { error } = await supabase
      .from('training_programs' as any)
      .update({ status } as any)
      .eq('id', programId);

    if (error) {
      console.error('❌ [TrainingProgramService] Error:', error);
      throw new Error(`Không thể cập nhật trạng thái: ${error.message}`);
    }

    console.log('✅ [TrainingProgramService] Program status updated');
  }
}
