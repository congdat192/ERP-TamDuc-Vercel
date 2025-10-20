import { supabase } from '@/integrations/supabase/client';

export interface TrainingSession {
  id: string;
  program_id: string;
  session_name: string;
  trainer_id?: string;
  start_date: string;
  end_date: string;
  location?: string;
  location_type?: 'offline' | 'online' | 'hybrid';
  meeting_url?: string;
  max_participants?: number;
  current_participants: number;
  status: 'draft' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  training_programs?: any;
  training_trainers?: any;
}

export interface CreateSessionData {
  program_id: string;
  session_name: string;
  trainer_id?: string;
  start_date: string;
  end_date: string;
  location?: string;
  location_type?: 'offline' | 'online' | 'hybrid';
  meeting_url?: string;
  max_participants?: number;
}

export class TrainingSessionService {
  static async getSessions(programId?: string): Promise<TrainingSession[]> {
    console.log('🔍 [TrainingSessionService] Fetching sessions');

    let query = supabase
      .from('training_sessions' as any)
      .select('*, training_programs(title), training_trainers(full_name, email)')
      .order('start_date', { ascending: false });

    if (programId) {
      query = query.eq('program_id', programId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ [TrainingSessionService] Error:', error);
      throw new Error(`Không thể tải danh sách lớp học: ${error.message}`);
    }

    console.log('✅ [TrainingSessionService] Sessions loaded:', data?.length);
    return (data || []) as unknown as TrainingSession[];
  }

  static async getSessionById(sessionId: string): Promise<TrainingSession> {
    console.log('🔍 [TrainingSessionService] Fetching session:', sessionId);

    const { data, error } = await supabase
      .from('training_sessions' as any)
      .select('*, training_programs(title, description), training_trainers(full_name, email, phone)')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('❌ [TrainingSessionService] Error:', error);
      throw new Error(`Không thể tải lớp học: ${error.message}`);
    }

    return data as unknown as TrainingSession;
  }

  static async createSession(sessionData: CreateSessionData): Promise<TrainingSession> {
    console.log('🔍 [TrainingSessionService] Creating session:', sessionData.session_name);

    const { data, error } = await supabase
      .from('training_sessions' as any)
      .insert({
        ...sessionData,
        status: 'scheduled',
        current_participants: 0
      } as any)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingSessionService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền tạo lớp học');
      if (error.code === '23503') throw new Error('Chương trình hoặc giảng viên không tồn tại');
      throw new Error(`Không thể tạo lớp học: ${error.message}`);
    }

    console.log('✅ [TrainingSessionService] Session created:', (data as any).id);
    return data as unknown as TrainingSession;
  }

  static async updateSession(sessionId: string, updates: Partial<CreateSessionData>): Promise<TrainingSession> {
    console.log('🔍 [TrainingSessionService] Updating session:', sessionId);

    const { data, error } = await supabase
      .from('training_sessions' as any)
      .update(updates as any)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingSessionService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền sửa lớp học');
      throw new Error(`Không thể cập nhật lớp học: ${error.message}`);
    }

    console.log('✅ [TrainingSessionService] Session updated');
    return data as unknown as TrainingSession;
  }

  static async deleteSession(sessionId: string): Promise<void> {
    console.log('🔍 [TrainingSessionService] Deleting session:', sessionId);

    const { error } = await supabase
      .from('training_sessions' as any)
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('❌ [TrainingSessionService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền xóa lớp học');
      if (error.code === '23503') throw new Error('Không thể xóa lớp học đã có học viên');
      throw new Error(`Không thể xóa lớp học: ${error.message}`);
    }

    console.log('✅ [TrainingSessionService] Session deleted');
  }

  static async updateSessionStatus(sessionId: string, status: TrainingSession['status']): Promise<void> {
    console.log('🔍 [TrainingSessionService] Updating session status:', sessionId, status);

    const { error } = await supabase
      .from('training_sessions' as any)
      .update({ status } as any)
      .eq('id', sessionId);

    if (error) {
      console.error('❌ [TrainingSessionService] Error:', error);
      throw new Error(`Không thể cập nhật trạng thái: ${error.message}`);
    }

    console.log('✅ [TrainingSessionService] Session status updated');
  }
}
