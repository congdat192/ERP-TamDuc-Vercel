import { supabase } from '@/integrations/supabase/client';

export interface TrainingDocument {
  id: string;
  program_id: string;
  session_id?: string;
  document_type: 'video' | 'slide' | 'reading' | 'exercise';
  title: string;
  description?: string;
  file_url?: string;
  embed_url?: string;
  file_size?: number;
  mime_type?: string;
  duration_minutes?: number;
  is_required: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentData {
  program_id: string;
  session_id?: string;
  document_type: 'video' | 'slide' | 'reading' | 'exercise';
  title: string;
  description?: string;
  file_url?: string;
  embed_url?: string;
  duration_minutes?: number;
  is_required?: boolean;
  display_order?: number;
}

export class TrainingDocumentService {
  static async getDocumentsByProgram(programId: string): Promise<TrainingDocument[]> {
    console.log('🔍 [TrainingDocumentService] Fetching documents for program:', programId);

    const { data, error } = await supabase
      .from('training_documents' as any)
      .select('*')
      .eq('program_id', programId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ [TrainingDocumentService] Error:', error);
      throw new Error(`Không thể tải danh sách tài liệu: ${error.message}`);
    }

    return (data || []) as unknown as TrainingDocument[];
  }

  static async getDocumentsBySession(sessionId: string): Promise<TrainingDocument[]> {
    console.log('🔍 [TrainingDocumentService] Fetching documents for session:', sessionId);

    const { data, error } = await supabase
      .from('training_documents' as any)
      .select('*')
      .eq('session_id', sessionId)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ [TrainingDocumentService] Error:', error);
      throw new Error(`Không thể tải danh sách tài liệu: ${error.message}`);
    }

    return (data || []) as unknown as TrainingDocument[];
  }

  static async createDocument(docData: CreateDocumentData): Promise<TrainingDocument> {
    console.log('🔍 [TrainingDocumentService] Creating document:', docData.title);

    const { data, error } = await supabase
      .from('training_documents' as any)
      .insert({
        ...docData,
        is_required: docData.is_required ?? true,
        display_order: docData.display_order ?? 0
      } as any)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingDocumentService] Error:', error);
      if (error.code === '42501') throw new Error('Không có quyền tạo tài liệu');
      throw new Error(`Không thể tạo tài liệu: ${error.message}`);
    }

    console.log('✅ [TrainingDocumentService] Document created');
    return data as unknown as TrainingDocument;
  }

  static async updateDocument(docId: string, updates: Partial<CreateDocumentData>): Promise<TrainingDocument> {
    console.log('🔍 [TrainingDocumentService] Updating document:', docId);

    const { data, error } = await supabase
      .from('training_documents' as any)
      .update(updates as any)
      .eq('id', docId)
      .select()
      .single();

    if (error) {
      console.error('❌ [TrainingDocumentService] Error:', error);
      throw new Error(`Không thể cập nhật tài liệu: ${error.message}`);
    }

    console.log('✅ [TrainingDocumentService] Document updated');
    return data as unknown as TrainingDocument;
  }

  static async deleteDocument(docId: string): Promise<void> {
    console.log('🔍 [TrainingDocumentService] Deleting document:', docId);

    const { error } = await supabase
      .from('training_documents' as any)
      .delete()
      .eq('id', docId);

    if (error) {
      console.error('❌ [TrainingDocumentService] Error:', error);
      throw new Error(`Không thể xóa tài liệu: ${error.message}`);
    }

    console.log('✅ [TrainingDocumentService] Document deleted');
  }
}
