import { supabase } from '@/integrations/supabase/client';
import type {
  DocumentTemplate,
  CreateTemplateData,
  DocType,
} from '../types/administration';

export class DocumentTemplateService {
  /**
   * Get all templates
   */
  static async getTemplates(docType?: DocType): Promise<DocumentTemplate[]> {
    try {
      let query = supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (docType) {
        query = query.eq('doc_type', docType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching templates:', error);
        throw new Error(`Không thể tải danh sách mẫu: ${error.message}`);
      }

      return (data || []) as DocumentTemplate[];
    } catch (error: any) {
      console.error('❌ Error in getTemplates:', error);
      throw error;
    }
  }

  /**
   * Get template by ID
   */
  static async getTemplateById(id: string): Promise<DocumentTemplate> {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching template:', error);
        throw new Error(`Không thể tải mẫu: ${error.message}`);
      }

      return data as DocumentTemplate;
    } catch (error: any) {
      console.error('❌ Error in getTemplateById:', error);
      throw error;
    }
  }

  /**
   * Create new template
   */
  static async createTemplate(data: CreateTemplateData): Promise<DocumentTemplate> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      const { data: template, error } = await supabase
        .from('document_templates')
        .insert({
          ...data,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating template:', error);
        throw new Error(`Không thể tạo mẫu: ${error.message}`);
      }

      console.log('✅ Template created:', template);
      return template as DocumentTemplate;
    } catch (error: any) {
      console.error('❌ Error in createTemplate:', error);
      throw error;
    }
  }

  /**
   * Update template
   */
  static async updateTemplate(
    id: string,
    updates: Partial<CreateTemplateData>
  ): Promise<DocumentTemplate> {
    try {
      const { data: template, error } = await supabase
        .from('document_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating template:', error);
        throw new Error(`Không thể cập nhật mẫu: ${error.message}`);
      }

      console.log('✅ Template updated:', template);
      return template as DocumentTemplate;
    } catch (error: any) {
      console.error('❌ Error in updateTemplate:', error);
      throw error;
    }
  }

  /**
   * Delete template (soft delete by setting is_active = false)
   */
  static async deleteTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('document_templates')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting template:', error);
        throw new Error(`Không thể xóa mẫu: ${error.message}`);
      }

      console.log('✅ Template deleted:', id);
    } catch (error: any) {
      console.error('❌ Error in deleteTemplate:', error);
      throw error;
    }
  }

  /**
   * Generate document from template
   */
  static async generateDocument(
    templateId: string,
    employeeId?: string
  ): Promise<string> {
    try {
      // Get template
      const template = await this.getTemplateById(templateId);

      let content = template.template_content;

      // If employee is selected, fetch employee data and replace placeholders
      if (employeeId) {
        const { data: employee, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', employeeId)
          .single();

        if (error) {
          console.error('❌ Error fetching employee:', error);
          throw new Error(`Không thể tải thông tin nhân viên: ${error.message}`);
        }

        // Replace placeholders
        const replacements: Record<string, string> = {
          '{{employee_name}}': employee.full_name || '',
          '{{employee_code}}': employee.employee_code || '',
          '{{position}}': employee.position || '',
          '{{department}}': employee.department || '',
          '{{team}}': employee.team || '',
          '{{join_date}}': employee.join_date || '',
          '{{email}}': employee.email || '',
          '{{phone}}': employee.phone || '',
          '{{salary_p1}}': employee.salary_p1?.toString() || '',
          '{{allowance_meal}}': employee.allowance_meal?.toString() || '',
          '{{allowance_fuel}}': employee.allowance_fuel?.toString() || '',
          '{{allowance_phone}}': employee.allowance_phone?.toString() || '',
          '{{allowance_other}}': employee.allowance_other?.toString() || '',
          '{{total_fixed_salary}}': employee.total_fixed_salary?.toString() || '',
          '{{employment_type}}': employee.employment_type || '',
          '{{current_address}}': employee.current_address || '',
          '{{emergency_contact_name}}': employee.emergency_contact_name || '',
          '{{emergency_contact_phone}}': employee.emergency_contact_phone || '',
          '{{emergency_contact_relationship}}': employee.emergency_contact_relationship || '',
        };

        // Replace all placeholders
        Object.entries(replacements).forEach(([placeholder, value]) => {
          content = content.replace(new RegExp(placeholder, 'g'), value);
        });
      }

      // Replace common placeholders
      const currentDate = new Date().toLocaleDateString('vi-VN');
      content = content.replace(/{{current_date}}/g, currentDate);

      console.log('✅ Document generated from template');
      return content;
    } catch (error: any) {
      console.error('❌ Error generating document:', error);
      throw error;
    }
  }

  /**
   * Get available placeholder variables for a doc type
   */
  static getAvailablePlaceholders(docType: DocType): Record<string, string> {
    const commonPlaceholders = {
      '{{current_date}}': 'Ngày hiện tại',
      '{{doc_no}}': 'Số văn bản (tự động)',
    };

    const employeePlaceholders = {
      '{{employee_name}}': 'Tên nhân viên',
      '{{employee_code}}': 'Mã nhân viên',
      '{{position}}': 'Chức vụ',
      '{{department}}': 'Phòng ban',
      '{{team}}': 'Nhóm',
      '{{join_date}}': 'Ngày vào làm',
      '{{email}}': 'Email',
      '{{phone}}': 'Số điện thoại',
      '{{salary_p1}}': 'Lương cơ bản',
      '{{allowance_meal}}': 'Phụ cấp ăn trưa',
      '{{allowance_fuel}}': 'Phụ cấp xăng xe',
      '{{allowance_phone}}': 'Phụ cấp điện thoại',
      '{{total_fixed_salary}}': 'Tổng lương cố định',
      '{{employment_type}}': 'Loại hình lao động',
      '{{current_address}}': 'Địa chỉ hiện tại',
      '{{emergency_contact_name}}': 'Tên người liên hệ khẩn cấp',
      '{{emergency_contact_phone}}': 'SĐT người liên hệ khẩn cấp',
    };

    return {
      ...commonPlaceholders,
      ...employeePlaceholders,
    };
  }
}
