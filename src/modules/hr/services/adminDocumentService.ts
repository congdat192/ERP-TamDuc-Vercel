import { supabase } from '@/integrations/supabase/client';
import type {
  AdministrativeDocument,
  CreateDocumentData,
  UpdateDocumentData,
  DocumentVersion,
  DocumentFilters,
  DocumentStats,
} from '../types/administration';

export class AdminDocumentService {
  /**
   * Get all documents with filters
   */
  static async getDocuments(filters?: DocumentFilters): Promise<AdministrativeDocument[]> {
    try {
      let query = supabase
        .from('administrative_documents')
        .select(`
          *,
          employee:employees!fk_administrative_documents_employee(full_name, employee_code, position, department)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters) {
        if (filters.doc_type && filters.doc_type !== 'all') {
          query = query.eq('doc_type', filters.doc_type);
        }
        if (filters.status && filters.status !== 'all') {
          query = query.eq('status', filters.status);
        }
        if (filters.employee_id) {
          query = query.eq('employee_id', filters.employee_id);
        }
        if (filters.search) {
          query = query.or(`doc_no.ilike.%${filters.search}%,subject.ilike.%${filters.search}%`);
        }
        if (filters.date_from) {
          query = query.gte('issue_date', filters.date_from);
        }
        if (filters.date_to) {
          query = query.lte('issue_date', filters.date_to);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching documents:', error);
        throw new Error(`Không thể tải danh sách văn bản: ${error.message}`);
      }

      return (data || []) as AdministrativeDocument[];
    } catch (error: any) {
      console.error('❌ Error in getDocuments:', error);
      throw error;
    }
  }

  /**
   * Get document by ID
   */
  static async getDocumentById(id: string): Promise<AdministrativeDocument> {
    try {
      const { data, error } = await supabase
        .from('administrative_documents')
        .select(`
          *,
          employee:employees!fk_administrative_documents_employee(full_name, employee_code, position, department)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching document:', error);
        throw new Error(`Không thể tải văn bản: ${error.message}`);
      }

      return data as AdministrativeDocument;
    } catch (error: any) {
      console.error('❌ Error in getDocumentById:', error);
      throw error;
    }
  }

  /**
   * Create new document (doc_no will be auto-generated)
   */
  static async createDocument(data: CreateDocumentData): Promise<AdministrativeDocument> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      const { data: doc, error } = await supabase
        .from('administrative_documents')
        .insert({
          ...data,
          created_by: user.id,
        })
        .select(`
          *,
          employee:employees!fk_administrative_documents_employee(full_name, employee_code, position, department)
        `)
        .single();

      if (error) {
        console.error('❌ Error creating document:', error);
        throw new Error(`Không thể tạo văn bản: ${error.message}`);
      }

