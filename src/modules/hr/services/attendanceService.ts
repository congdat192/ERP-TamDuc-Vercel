import { supabase } from '@/integrations/supabase/client';
import { MonthlyAttendance } from '../types';

export interface CreateAttendanceData {
  employee_id: string;
  month: string; // YYYY-MM-01 format
  standard_days?: number;
  actual_days?: number;
  paid_leave?: number;
  unpaid_leave?: number;
  ot_hours?: number;
}

export interface UpdateAttendanceData {
  standard_days?: number;
  actual_days?: number;
  paid_leave?: number;
  unpaid_leave?: number;
  ot_hours?: number;
}

export class AttendanceService {
  static async getAttendanceByEmployee(employeeId: string): Promise<MonthlyAttendance[]> {
    const { data, error } = await supabase
      .from('monthly_attendance')
      .select('*')
      .eq('employee_id', employeeId)
      .order('month', { ascending: false });

    if (error) throw error;

    return data.map(record => ({
      id: record.id,
      employeeId: record.employee_id,
      month: record.month,
      standardDays: Number(record.standard_days),
      actualDays: Number(record.actual_days),
      paidLeave: Number(record.paid_leave),
      unpaidLeave: Number(record.unpaid_leave),
      otHours: Number(record.ot_hours),
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }));
  }

  static async createAttendance(data: CreateAttendanceData): Promise<void> {
    // Check if record already exists for this month
    const { data: existing } = await supabase
      .from('monthly_attendance')
      .select('id')
      .eq('employee_id', data.employee_id)
      .eq('month', data.month)
      .single();

    if (existing) {
      throw new Error('Đã tồn tại bản ghi chấm công cho tháng này');
    }

    const { error } = await supabase
      .from('monthly_attendance')
      .insert({
        employee_id: data.employee_id,
        month: data.month,
        standard_days: data.standard_days ?? 26,
        actual_days: data.actual_days ?? 0,
        paid_leave: data.paid_leave ?? 0,
        unpaid_leave: data.unpaid_leave ?? 0,
        ot_hours: data.ot_hours ?? 0
      });

    if (error) throw error;
  }

  static async updateAttendance(id: string, data: UpdateAttendanceData): Promise<void> {
    const { error } = await supabase
      .from('monthly_attendance')
      .update(data)
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteAttendance(id: string): Promise<void> {
    const { error } = await supabase
      .from('monthly_attendance')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
