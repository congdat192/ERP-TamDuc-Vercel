import { supabase } from '@/integrations/supabase/client';
import { Employee } from '../types';
import { EmployeeFormData } from '../types/validation';

export interface CreateEmployeeData extends EmployeeFormData {}
export interface UpdateEmployeeData extends Partial<EmployeeFormData> {}

export class EmployeeService {
  static async checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('employees')
      .select('id')
      .eq('email', email);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return !!data;
  }

  static async checkEmployeeCodeExists(code: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('employees')
      .select('id')
      .eq('employee_code', code);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query.maybeSingle();
    if (error) throw error;
    return !!data;
  }

  /**
   * Search employees by name or code
   */
  static async searchEmployees(query: string, limit: number = 10): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .or(`full_name.ilike.%${query}%,employee_code.ilike.%${query}%`)
      .is('deleted_at', null)
      .order('full_name', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((emp: any): Employee => ({
      id: emp.id,
      employeeCode: emp.employee_code,
      fullName: emp.full_name,
      email: emp.email,
      phone: emp.phone || '',
      avatar: emp.avatar_path || '/placeholder.svg',
      position: emp.position,
      department: emp.department,
      team: emp.team,
      joinDate: emp.join_date,
      employmentType: emp.employment_type as 'Full-time' | 'Part-time' | 'CTV' | 'Thử việc' | 'Thực tập',
      seniorityMonths: emp.seniority_months,
      status: emp.status,
      salary: {
        basic: Number(emp.salary_p1) || 0,
        allowanceMeal: Number(emp.allowance_meal) || 0,
        allowanceFuel: Number(emp.allowance_fuel) || 0,
        allowancePhone: Number(emp.allowance_phone) || 0,
        allowanceOther: Number(emp.allowance_other) || 0,
        totalFixed: Number(emp.total_fixed_salary) || 0,
      },
      performance: {
        kpi: Number(emp.kpi_score) || 0,
        lastReview: emp.last_review_date || ''
      },
      currentAddress: emp.current_address,
      emergencyContact: emp.emergency_contact_name ? {
        relationship: emp.emergency_contact_relationship as 'Cha' | 'Mẹ' | 'Vợ' | 'Chồng' | 'Anh' | 'Chị' | 'Em' | 'Khác',
        name: emp.emergency_contact_name,
        phone: emp.emergency_contact_phone
      } : undefined,
      notes: emp.notes,
      deletedAt: emp.deleted_at,
      deletedBy: emp.deleted_by,
    }));
  }

  static async getEmployees(includeDeleted = false): Promise<Employee[]> {
    let query = supabase
      .from('employees')
      .select('*');
    
    // Filter out soft-deleted employees by default
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return (data || [])
      .map((emp: any) => {
        // Skip invalid records
        if (!emp.employee_code || !emp.full_name) {
          console.warn('⚠️ [EmployeeService] Skipping invalid employee record:', emp.id);
          return null;
        }
        
        return {
          id: emp.id,
          employeeCode: emp.employee_code,
          fullName: emp.full_name,
          email: emp.email,
          phone: emp.phone || '',
          avatar: emp.avatar_path || '',
          position: emp.position || 'Chưa xác định',
          department: emp.department || 'Chưa xác định',
          team: emp.team || '',
          joinDate: emp.join_date,
          employmentType: emp.employment_type as 'Full-time' | 'Part-time' | 'CTV' | 'Thử việc' | 'Thực tập',
          seniorityMonths: emp.seniority_months,
          status: emp.status,
          salary: {
            basic: Number(emp.salary_p1) || 0,
            allowanceMeal: Number(emp.allowance_meal) || 0,
            allowanceFuel: Number(emp.allowance_fuel) || 0,
            allowancePhone: Number(emp.allowance_phone) || 0,
            allowanceOther: Number(emp.allowance_other) || 0,
            totalFixed: Number(emp.total_fixed_salary) || 0,
          },
          performance: {
            kpi: Number(emp.kpi_score) || 0,
            lastReview: emp.last_review_date || ''
          },
          currentAddress: emp.current_address,
          emergencyContact: emp.emergency_contact_name ? {
            relationship: emp.emergency_contact_relationship as 'Cha' | 'Mẹ' | 'Vợ' | 'Chồng' | 'Anh' | 'Chị' | 'Em' | 'Khác',
            name: emp.emergency_contact_name,
            phone: emp.emergency_contact_phone
          } : undefined,
          notes: emp.notes,
          deletedAt: emp.deleted_at,
          deletedBy: emp.deleted_by,
        };
      })
      .filter(Boolean) as Employee[];
  }

  static async getEmployeeById(id: string, includeDeleted = false, includeRelated = false): Promise<Employee | null> {
    let query = supabase
      .from('employees')
      .select('*')
      .eq('id', id);
    
    // Filter out soft-deleted employees by default
    if (!includeDeleted) {
      query = query.is('deleted_at', null);
    }
    
    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    if (!data) return null;

    const employee: Employee = {
      id: data.id,
      employeeCode: data.employee_code,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone || '',
      avatar: data.avatar_path || '',
      position: data.position,
      department: data.department,
      team: data.team,
      joinDate: data.join_date,
      employmentType: data.employment_type as 'Full-time' | 'Part-time' | 'CTV' | 'Thử việc' | 'Thực tập',
      seniorityMonths: data.seniority_months,
      status: data.status,
      salary: {
        basic: Number(data.salary_p1) || 0,
        allowanceMeal: Number(data.allowance_meal) || 0,
        allowanceFuel: Number(data.allowance_fuel) || 0,
        allowancePhone: Number(data.allowance_phone) || 0,
        allowanceOther: Number(data.allowance_other) || 0,
        totalFixed: Number(data.total_fixed_salary) || 0,
      },
      performance: {
        kpi: Number(data.kpi_score) || 0,
        lastReview: data.last_review_date || ''
      },
      currentAddress: data.current_address,
      emergencyContact: data.emergency_contact_name ? {
        relationship: data.emergency_contact_relationship as 'Cha' | 'Mẹ' | 'Vợ' | 'Chồng' | 'Anh' | 'Chị' | 'Em' | 'Khác',
        name: data.emergency_contact_name,
        phone: data.emergency_contact_phone
      } : undefined,
      notes: data.notes,
      deletedAt: data.deleted_at,
      deletedBy: data.deleted_by,
    };

    // Load related data if requested
    if (includeRelated) {
      try {
        // Load benefit assignments
        const { data: benefitAssignments } = await supabase
          .from('hr_benefit_assignments')
          .select(`
            *,
            benefit:hr_benefits(*)
          `)
          .eq('employee_id', id)
          .eq('status', 'active')
          .order('assigned_date', { ascending: false });

        // Load rewards
        const { data: rewards } = await supabase
          .from('hr_rewards')
          .select('*')
          .eq('employee_id', id)
          .order('awarded_date', { ascending: false });

        // Load discipline records
        const { data: disciplineRecords } = await supabase
          .from('hr_discipline_records')
          .select('*')
          .eq('employee_id', id)
          .order('violation_date', { ascending: false });

        employee.benefits = (benefitAssignments || []) as any;
        employee.rewards = (rewards || []) as any;
        employee.disciplineRecords = (disciplineRecords || []) as any;
      } catch (err) {
        console.error('❌ Error loading related data:', err);
      }
    }

    return employee;
  }

  static async createEmployee(data: CreateEmployeeData): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .insert({
        employee_code: data.employee_code,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        avatar_path: data.avatar_path || null,
        position: data.position,
        department: data.department,
        team: data.team || null,
        join_date: data.join_date,
        employment_type: data.employment_type,
        status: data.status || 'probation',
        salary_p1: data.salary_p1 || 0,
        allowance_meal: data.allowance_meal || 0,
        allowance_fuel: data.allowance_fuel || 0,
        allowance_phone: data.allowance_phone || 0,
        allowance_other: data.allowance_other || 0,
        kpi_score: data.kpi_score || 0,
        last_review_date: data.last_review_date,
        current_address: data.current_address || null,
        emergency_contact_relationship: data.emergency_contact_relationship || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        notes: data.notes || null,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (error) throw error;
  }

  static async updateEmployee(id: string, data: UpdateEmployeeData): Promise<void> {
    const updates: any = {};
    
    if (data.employee_code) updates.employee_code = data.employee_code;
    if (data.full_name) updates.full_name = data.full_name;
    if (data.email) updates.email = data.email;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.avatar_path !== undefined) updates.avatar_path = data.avatar_path;
    if (data.position) updates.position = data.position;
    if (data.department) updates.department = data.department;
    if (data.team !== undefined) updates.team = data.team;
    if (data.join_date) updates.join_date = data.join_date;
    if (data.employment_type) updates.employment_type = data.employment_type;
    if (data.status) updates.status = data.status;
    if (data.salary_p1 !== undefined) updates.salary_p1 = data.salary_p1;
    if (data.allowance_meal !== undefined) updates.allowance_meal = data.allowance_meal;
    if (data.allowance_fuel !== undefined) updates.allowance_fuel = data.allowance_fuel;
    if (data.allowance_phone !== undefined) updates.allowance_phone = data.allowance_phone;
    if (data.allowance_other !== undefined) updates.allowance_other = data.allowance_other;
    if (data.kpi_score !== undefined) updates.kpi_score = data.kpi_score;
    if (data.last_review_date !== undefined) updates.last_review_date = data.last_review_date;
    if (data.current_address !== undefined) updates.current_address = data.current_address;
    if (data.emergency_contact_relationship !== undefined) updates.emergency_contact_relationship = data.emergency_contact_relationship;
    if (data.emergency_contact_name !== undefined) updates.emergency_contact_name = data.emergency_contact_name;
    if (data.emergency_contact_phone !== undefined) updates.emergency_contact_phone = data.emergency_contact_phone;
    if (data.notes !== undefined) updates.notes = data.notes;

    const { error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteEmployee(id: string): Promise<{
    success: boolean;
    warnings?: {
      documents: number;
      attendance: number;
      adminDocs: number;
    };
  }> {
    // 1. Check related data
    const [docsCount, attendanceCount, adminDocsCount] = await Promise.all([
      supabase.from('employee_documents').select('id', { count: 'exact', head: true }).eq('employee_id', id),
      supabase.from('monthly_attendance').select('id', { count: 'exact', head: true }).eq('employee_id', id),
      supabase.from('administrative_documents').select('id', { count: 'exact', head: true }).eq('employee_id', id),
    ]);

    const warnings = {
      documents: docsCount.count || 0,
      attendance: attendanceCount.count || 0,
      adminDocs: adminDocsCount.count || 0,
    };

    // 2. Perform delete (trigger will backup info)
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true, warnings };
  }

  static async softDeleteEmployee(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('employees')
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user?.id,
        status: 'terminated' as const,
      })
      .eq('id', id);

    if (error) throw error;
  }

  static async restoreEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .update({
        deleted_at: null,
        deleted_by: null,
        status: 'active' as const,
      })
      .eq('id', id);

    if (error) throw error;
  }
}
