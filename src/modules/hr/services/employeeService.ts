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

  static async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((emp: any) => ({
      id: emp.id,
      employeeCode: emp.employee_code,
      fullName: emp.full_name,
      email: emp.email,
      phone: emp.phone || '',
      avatar: emp.avatar_path || '',
      position: emp.position,
      department: emp.department,
      joinDate: emp.join_date,
      contractType: emp.contract_type,
      status: emp.status,
      salary: {
        p1: Number(emp.salary_p1) || 0,
        p2: Number(emp.salary_p2) || 1.0,
        p3: Number(emp.salary_p3) || 0,
        total: (Number(emp.salary_p1) || 0) * (Number(emp.salary_p2) || 1.0) + (Number(emp.salary_p3) || 0)
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
      } : undefined
    }));
  }

  static async getEmployeeById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      employeeCode: data.employee_code,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone || '',
      avatar: data.avatar_path || '',
      position: data.position,
      department: data.department,
      joinDate: data.join_date,
      contractType: data.contract_type,
      status: data.status,
      salary: {
        p1: Number(data.salary_p1) || 0,
        p2: Number(data.salary_p2) || 1.0,
        p3: Number(data.salary_p3) || 0,
        total: (Number(data.salary_p1) || 0) * (Number(data.salary_p2) || 1.0) + (Number(data.salary_p3) || 0)
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
      } : undefined
    };
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
        join_date: data.join_date,
        contract_type: data.contract_type,
        status: data.status || 'probation',
        salary_p1: data.salary_p1 || 0,
        salary_p2: data.salary_p2 || 1.0,
        salary_p3: data.salary_p3 || 0,
        kpi_score: data.kpi_score || 0,
        last_review_date: data.last_review_date,
        current_address: data.current_address || null,
        emergency_contact_relationship: data.emergency_contact_relationship || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
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
    if (data.join_date) updates.join_date = data.join_date;
    if (data.contract_type) updates.contract_type = data.contract_type;
    if (data.status) updates.status = data.status;
    if (data.salary_p1 !== undefined) updates.salary_p1 = data.salary_p1;
    if (data.salary_p2 !== undefined) updates.salary_p2 = data.salary_p2;
    if (data.salary_p3 !== undefined) updates.salary_p3 = data.salary_p3;
    if (data.kpi_score !== undefined) updates.kpi_score = data.kpi_score;
    if (data.last_review_date !== undefined) updates.last_review_date = data.last_review_date;
    if (data.current_address !== undefined) updates.current_address = data.current_address;
    if (data.emergency_contact_relationship !== undefined) updates.emergency_contact_relationship = data.emergency_contact_relationship;
    if (data.emergency_contact_name !== undefined) updates.emergency_contact_name = data.emergency_contact_name;
    if (data.emergency_contact_phone !== undefined) updates.emergency_contact_phone = data.emergency_contact_phone;

    const { error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
