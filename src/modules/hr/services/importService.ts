import * as XLSX from 'xlsx';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeService } from './employeeService';

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: ImportError[];
}

interface ParsedEmployee {
  employee_code: string;
  full_name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  team?: string;
  join_date: string;
  employment_type: 'Full-time' | 'Part-time' | 'CTV' | 'Thử việc' | 'Thực tập';
  salary_p1?: number;
  allowance_meal?: number;
  allowance_fuel?: number;
  allowance_phone?: number;
  allowance_other?: number;
  notes?: string;
}

export class ImportService {
  // Column aliases mapping
  private static readonly COLUMN_ALIASES: Record<string, string> = {
    // Employee Code
    'MNV': 'employee_code',
    'Mã NV': 'employee_code',
    'Mã nhân viên': 'employee_code',
    'employee_code': 'employee_code',
    
    // Full Name
    'Họ và tên': 'full_name',
    'Họ tên': 'full_name',
    'Tên nhân viên': 'full_name',
    'full_name': 'full_name',
    
    // Email
    'Email': 'email',
    'email': 'email',
    
    // Phone
    'SĐT': 'phone',
    'Số điện thoại': 'phone',
    'phone': 'phone',
    
    // Department
    'Phòng ban': 'department',
    'department': 'department',
    
    // Position
    'Chức danh': 'position',
    'Chức vụ': 'position',
    'position': 'position',
    
    // Team
    'Nhóm': 'team',
    'Team': 'team',
    'team': 'team',
    
    // Join Date
    'Ngày vào làm': 'join_date',
    'join_date': 'join_date',
    
    // Employment Type
    'Loại công': 'employment_type',
    'employment_type': 'employment_type',
    
    // Salary P1
    'Lương cơ bản': 'salary_p1',
    'salary_p1': 'salary_p1',
    
    // Allowances
    'Phụ cấp ăn trưa': 'allowance_meal',
    'allowance_meal': 'allowance_meal',
    'Phụ cấp xăng xe': 'allowance_fuel',
    'allowance_fuel': 'allowance_fuel',
    'Phụ cấp điện thoại': 'allowance_phone',
    'allowance_phone': 'allowance_phone',
    'Phụ cấp khác': 'allowance_other',
    'allowance_other': 'allowance_other',
    
    // Notes
    'Ghi chú': 'notes',
    'notes': 'notes',
  };

  static async importFromExcel(file: File): Promise<ImportResult> {
    const rows = await this.parseExcelFile(file);
    const errors: ImportError[] = [];
    let successCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const rowIndex = i + 2; // +2 because Excel row starts at 1 and has header
      const row = rows[i];

      // Skip empty rows
      if (!row || Object.keys(row).length === 0) continue;

      // Map columns
      const mappedRow = this.mapColumnAliases(row);

      // Validate row
      const validation = await this.validateRow(mappedRow, rowIndex);
      
      if (!validation.isValid) {
        errors.push(...validation.errors);
        continue;
      }

      // Insert to database
      try {
        await EmployeeService.createEmployee(mappedRow);
        successCount++;
      } catch (err: any) {
        errors.push({
          row: rowIndex,
          field: 'database',
          message: err.message || 'Lỗi khi lưu vào database'
        });
      }
    }

    return {
      totalRows: rows.length,
      successCount,
      errorCount: errors.length,
      errors
    };
  }

  static async parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet);
          resolve(rows);
        } catch (err) {
          reject(new Error('Không thể đọc file Excel'));
        }
      };
      
      reader.onerror = () => reject(new Error('Lỗi khi đọc file'));
      reader.readAsBinaryString(file);
    });
  }

  static mapColumnAliases(row: any): ParsedEmployee {
    const mapped: any = {};
    
    for (const [key, value] of Object.entries(row)) {
      const normalizedKey = this.COLUMN_ALIASES[key] || key;
      mapped[normalizedKey] = value;
    }
    
    return mapped as ParsedEmployee;
  }

  static async validateRow(row: ParsedEmployee, rowIndex: number): Promise<{
    isValid: boolean;
    errors: ImportError[];
  }> {
    const errors: ImportError[] = [];

    // Check required fields
    if (!row.employee_code) {
      errors.push({ row: rowIndex, field: 'employee_code', message: 'Mã nhân viên không được để trống' });
    }
    if (!row.full_name) {
      errors.push({ row: rowIndex, field: 'full_name', message: 'Họ tên không được để trống' });
    }
    if (!row.email) {
      errors.push({ row: rowIndex, field: 'email', message: 'Email không được để trống' });
    }
    if (!row.department) {
      errors.push({ row: rowIndex, field: 'department', message: 'Phòng ban không được để trống' });
    }
    if (!row.position) {
      errors.push({ row: rowIndex, field: 'position', message: 'Chức danh không được để trống' });
    }
    if (!row.join_date) {
      errors.push({ row: rowIndex, field: 'join_date', message: 'Ngày vào làm không được để trống' });
    }

    // Validate email format
    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      errors.push({ row: rowIndex, field: 'email', message: `Email không hợp lệ: ${row.email}` });
    }

    // Validate phone format
    if (row.phone && !/^0\d{9}$/.test(row.phone.toString().trim())) {
      errors.push({ row: rowIndex, field: 'phone', message: `SĐT phải có 10 số và bắt đầu bằng 0: ${row.phone}` });
    }

    // Validate employment_type
    const validTypes = ['Full-time', 'Part-time', 'CTV', 'Thử việc', 'Thực tập'];
    if (row.employment_type && !validTypes.includes(row.employment_type)) {
      errors.push({ 
        row: rowIndex, 
        field: 'employment_type', 
        message: `Loại công không hợp lệ. Chỉ chấp nhận: ${validTypes.join(', ')}` 
      });
    }

    // Validate salary fields (non-negative)
    const salaryFields = ['salary_p1', 'allowance_meal', 'allowance_fuel', 'allowance_phone', 'allowance_other'];
    for (const field of salaryFields) {
      const value = row[field as keyof ParsedEmployee];
      if (value !== undefined && value !== null && Number(value) < 0) {
        errors.push({ row: rowIndex, field, message: `${field} không được âm` });
      }
    }

    // Check duplicates in database
    if (row.employee_code) {
      const codeExists = await EmployeeService.checkEmployeeCodeExists(row.employee_code);
      if (codeExists) {
        errors.push({ 
          row: rowIndex, 
          field: 'employee_code', 
          message: `Mã nhân viên đã tồn tại: ${row.employee_code}` 
        });
      }
    }

    if (row.email) {
      const emailExists = await EmployeeService.checkEmailExists(row.email);
      if (emailExists) {
        errors.push({ 
          row: rowIndex, 
          field: 'email', 
          message: `Email đã tồn tại: ${row.email}` 
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
