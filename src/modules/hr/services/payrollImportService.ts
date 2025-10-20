import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';

interface ImportError {
  row: number;
  field: string;
  message: string;
}

interface ImportResult {
  successCount: number;
  failedCount: number;
  errors: ImportError[];
}

export class PayrollImportService {
  private static readonly COLUMN_MAP: Record<string, string> = {
    'Tháng*': 'month', 'Tháng': 'month',
    'Năm*': 'year', 'Năm': 'year',
    'Mã Nhân Viên*': 'employee_code', 'Mã Nhân Viên': 'employee_code',
    'Họ và Tên*': 'employee_name', 'Họ và Tên': 'employee_name',
    'Phòng Ban': 'department', 'Chức Danh': 'position',
    'Công Chuẩn': 'standard_days', 'PC Trách Nhiệm': 'responsibility_allowance',
    'Lương FT Thử Việc': 'salary_fulltime_probation',
    'Lương FT Chính Thức': 'salary_fulltime_official',
    'Lương PT Chính Thức': 'salary_parttime_official',
    'Lương PT Thử Việc': 'salary_parttime_probation',
    'PC Ăn/Ngày': 'daily_meal_allowance',
    'Công CT Thực Tế': 'ct_actual_days', 'Công CT Lễ': 'ct_holiday_days',
    'Công CT Chế Độ': 'ct_regime_days', 'CT - OT Buổi': 'ct_ot_sessions',
    'CT - OT Ngày': 'ct_ot_days', 'CT - OT Giờ': 'ct_ot_hours',
    'Công TV Thực Tế': 'tv_actual_days', 'Công TV Lễ': 'tv_holiday_days',
    'Công TV Chế Độ': 'tv_regime_days', 'TV - OT Buổi': 'tv_ot_sessions',
    'TV - OT Giờ': 'tv_ot_hours', 'Công Hệ Partime': 'parttime_days',
    'Ngày Nghỉ Phép': 'paid_leave_days',
    'Thưởng HĐ BH/CS': 'bonus_invoice_bh_cs', 'Thưởng HĐ KTV': 'bonus_invoice_ktv',
    'Thưởng Hiệu Suất': 'bonus_performance',
    'Phụ Cấp Trách Nhiệm': 'allowance_responsibility',
    'Phụ Cấp Ăn': 'allowance_meal', 'Happy Birthday': 'happy_birthday',
    'Phụ Cấp Gửi Xe': 'allowance_parking',
    'Hỗ Trợ Khác 1': 'support_other_1', 'Hỗ Trợ Khác 2': 'support_other_2',
    'Thanh Toán Phép Tồn': 'leave_settlement',
    'Tổng Lương (1)*': 'total_salary', 'Tổng Lương (1)': 'total_salary',
    'Tổng Thưởng (2)*': 'total_bonus', 'Tổng Thưởng (2)': 'total_bonus',
    'A. Tổng Thu Nhập*': 'total_income', 'A. Tổng Thu Nhập': 'total_income',
    'Trừ BHXH': 'deduction_social_insurance', 'Trừ Khác': 'deduction_other',
    'Ứng Lương': 'salary_advance',
    'B. Tổng Các Khoản Trừ*': 'total_deductions', 'B. Tổng Các Khoản Trừ': 'total_deductions',
    'C. Thực Nhận*': 'net_payment', 'C. Thực Nhận': 'net_payment',
    'Đã Chi Tạm Ứng': 'paid_advance', 'Đã Chi Ngày 3': 'paid_day_3',
    'Chi Dự Ngày 15': 'paid_day_15',
    'Tổng Công Ty Đã Chi*': 'total_company_paid', 'Tổng Công Ty Đã Chi': 'total_company_paid',
    'Chi Dư*': 'payment_surplus', 'Chi Dư': 'payment_surplus',
    'HĐ 500K - SL': 'invoice_500k_qty', 'HĐ 500K - Giá Trị': 'invoice_500k_amount',
    'HĐ 1tr - SL': 'invoice_1m_qty', 'HĐ 1tr - Giá Trị': 'invoice_1m_amount',
    'Đơn Hoàn 500K - SL': 'return_500k_qty', 'Đơn Hoàn 500K - Giá Trị': 'return_500k_amount',
    'Đơn Hoàn 1tr - SL': 'return_1m_qty', 'Đơn Hoàn 1tr - Giá Trị': 'return_1m_amount',
    'Ghi Chú': 'notes',
  };

