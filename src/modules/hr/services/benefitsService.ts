import { supabase } from '@/integrations/supabase/client';
import type {
  Benefit,
  BenefitAssignment,
  CreateBenefitData,
  UpdateBenefitData,
  BenefitStats,
} from '../types/benefits';

export class BenefitsService {
  /**
   * Get all benefits
   */
  static async getBenefits(includeDeleted = false): Promise<Benefit[]> {
    try {
      let query = supabase
        .from('hr_benefits')
        .select('*')
        .order('created_at', { ascending: false });

      if (!includeDeleted) {
        query = query.is('deleted_at', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Error fetching benefits:', error);
        throw new Error(`Không thể tải danh sách phúc lợi: ${error.message}`);
      }

      return (data || []) as Benefit[];
    } catch (error: any) {
      console.error('❌ Error in getBenefits:', error);
      throw error;
    }
  }

  /**
   * Get benefit by ID
   */
  static async getBenefitById(id: string): Promise<Benefit> {
    try {
      const { data, error } = await supabase
        .from('hr_benefits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching benefit:', error);
        throw new Error(`Không thể tải phúc lợi: ${error.message}`);
      }

      return data as Benefit;
    } catch (error: any) {
      console.error('❌ Error in getBenefitById:', error);
      throw error;
    }
  }

  /**
   * Create new benefit
   */
  static async createBenefit(data: CreateBenefitData): Promise<Benefit> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      // Generate benefit code
      const benefit_code = await this.generateBenefitCode();