      console.log('✅ Document created:', doc);
      return doc as AdministrativeDocument;
    } catch (error: any) {
      console.error('❌ Error in createDocument:', error);
      throw error;
    }
  }

  /**
   * Update document (automatically creates version snapshot)
   */
  static async updateDocument(
    id: string,
    updates: UpdateDocumentData,
    changeNote?: string
  ): Promise<AdministrativeDocument> {
    try {
      // 1. Get current document
      const current = await this.getDocumentById(id);

      // 2. Get next version number
      const nextVersion = await this.getNextVersionNumber(id);

      // 3. Create version snapshot
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      await supabase.from('document_versions').insert({
        document_id: id,
        version_number: nextVersion,
        content: current.content,
        file_path: current.file_path,
        file_name: current.file_name,
        file_size: current.file_size,
        mime_type: current.mime_type,
        changed_by: user.id,
        change_note: changeNote || 'Cập nhật văn bản',
      });

      // 4. Update document
      const { data: doc, error } = await supabase
        .from('administrative_documents')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          employee:employees!fk_administrative_documents_employee(full_name, employee_code, position, department)
        `)
        .single();

      if (error) {
        console.error('❌ Error updating document:', error);
        throw new Error(`Không thể cập nhật văn bản: ${error.message}`);
      }

      console.log('✅ Document updated with version:', nextVersion);
      return doc as AdministrativeDocument;
    } catch (error: any) {
      console.error('❌ Error in updateDocument:', error);
      throw error;
    }
  }

  /**
   * Delete document
   */
  static async deleteDocument(id: string): Promise<void> {
    try {
      // Get document to delete file if exists
      const doc = await this.getDocumentById(id);

      // Delete file from storage if exists
      if (doc.file_path) {
        await this.deleteFile(doc.file_path);
      }

      // Delete document (cascades to versions)
      const { error } = await supabase
        .from('administrative_documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting document:', error);
        throw new Error(`Không thể xóa văn bản: ${error.message}`);
      }

      console.log('✅ Document deleted:', id);
    } catch (error: any) {
      console.error('❌ Error in deleteDocument:', error);
      throw error;
    }
  }

  /**
   * Submit document for approval
   */
  static async submitForApproval(id: string): Promise<void> {
    try {
      await this.updateDocument(id, { status: 'pending' }, 'Gửi phê duyệt');
    } catch (error: any) {
      console.error('❌ Error submitting for approval:', error);
      throw error;
    }
  }

  /**
   * Approve document
   */
  static async approveDocument(id: string, approvalNote?: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      await this.updateDocument(
        id,
        {
          status: 'approved',
        },
        approvalNote || 'Phê duyệt văn bản'
      );

      // Update approved_by and approved_at separately (not in version)
      await supabase
        .from('administrative_documents')
        .update({
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id);

      console.log('✅ Document approved:', id);
    } catch (error: any) {
      console.error('❌ Error approving document:', error);
      throw error;
    }
  }

  /**
   * Reject document
   */
  static async rejectDocument(id: string, rejectNote?: string): Promise<void> {
    try {
      await this.updateDocument(
        id,
        { status: 'draft' },
        rejectNote || 'Từ chối phê duyệt'
      );
    } catch (error: any) {
      console.error('❌ Error rejecting document:', error);
      throw error;
    }
  }

  /**
   * Publish document
   */
  static async publishDocument(id: string): Promise<void> {
    try {
      await this.updateDocument(id, { status: 'published' }, 'Xuất bản văn bản');
    } catch (error: any) {
      console.error('❌ Error publishing document:', error);
      throw error;
    }
  }

  /**
   * Archive document
   */
  static async archiveDocument(id: string): Promise<void> {
    try {
      await this.updateDocument(id, { status: 'archived' }, 'Lưu trữ văn bản');
    } catch (error: any) {
      console.error('❌ Error archiving document:', error);
      throw error;
    }
  }

  /**
   * Get version history
   */
  static async getVersionHistory(documentId: string): Promise<DocumentVersion[]> {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('*')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false });

      if (error) {
        console.error('❌ Error fetching versions:', error);
        throw new Error(`Không thể tải lịch sử phiên bản: ${error.message}`);
      }

      return (data || []) as DocumentVersion[];
    } catch (error: any) {
      console.error('❌ Error in getVersionHistory:', error);
      throw error;
    }
  }

  /**
   * Restore version
   */
  static async restoreVersion(
    documentId: string,
    versionId: string,
    restoreNote?: string
  ): Promise<void> {
    try {
      // Get version to restore
      const { data: version, error: versionError } = await supabase
        .from('document_versions')
        .select('*')
        .eq('id', versionId)
        .single();

      if (versionError) throw versionError;

      // Update document with version content (creates new version)
      await this.updateDocument(
        documentId,
        {
          content: version.content,
          file_path: version.file_path,
          file_name: version.file_name,
          file_size: version.file_size,
          mime_type: version.mime_type,
        },
        restoreNote || `Khôi phục phiên bản ${version.version_number}`
      );

      console.log('✅ Version restored:', versionId);
    } catch (error: any) {
      console.error('❌ Error restoring version:', error);
      throw error;
    }
  }

  /**
   * Get next version number
   */
  private static async getNextVersionNumber(documentId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('document_versions')
        .select('version_number')
        .eq('document_id', documentId)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      return data ? data.version_number + 1 : 1;
    } catch (error: any) {
      console.error('❌ Error getting next version:', error);
      return 1;
    }
  }

  /**
   * Upload file to storage
   */
  static async uploadFile(file: File, documentId: string): Promise<{
    file_path: string;
    file_name: string;
    file_size: number;
    mime_type: string;
  }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentId}-${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('employee-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw new Error(`Không thể upload file: ${uploadError.message}`);
      }

      console.log('✅ File uploaded:', filePath);
      return {
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      };
    } catch (error: any) {
      console.error('❌ Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Delete file from storage
   */
  static async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('employee-documents')
        .remove([filePath]);

      if (error) {
        console.error('❌ Delete file error:', error);
        // Don't throw, just log
      }
    } catch (error: any) {
      console.error('❌ Error deleting file:', error);
      // Don't throw, just log
    }
  }

  /**
   * Get file URL
   */
  static async getFileUrl(filePath: string): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from('employee-documents')
        .createSignedUrl(filePath, 3600); // 1 hour

      if (error) {
        console.error('❌ Error creating signed URL:', error);
        throw new Error(`Không thể tạo link tải: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error: any) {
      console.error('❌ Error in getFileUrl:', error);
      throw error;
    }
  }

  /**
   * Get documents by employee ID (for HRIS integration)
   */
  static async getDocumentsByEmployee(employeeId: string): Promise<AdministrativeDocument[]> {
    try {
      const { data, error } = await supabase
        .from('administrative_documents')
        .select(`
          *,
          employee:employees!fk_administrative_documents_employee(full_name, employee_code, position, department)
        `)
        .eq('employee_id', employeeId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching employee documents:', error);
        throw new Error(`Không thể tải văn bản của nhân viên: ${error.message}`);
      }

      return (data || []) as AdministrativeDocument[];
    } catch (error: any) {
      console.error('❌ Error in getDocumentsByEmployee:', error);
      throw error;
    }
  }

  /**
   * Get document statistics
   */
  static async getStats(): Promise<DocumentStats> {
    try {
      const { data, error } = await supabase
        .from('administrative_documents')
        .select('status, doc_type');

      if (error) throw error;

      const stats: DocumentStats = {
        total: data?.length || 0,
        draft: 0,
        pending: 0,
        approved: 0,
        published: 0,
        archived: 0,
        by_type: {
          decision: 0,
          notice: 0,
          contract: 0,
          form: 0,
        },
      };

      data?.forEach((doc) => {
        // Count by status
        if (doc.status === 'draft') stats.draft++;
        else if (doc.status === 'pending') stats.pending++;
        else if (doc.status === 'approved') stats.approved++;
        else if (doc.status === 'published') stats.published++;
        else if (doc.status === 'archived') stats.archived++;

        // Count by type
        if (doc.doc_type in stats.by_type) {
          stats.by_type[doc.doc_type as keyof typeof stats.by_type]++;
        }
      });

      return stats;
    } catch (error: any) {
      console.error('❌ Error getting stats:', error);
      throw error;
    }
  }
}