  static async importFromExcel(
    file: File,
    onProgress?: (current: number, total: number) => void
  ): Promise<ImportResult> {
    const result: ImportResult = { successCount: 0, failedCount: 0, errors: [] };

    try {
      const parsedData = await this.parseExcelFile(file);
      const total = parsedData.length;

      if (total === 0) throw new Error('File Excel không có dữ liệu');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Vui lòng đăng nhập để import');

      const validPayrolls: any[] = [];
      const commissions: any[] = [];

      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i];
        const rowNumber = i + 2;

        try {
          if (!row.employee_code || !row.month || !row.year) {
            result.errors.push({
              row: rowNumber, field: 'required',
              message: 'Thiếu Mã NV, Tháng hoặc Năm',
            });
            result.failedCount++;
            continue;
          }

          const { data: employee, error: empError } = await supabase
            .from('employees')
            .select('id, full_name')
            .eq('employee_code', row.employee_code)
            .maybeSingle();

          if (empError || !employee) {
            result.errors.push({
              row: rowNumber, field: 'employee_code',
              message: `Mã NV "${row.employee_code}" không tồn tại`,
            });
            result.failedCount++;
            continue;
          }

          const monthDate = new Date(row.year, row.month - 1, 1);
          const monthString = monthDate.toISOString().split('T')[0];

          const payrollData = {
            employee_id: employee.id,
            month: monthString,
            company_name: 'Công ty TNHH ABC',
            employee_code: row.employee_code,
            employee_name: row.employee_name || employee.full_name,
            department: row.department || null,
            position: row.position || null,
            standard_days: this.parseNumeric(row.standard_days),
            responsibility_allowance: this.parseNumeric(row.responsibility_allowance),
            salary_fulltime_probation: this.parseNumeric(row.salary_fulltime_probation),
            salary_fulltime_official: this.parseNumeric(row.salary_fulltime_official),
            salary_parttime_official: this.parseNumeric(row.salary_parttime_official),
            salary_parttime_probation: this.parseNumeric(row.salary_parttime_probation),
            daily_meal_allowance: this.parseNumeric(row.daily_meal_allowance),
            ct_actual_days: this.parseNumeric(row.ct_actual_days),
            ct_holiday_days: this.parseNumeric(row.ct_holiday_days),
            ct_regime_days: this.parseNumeric(row.ct_regime_days),
            ct_ot_sessions: this.parseNumeric(row.ct_ot_sessions),
            ct_ot_days: this.parseNumeric(row.ct_ot_days),
            ct_ot_hours: this.parseNumeric(row.ct_ot_hours),
            tv_actual_days: this.parseNumeric(row.tv_actual_days),
            tv_holiday_days: this.parseNumeric(row.tv_holiday_days),
            tv_regime_days: this.parseNumeric(row.tv_regime_days),
            tv_ot_sessions: this.parseNumeric(row.tv_ot_sessions),
            tv_ot_hours: this.parseNumeric(row.tv_ot_hours),
            parttime_days: this.parseNumeric(row.parttime_days),
            paid_leave_days: this.parseNumeric(row.paid_leave_days),
            bonus_invoice_bh_cs: this.parseNumeric(row.bonus_invoice_bh_cs),
            bonus_invoice_ktv: this.parseNumeric(row.bonus_invoice_ktv),
            bonus_performance: this.parseNumeric(row.bonus_performance),
            allowance_responsibility: this.parseNumeric(row.allowance_responsibility),
            allowance_meal: this.parseNumeric(row.allowance_meal),
            happy_birthday: this.parseNumeric(row.happy_birthday),
            allowance_parking: this.parseNumeric(row.allowance_parking),
            support_other_1: this.parseNumeric(row.support_other_1),
            support_other_2: this.parseNumeric(row.support_other_2),
            leave_settlement: this.parseNumeric(row.leave_settlement),
            total_salary: this.parseNumeric(row.total_salary),
            total_bonus: this.parseNumeric(row.total_bonus),
            total_income: this.parseNumeric(row.total_income),
            deduction_social_insurance: this.parseNumeric(row.deduction_social_insurance),
            deduction_other: this.parseNumeric(row.deduction_other),
            salary_advance: this.parseNumeric(row.salary_advance),
            total_deductions: this.parseNumeric(row.total_deductions),
            net_payment: this.parseNumeric(row.net_payment),
            paid_advance: this.parseNumeric(row.paid_advance),
            paid_day_3: this.parseNumeric(row.paid_day_3),
            paid_day_15: this.parseNumeric(row.paid_day_15),
            total_company_paid: this.parseNumeric(row.total_company_paid),
            payment_surplus: this.parseNumeric(row.payment_surplus),
            notes: row.notes || null,
            status: 'draft',
            created_by: user.id,
          };

          validPayrolls.push(payrollData);

          const commissionsData = [
            { type: 'invoice_500k', quantity: this.parseNumeric(row.invoice_500k_qty), amount: this.parseNumeric(row.invoice_500k_amount) },
            { type: 'invoice_1m', quantity: this.parseNumeric(row.invoice_1m_qty), amount: this.parseNumeric(row.invoice_1m_amount) },
            { type: 'return_500k', quantity: this.parseNumeric(row.return_500k_qty), amount: this.parseNumeric(row.return_500k_amount) },
            { type: 'return_1m', quantity: this.parseNumeric(row.return_1m_qty), amount: this.parseNumeric(row.return_1m_amount) },
          ];

          commissions.push({ payroll_index: i, data: commissionsData });
          result.successCount++;

        } catch (error: any) {
          result.errors.push({
            row: rowNumber, field: 'unknown',
            message: error.message || 'Lỗi không xác định',
          });
          result.failedCount++;
        }

        if (onProgress) onProgress(i + 1, total);
      }

