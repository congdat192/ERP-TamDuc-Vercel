import { supabase } from '@/integrations/supabase/client';

export type DocumentType = 'contract' | 'id_card' | 'degree' | 'certificate' | 'health_record' | 'other';

export interface EmployeeDocument {
  id: string;
  employee_id: string;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  notes: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
  created_at: string;
}

export class DocumentService {
  /**
   * Validate document file
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Chỉ hỗ trợ file PDF, DOC, DOCX, JPG, PNG'
      };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Kích thước file không được vượt quá 10MB'
      };
    }

    return { isValid: true };
  }

  /**
   * Get documents by employee ID
   */
  static async getDocumentsByEmployee(employeeId: string): Promise<EmployeeDocument[]> {
    try {
      const { data, error } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching documents:', error);
        throw new Error(`Không thể tải danh sách chứng từ: ${error.message}`);
      }

      return (data || []) as EmployeeDocument[];
    } catch (error: any) {
      console.error('❌ Error in getDocumentsByEmployee:', error);
      throw error;
    }
  }

  /**
   * Upload document
   */
  static async uploadDocument(
    employeeId: string,
    file: File,
    documentType: DocumentType,
    notes?: string
  ): Promise<EmployeeDocument> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeId}-${documentType}-${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw new Error(`Không thể upload chứng từ: ${uploadError.message}`);
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Insert document record
      const { data, error: insertError } = await supabase
        .from('employee_documents')
        .insert({
          employee_id: employeeId,
          document_type: documentType,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          notes: notes || null,
          uploaded_by: user?.id || null
        })
        .select()
        .single();

      if (insertError) {
        // Rollback: delete uploaded file
        await supabase.storage
          .from('employee-documents')
          .remove([filePath]);

        console.error('❌ Insert error:', insertError);
        throw new Error(`Không thể lưu thông tin chứng từ: ${insertError.message}`);
      }

      console.log('✅ Document uploaded successfully:', data);
      return data as EmployeeDocument;
    } catch (error: any) {
      console.error('❌ Error uploading document:', error);
      throw error;
    }
  }

  /**
   * Delete document
   */
  static async deleteDocument(documentId: string): Promise<void> {
    try {
      // Get document info first
      const { data: doc, error: fetchError } = await supabase
        .from('employee_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        console.error('❌ Fetch error:', fetchError);
        throw new Error(`Không thể tải thông tin chứng từ: ${fetchError.message}`);
      }

      // Delete from Storage
      const { error: storageError } = await supabase.storage
        .from('employee-documents')
        .remove([doc.file_path]);

      if (storageError) {
        console.error('❌ Storage delete error:', storageError);
        // Continue even if storage delete fails
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        console.error('❌ Delete error:', deleteError);
        throw new Error(`Không thể xóa chứng từ: ${deleteError.message}`);
      }

      console.log('✅ Document deleted successfully:', documentId);
    } catch (error: any) {
      console.error('❌ Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Get signed URL for document download
   */
  static async getDocumentUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .createSignedUrl(filePath, 60); // 60 seconds expiry

      if (error) {
        console.error('❌ Error creating signed URL:', error);
        throw new Error(`Không thể tạo link tải: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error: any) {
      console.error('❌ Error in getDocumentUrl:', error);
      throw error;
    }
  }

  /**
   * Get signed URL with longer expiry for preview
   */
  static async getPreviewUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry for preview

      if (error) {
        console.error('❌ Error creating preview URL:', error);
        throw new Error(`Không thể tạo link preview: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error: any) {
      console.error('❌ Error in getPreviewUrl:', error);
      throw error;
    }
  }

  /**
   * Check if document can be previewed
   */
  static canPreview(mimeType: string | null): boolean {
    if (!mimeType) return false;
    
    const previewableTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    return previewableTypes.includes(mimeType);
  }

  /**
   * Get document type label
   */
  static getDocumentTypeLabel(type: DocumentType): string {
    const labels: Record<DocumentType, string> = {
      contract: 'Hợp đồng lao động',
      id_card: 'CCCD/CMND',
      degree: 'Bằng cấp',
      certificate: 'Chứng chỉ',
      health_record: 'Hồ sơ sức khỏe',
      other: 'Khác'
    };
    return labels[type] || type;
  }

  /**
   * Format file size
   */
  static formatFileSize(bytes: number | null): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}
