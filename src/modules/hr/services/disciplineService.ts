import { supabase } from '@/integrations/supabase/client';
import type {
  DisciplineRecord,
  CreateDisciplineData,
  UpdateDisciplineData,
  DisciplineStats,
  DisciplineFilters,
} from '../types/benefits';

export class DisciplineService {
  /**
   * Get all discipline records
   */
  static async getDisciplineRecords(filters?: DisciplineFilters): Promise<DisciplineRecord[]> {
    try {
      let query = supabase
        .from('hr_discipline_records')
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `)
        .order('violation_date', { ascending: false });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.type) {
        query = query.eq('violation_type', filters.type);
      }
      if (filters?.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters?.employee_id) {
        query = query.eq('employee_id', filters.employee_id);
      }
      if (filters?.date_from) {
        query = query.gte('violation_date', filters.date_from);
      }
      if (filters?.date_to) {
        query = query.lte('violation_date', filters.date_to);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching discipline records:', error);
        throw new Error(`Không thể tải danh sách kỷ luật: ${error.message}`);
      }

      return (data || []) as DisciplineRecord[];
    } catch (error: any) {
      console.error('❌ Error in getDisciplineRecords:', error);
      throw error;
    }
  }

  /**
   * Get discipline record by ID
   */
  static async getRecordById(id: string): Promise<DisciplineRecord> {
    try {
      const { data, error } = await supabase
        .from('hr_discipline_records')
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching discipline record:', error);
        throw new Error(`Không thể tải hồ sơ kỷ luật: ${error.message}`);
      }

      return data as DisciplineRecord;
    } catch (error: any) {
      console.error('❌ Error in getRecordById:', error);
      throw error;
    }
  }

  /**
   * Create new discipline record
   */
  static async createRecord(data: CreateDisciplineData): Promise<DisciplineRecord> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      // Generate record code
      const record_code = await this.generateRecordCode();

      const { data: record, error } = await supabase
        .from('hr_discipline_records')
        .insert({
          ...data,
          record_code,
          issued_by: user.id,
        })
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `)
        .single();

      if (error) {
        console.error('❌ Error creating discipline record:', error);
        throw new Error(`Không thể tạo hồ sơ kỷ luật: ${error.message}`);
      }

      console.log('✅ Discipline record created:', record);
      return record as DisciplineRecord;
    } catch (error: any) {
      console.error('❌ Error in createRecord:', error);
      throw error;
    }
  }

  /**
   * Update discipline record
   */
  static async updateRecord(
    id: string,
    updates: UpdateDisciplineData
  ): Promise<DisciplineRecord> {
    try {
      const { data: record, error } = await supabase
        .from('hr_discipline_records')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `)
        .single();

      if (error) {
        console.error('❌ Error updating discipline record:', error);
        throw new Error(`Không thể cập nhật hồ sơ kỷ luật: ${error.message}`);
      }

      console.log('✅ Discipline record updated:', record);
      return record as DisciplineRecord;
    } catch (error: any) {
      console.error('❌ Error in updateRecord:', error);
      throw error;
    }
  }

  /**
   * Delete discipline record
   */
  static async deleteRecord(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('hr_discipline_records')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting discipline record:', error);
        throw new Error(`Không thể xóa hồ sơ kỷ luật: ${error.message}`);
      }

      console.log('✅ Discipline record deleted:', id);
    } catch (error: any) {
      console.error('❌ Error in deleteRecord:', error);
      throw error;
    }
  }

  /**
   * Resolve discipline record
   */
  static async resolveRecord(id: string, resolutionNote: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('hr_discipline_records')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_note: resolutionNote,
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error resolving discipline record:', error);
        throw new Error(`Không thể xử lý hồ sơ kỷ luật: ${error.message}`);
      }

      console.log('✅ Discipline record resolved:', id);
    } catch (error: any) {
      console.error('❌ Error in resolveRecord:', error);
      throw error;
    }
  }

  /**
   * Get discipline statistics
   */
  static async getDisciplineStats(): Promise<DisciplineStats> {
    try {
      const { data, error } = await supabase
        .from('hr_discipline_records')
        .select('status, severity, violation_type');

      if (error) throw error;

      const stats: DisciplineStats = {
        total: data?.length || 0,
        pending: 0,
        reviewed: 0,
        resolved: 0,
        appealed: 0,
        by_severity: {
          warning: 0,
          minor: 0,
          major: 0,
          critical: 0,
        },
        by_type: {
          late: 0,
          absent: 0,
          'policy-violation': 0,
          misconduct: 0,
          other: 0,
        },
      };

      data?.forEach((record) => {
        // Count by status
        if (record.status === 'pending') stats.pending++;
        else if (record.status === 'reviewed') stats.reviewed++;
        else if (record.status === 'resolved') stats.resolved++;
        else if (record.status === 'appealed') stats.appealed++;

        // Count by severity
        if (record.severity in stats.by_severity) {
          stats.by_severity[record.severity as keyof typeof stats.by_severity]++;
        }

        // Count by type
        if (record.violation_type in stats.by_type) {
          stats.by_type[record.violation_type as keyof typeof stats.by_type]++;
        }
      });

      return stats;
    } catch (error: any) {
      console.error('❌ Error in getDisciplineStats:', error);
      throw error;
    }
  }

  /**
   * Get employee discipline history
   */
  static async getEmployeeDisciplineHistory(employeeId: string): Promise<DisciplineRecord[]> {
    try {
      const { data, error } = await supabase
        .from('hr_discipline_records')
        .select('*')
        .eq('employee_id', employeeId)
        .order('violation_date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching employee discipline history:', error);
        throw new Error(`Không thể tải lịch sử kỷ luật: ${error.message}`);
      }

      return (data || []) as DisciplineRecord[];
    } catch (error: any) {
      console.error('❌ Error in getEmployeeDisciplineHistory:', error);
      throw error;
    }
  }

  /**
   * Generate record code
   */
  private static async generateRecordCode(): Promise<string> {
    try {
      const year = new Date().getFullYear();
      const { data, error } = await supabase
        .from('hr_discipline_records')
        .select('record_code')
        .like('record_code', `KL-%/${year}`)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        return `KL-001/${year}`;
      }

      const lastCode = data[0].record_code;
      const match = lastCode.match(/KL-(\d+)/);
      if (!match) return `KL-001/${year}`;

      const nextNum = parseInt(match[1]) + 1;
      return `KL-${nextNum.toString().padStart(3, '0')}/${year}`;
    } catch (error: any) {
      console.error('❌ Error generating record code:', error);
      const year = new Date().getFullYear();
      return `KL-001/${year}`;
    }
  }
}