      if (validPayrolls.length > 0) {
        const { data: inserted, error: insertError } = await supabase
          .from('employee_payrolls')
          .insert(validPayrolls)
          .select('id');

        if (insertError) throw new Error(`Lỗi lưu dữ liệu: ${insertError.message}`);

        if (inserted && inserted.length > 0) {
          const commissionsToInsert: any[] = [];
          commissions.forEach((comm, idx) => {
            const payrollId = inserted[idx]?.id;
            if (payrollId) {
              comm.data.forEach((c: any) => {
                if (c.quantity > 0 || c.amount > 0) {
                  commissionsToInsert.push({
                    payroll_id: payrollId,
                    commission_type: c.type,
                    quantity: c.quantity,
                    commission_amount: c.amount,
                  });
                }
              });
            }
          });

          if (commissionsToInsert.length > 0) {
            await supabase.from('payroll_invoice_commissions').insert(commissionsToInsert);
          }
        }
      }

      return result;
    } catch (error: any) {
      throw new Error(`Import thất bại: ${error.message}`);
    }
  }

  private static async parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames.find((name) =>
            name.toLowerCase().includes('phiếu lương')
          ) || workbook.SheetNames[1] || workbook.SheetNames[0];
          
          if (!sheetName) throw new Error('Không tìm thấy sheet "Phiếu Lương"');

          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const mapped = jsonData.map((row: any) => {
            const parsedRow: any = {};
            Object.keys(row).forEach((key) => {
              const cleanKey = key.trim();
              const mappedKey = this.COLUMN_MAP[cleanKey];
              if (mappedKey) parsedRow[mappedKey] = row[key];
            });
            return parsedRow;
          });

          resolve(mapped);
        } catch (error: any) {
          reject(new Error(`Lỗi đọc file: ${error.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Không thể đọc file'));
      reader.readAsBinaryString(file);
    });
  }

  private static parseNumeric(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    const parsed = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }
}