      const { data: benefit, error } = await supabase
        .from('hr_benefits')
        .insert({
          ...data,
          benefit_code,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating benefit:', error);
        throw new Error(`Không thể tạo phúc lợi: ${error.message}`);
      }

      console.log('✅ Benefit created:', benefit);
      return benefit as Benefit;
    } catch (error: any) {
      console.error('❌ Error in createBenefit:', error);
      throw error;
    }
  }

  /**
   * Update benefit
   */
  static async updateBenefit(
    id: string,
    updates: UpdateBenefitData
  ): Promise<Benefit> {
    try {
      const { data: benefit, error } = await supabase
        .from('hr_benefits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating benefit:', error);
        throw new Error(`Không thể cập nhật phúc lợi: ${error.message}`);
      }

      console.log('✅ Benefit updated:', benefit);
      return benefit as Benefit;
    } catch (error: any) {
      console.error('❌ Error in updateBenefit:', error);
      throw error;
    }
  }

  /**
   * Delete benefit (soft delete)
   */
  static async deleteBenefit(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      const { error } = await supabase
        .from('hr_benefits')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: user.id,
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting benefit:', error);
        throw new Error(`Không thể xóa phúc lợi: ${error.message}`);
      }

      console.log('✅ Benefit deleted:', id);
    } catch (error: any) {
      console.error('❌ Error in deleteBenefit:', error);
      throw error;
    }
  }

  /**
   * Restore deleted benefit
   */
  static async restoreBenefit(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('hr_benefits')
        .update({
          deleted_at: null,
          deleted_by: null,
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error restoring benefit:', error);
        throw new Error(`Không thể khôi phục phúc lợi: ${error.message}`);
      }

      console.log('✅ Benefit restored:', id);
    } catch (error: any) {
      console.error('❌ Error in restoreBenefit:', error);
      throw error;
    }
  }

  /**
   * Get benefit statistics
   */
  static async getBenefitStats(): Promise<BenefitStats> {
    try {
      const { data, error } = await supabase
        .from('hr_benefits')
        .select('status, benefit_type')
        .is('deleted_at', null);

      if (error) throw error;

      const stats: BenefitStats = {
        total: data?.length || 0,
        active: 0,
        inactive: 0,
        expired: 0,
        by_type: {
          insurance: 0,
          allowance: 0,
          bonus: 0,
          leave: 0,
          other: 0,
        },
      };

      data?.forEach((benefit) => {
        // Count by status
        if (benefit.status === 'active') stats.active++;
        else if (benefit.status === 'inactive') stats.inactive++;
        else if (benefit.status === 'expired') stats.expired++;

        // Count by type
        if (benefit.benefit_type in stats.by_type) {
          stats.by_type[benefit.benefit_type as keyof typeof stats.by_type]++;
        }
      });

      return stats;
    } catch (error: any) {
      console.error('❌ Error in getBenefitStats:', error);
      throw error;
    }
  }

  /**
   * Assign benefit to employee
   */
  static async assignBenefitToEmployee(
    benefitId: string,
    employeeId: string,
    startDate: string,
    endDate?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      const { error } = await supabase
        .from('hr_benefit_assignments')
        .insert({
          benefit_id: benefitId,
          employee_id: employeeId,
          start_date: startDate,
          end_date: endDate,
          assigned_by: user.id,
        });

      if (error) {
        console.error('❌ Error assigning benefit:', error);
        throw new Error(`Không thể gán phúc lợi: ${error.message}`);
      }

      console.log('✅ Benefit assigned');
    } catch (error: any) {
      console.error('❌ Error in assignBenefitToEmployee:', error);
      throw error;
    }
  }

  /**
   * Get benefit assignments
   */
  static async getBenefitAssignments(benefitId: string): Promise<BenefitAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('hr_benefit_assignments')
        .select(`
          *,
          employee:employees(id, full_name, employee_code, position, department)
        `)
        .eq('benefit_id', benefitId)
        .order('assigned_date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching assignments:', error);
        throw new Error(`Không thể tải danh sách gán phúc lợi: ${error.message}`);
      }

      return (data || []) as BenefitAssignment[];
    } catch (error: any) {
      console.error('❌ Error in getBenefitAssignments:', error);
      throw error;
    }
  }

  /**
   * Get employee benefits
   */
  static async getEmployeeBenefits(employeeId: string): Promise<BenefitAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('hr_benefit_assignments')
        .select(`
          *,
          benefit:hr_benefits(*)
        `)
        .eq('employee_id', employeeId)
        .eq('status', 'active')
        .order('assigned_date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching employee benefits:', error);
        throw new Error(`Không thể tải phúc lợi của nhân viên: ${error.message}`);
      }

      return (data || []) as BenefitAssignment[];
    } catch (error: any) {
      console.error('❌ Error in getEmployeeBenefits:', error);
      throw error;
    }
  }

  /**
   * Bulk assign benefit to multiple employees
   */
  static async bulkAssignBenefit(
    benefitId: string,
    employeeIds: string[],
    startDate: string,
    endDate?: string
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Không tìm thấy thông tin người dùng');

      const assignments = employeeIds.map(empId => ({
        employee_id: empId,
        benefit_id: benefitId,
        assigned_date: new Date().toISOString().split('T')[0],
        start_date: startDate,
        end_date: endDate,
        assigned_by: user.id,
      }));

      const { error } = await supabase
        .from('hr_benefit_assignments')
        .insert(assignments);

      if (error) {
        console.error('❌ Error bulk assigning benefits:', error);
        throw new Error(`Không thể gán phúc lợi hàng loạt: ${error.message}`);
      }

      console.log(`✅ Bulk assigned benefit to ${employeeIds.length} employees`);
    } catch (error: any) {
      console.error('❌ Error in bulkAssignBenefit:', error);
      throw error;
    }
  }

  /**
   * Generate benefit code
   */
  private static async generateBenefitCode(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('hr_benefits')
        .select('benefit_code')
        .like('benefit_code', 'BF-%')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        return 'BF-001';
      }

      const lastCode = data[0].benefit_code;
      const match = lastCode.match(/BF-(\d+)/);
      if (!match) return 'BF-001';

      const nextNum = parseInt(match[1]) + 1;
      return `BF-${nextNum.toString().padStart(3, '0')}`;
    } catch (error: any) {
      console.error('❌ Error generating benefit code:', error);
      return 'BF-001';
    }
  }
}
