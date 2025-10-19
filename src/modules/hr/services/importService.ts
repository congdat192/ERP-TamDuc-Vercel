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
  updatedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: ImportError[];
}

interface ParsedEmployee {
  employee_code: string;
  full_name: string;
  email: string;
  phone?: string;
  gender?: 'Male' | 'Female' | 'Other';
  birth_date?: string;
  department: string;
  position: string;
  team?: string;
  join_date: string;
  employment_type: 'Full-time' | 'Part-time' | 'CTV' | 'Thử việc' | 'Thực tập';
  status?: 'active' | 'inactive' | 'probation' | 'terminated';
  salary_p1?: number;
  allowance_meal?: number;
  allowance_fuel?: number;
  allowance_phone?: number;
  allowance_other?: number;
  salary_fulltime_probation?: number;
  salary_fulltime_official?: number;
  salary_parttime_probation?: number;
  salary_parttime_official?: number;
  kpi_score?: number;
  last_review_date?: string;
  current_address?: string;
  emergency_contact_relationship?: 'Cha' | 'Mẹ' | 'Vợ' | 'Chồng' | 'Anh' | 'Chị' | 'Em' | 'Khác';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
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
    'Họ Tên': 'full_name',  // ← Thêm alias từ Export cũ
    'Tên nhân viên': 'full_name',
    'full_name': 'full_name',
    
    // Email
    'Email': 'email',
    'email': 'email',
    
    // Phone
    'SĐT': 'phone',
    'Số ĐT': 'phone',
    'Số điện thoại': 'phone',
    'phone': 'phone',
    
    // Gender
    'Giới tính': 'gender',
    'Giới Tính': 'gender',
    'gender': 'gender',
    'Gender': 'gender',
    
    // Birth Date
    'Ngày sinh': 'birth_date',
    'Ngày Sinh': 'birth_date',
    'birth_date': 'birth_date',
    'Birth Date': 'birth_date',
    
    // Department
    'Phòng ban': 'department',
    'Phòng Ban': 'department',  // ← Thêm alias từ Export cũ
    'department': 'department',
    
    // Position
    'Chức danh': 'position',
    'Chức vụ': 'position',
    'Chức Vụ': 'position',  // ← Thêm alias từ Export cũ
    'position': 'position',
    
    // Team
    'Nhóm': 'team',
    'Team': 'team',
    'team': 'team',
    
    // Join Date
    'Ngày vào làm': 'join_date',
    'Ngày Vào Làm': 'join_date',  // ← Thêm alias từ Export cũ
    'join_date': 'join_date',
    
    // Employment Type
    'Loại công': 'employment_type',
    'Loại Công': 'employment_type',  // ← Thêm alias từ Export cũ
    'employment_type': 'employment_type',
    
    // Salary P1
    'Lương cơ bản': 'salary_p1',
    'Lương Cơ Bản': 'salary_p1',
    'salary_p1': 'salary_p1',
    
    // Salary by Contract Type
    'Lương Full-time Thử việc': 'salary_fulltime_probation',
    'Lương Full-time thử việc': 'salary_fulltime_probation',
    'salary_fulltime_probation': 'salary_fulltime_probation',
    
    'Lương Full-time Chính thức': 'salary_fulltime_official',
    'Lương Full-time chính thức': 'salary_fulltime_official',
    'salary_fulltime_official': 'salary_fulltime_official',
    
    'Lương Part-time Thử việc': 'salary_parttime_probation',
    'Lương Part-time thử việc': 'salary_parttime_probation',
    'salary_parttime_probation': 'salary_parttime_probation',
    
    'Lương Part-time Chính thức': 'salary_parttime_official',
    'Lương Part-time chính thức': 'salary_parttime_official',
    'salary_parttime_official': 'salary_parttime_official',
    
    // Allowances
    'Phụ cấp ăn trưa': 'allowance_meal',
    'PC Ăn Trưa': 'allowance_meal',  // ← Thêm alias từ Export cũ
    'allowance_meal': 'allowance_meal',
    'Phụ cấp xăng xe': 'allowance_fuel',
    'PC Xăng Xe': 'allowance_fuel',  // ← Thêm alias từ Export cũ
    'allowance_fuel': 'allowance_fuel',
    'Phụ cấp điện thoại': 'allowance_phone',
    'PC Điện Thoại': 'allowance_phone',  // ← Thêm alias từ Export cũ
    'allowance_phone': 'allowance_phone',
    'Phụ cấp khác': 'allowance_other',
    'PC Khác': 'allowance_other',  // ← Thêm alias từ Export cũ
    'allowance_other': 'allowance_other',
    
    // Notes
    'Ghi chú': 'notes',
    'notes': 'notes',
    
    // Status
    'Trạng thái': 'status',
    'Status': 'status',
    
    // KPI
    'KPI': 'kpi_score',
    'Điểm KPI': 'kpi_score',
    
    // Last Review Date
    'Ngày đánh giá': 'last_review_date',
    'Last Review': 'last_review_date',
    
    // Current Address
    'Địa chỉ': 'current_address',
    'Địa chỉ hiện tại': 'current_address',
    
    // Emergency Contact
    'Người liên hệ khẩn cấp': 'emergency_contact_name',
    'SĐT khẩn cấp': 'emergency_contact_phone',
    'Quan hệ': 'emergency_contact_relationship',
  };

  // ✅ Numeric fields that need empty string → null conversion
  private static readonly NUMERIC_FIELDS = [
    'salary_p1',
    'allowance_meal',
    'allowance_fuel',
    'allowance_phone',
    'allowance_other',
    'total_fixed_salary',
    'salary_fulltime_probation',
    'salary_fulltime_official',
    'salary_parttime_probation',
    'salary_parttime_official',
    'kpi_score',
    'seniority_months'
  ];

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
      updatedCount: 0,
      skippedCount: 0,
      errorCount: errors.length,
      errors
    };
  }

  static async importFromExcelBatch(
    file: File, 
    onProgress?: (current: number, total: number) => void
  ): Promise<ImportResult> {
    const rows = await this.parseExcelFile(file);
    const errors: ImportError[] = [];
    const BATCH_SIZE = 10; // Process 10 rows at a time
    let successCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    console.log(`📦 Starting batch import: ${rows.length} rows`);

    // Pre-fetch all existing employees with full data (1 query)
    const { data: existingEmployees } = await supabase
      .from('employees')
      .select('*')
      .is('deleted_at', null);
    
    const existingByCode = new Map(
      existingEmployees?.map(e => [e.employee_code.toLowerCase(), e]) || []
    );
    const existingByEmail = new Map(
      existingEmployees?.map(e => [e.email.toLowerCase(), e]) || []
    );

    console.log(`✅ Pre-fetched ${existingByCode.size} existing employees`);

    // Process in batches
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      
      console.log(`📦 Processing batch ${batchNum} (rows ${i + 1}-${Math.min(i + BATCH_SIZE, rows.length)})`);
      
      const batchPromises = batch.map(async (row, batchIdx) => {
        const rowIndex = i + batchIdx + 2;
        
        // Skip empty rows
        if (!row || Object.keys(row).length === 0) {
          return { success: false, updated: false, skipped: false };
        }

        // Map columns
        const mappedRow = this.mapColumnAliases(row);

        // Validate row (without duplicate check - we'll handle that separately)
        const validation = await this.validateRowFast(
          mappedRow, 
          rowIndex, 
          new Set(), // Empty sets - we'll handle duplicates separately
          new Set()
        );
        
        if (!validation.isValid) {
          errors.push(...validation.errors);
          return { success: false, updated: false, skipped: false };
        }

        // Check if employee exists
        const existingEmployee = existingByCode.get(mappedRow.employee_code.toLowerCase()) ||
                                 existingByEmail.get(mappedRow.email.toLowerCase());

        if (existingEmployee) {
          // UPSERT: Compare and update if different
          const hasChanges = this.hasDataChanges(existingEmployee, mappedRow);
          
          if (hasChanges) {
            try {
              await EmployeeService.updateEmployee(existingEmployee.id, mappedRow);
              console.log(`🔄 Updated: ${mappedRow.employee_code}`);
              return { success: false, updated: true, skipped: false };
            } catch (err: any) {
              errors.push({
                row: rowIndex,
                field: 'database',
                message: `Lỗi update: ${err.message}`
              });
              return { success: false, updated: false, skipped: false };
            }
          } else {
            console.log(`⏭️ Skipped (no changes): ${mappedRow.employee_code}`);
            return { success: false, updated: false, skipped: true };
          }
        } else {
          // Insert new employee
          try {
            await EmployeeService.createEmployee(mappedRow);
            existingByCode.set(mappedRow.employee_code.toLowerCase(), mappedRow as any);
            existingByEmail.set(mappedRow.email.toLowerCase(), mappedRow as any);
            console.log(`✅ Added: ${mappedRow.employee_code}`);
            return { success: true, updated: false, skipped: false };
          } catch (err: any) {
            errors.push({
              row: rowIndex,
              field: 'database',
              message: err.message || 'Lỗi khi lưu vào database'
            });
            return { success: false, updated: false, skipped: false };
          }
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      // Count results
      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          if (result.value.success) successCount++;
          if (result.value.updated) updatedCount++;
          if (result.value.skipped) skippedCount++;
        }
      }

      console.log(`✅ Batch ${batchNum} complete: ${successCount} added, ${updatedCount} updated, ${skippedCount} skipped`);

      // Report progress
      if (onProgress) {
        onProgress(Math.min(i + BATCH_SIZE, rows.length), rows.length);
      }
    }

    console.log(`🎉 Import complete: ${successCount} added, ${updatedCount} updated, ${skippedCount} skipped, ${errors.length} errors`);

    return {
      totalRows: rows.length,
      successCount,
      updatedCount,
      skippedCount,
      errorCount: errors.length,
      errors
    };
  }

  // Check if data has changed (compare relevant fields)
  private static hasDataChanges(existing: any, newData: ParsedEmployee): boolean {
    const fieldsToCompare = [
      'full_name', 'email', 'phone', 'position', 'department', 'team',
      'employment_type', 'status', 'gender', 'birth_date', 'current_address',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
      'salary_p1', 'allowance_meal', 'allowance_fuel', 'allowance_phone', 'allowance_other',
      'salary_fulltime_probation', 'salary_fulltime_official',
      'salary_parttime_probation', 'salary_parttime_official'
    ];

    for (const field of fieldsToCompare) {
      const existingValue = existing[field];
      const newValue = (newData as any)[field];
      
      // Skip comparison if both are null/undefined
      if (!existingValue && !newValue) continue;
      
      // Compare values (convert to string for comparison)
      if (String(existingValue || '').trim() !== String(newValue || '').trim()) {
        return true;
      }
    }

    return false;
  }

  /**
   * Validate row format & business rules (fast validation for batch import)
   * NOTE: Does NOT check duplicates - UPSERT flow handles that separately
   */
  static async validateRowFast(
    row: ParsedEmployee, 
    rowIndex: number,
    existingCodes: Set<string>, // Not used - kept for backward compatibility
    existingEmails: Set<string> // Not used - kept for backward compatibility
  ): Promise<{ isValid: boolean; errors: ImportError[]; }> {
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
      errors.push({ 
        row: rowIndex, 
        field: 'join_date', 
        message: `Ngày vào làm không được để trống (giá trị hiện tại: ${row.join_date})` 
      });
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
    const salaryFields = [
      'salary_p1', 
      'allowance_meal', 
      'allowance_fuel', 
      'allowance_phone', 
      'allowance_other',
      'salary_fulltime_probation',
      'salary_fulltime_official',
      'salary_parttime_probation',
      'salary_parttime_official'
    ];
    for (const field of salaryFields) {
      const value = row[field as keyof ParsedEmployee];
      if (value !== undefined && value !== null && Number(value) < 0) {
        errors.push({ row: rowIndex, field, message: `${field} không được âm` });
      }
    }
    
    // Validate gender enum
    if (row.gender && !['Male', 'Female', 'Other'].includes(row.gender)) {
      errors.push({
        row: rowIndex,
        field: 'gender',
        message: `Giới tính không hợp lệ. Chỉ chấp nhận: Nam (Male), Nữ (Female), Khác (Other)`
      });
    }
    
    // Validate birth_date (age 16-100)
    if (row.birth_date) {
      const birthDate = new Date(row.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (isNaN(birthDate.getTime())) {
        errors.push({
          row: rowIndex,
          field: 'birth_date',
          message: `Ngày sinh không hợp lệ: ${row.birth_date}`
        });
      } else if (age < 16 || age > 100) {
        errors.push({
          row: rowIndex,
          field: 'birth_date',
          message: `Tuổi phải từ 16-100 (hiện tại: ${age})`
        });
      }
    }

    // Validate status enum
    if (row.status && !['active', 'inactive', 'probation', 'terminated'].includes(row.status)) {
      errors.push({
        row: rowIndex,
        field: 'status',
        message: `Trạng thái không hợp lệ. Chỉ chấp nhận: active, inactive, probation, terminated`
      });
    }

    // Validate KPI score
    if (row.kpi_score !== undefined && row.kpi_score !== null) {
      const kpi = Number(row.kpi_score);
      if (kpi < 0 || kpi > 100) {
        errors.push({
          row: rowIndex,
          field: 'kpi_score',
          message: `KPI phải từ 0-100: ${row.kpi_score}`
        });
      }
    }

    // Validate emergency contact phone (if exists)
    if (row.emergency_contact_phone && !/^0\d{9}$/.test(row.emergency_contact_phone.toString().trim())) {
      errors.push({
        row: rowIndex,
        field: 'emergency_contact_phone',
        message: `SĐT khẩn cấp phải có 10 số và bắt đầu bằng 0: ${row.emergency_contact_phone}`
      });
    }

    // Validate emergency contact relationship
    const validRelationships = ['Cha', 'Mẹ', 'Vợ', 'Chồng', 'Anh', 'Chị', 'Em', 'Khác'];
    if (row.emergency_contact_relationship && !validRelationships.includes(row.emergency_contact_relationship)) {
      errors.push({
        row: rowIndex,
        field: 'emergency_contact_relationship',
        message: `Quan hệ không hợp lệ. Chỉ chấp nhận: ${validRelationships.join(', ')}`
      });
    }

    // ✅ REMOVED: Duplicate checks - handled by UPSERT flow in importFromExcelBatch
    // Duplicates are not errors in UPSERT mode, they trigger update/skip logic

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static async parseExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { 
            type: 'binary',
            cellDates: true,  // ✅ Convert Excel date serial to JS Date
            cellNF: false,    // ✅ Don't parse number format
            raw: false        // ✅ Parse values as string/date instead of raw
          });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(firstSheet, {
            defval: '',       // ✅ Empty cells = '' instead of undefined
            raw: false        // ✅ Parse values
          });
          resolve(rows);
        } catch (err) {
          reject(new Error('Không thể đọc file Excel'));
        }
      };
      
      reader.onerror = () => reject(new Error('Lỗi khi đọc file'));
      reader.readAsBinaryString(file);
    });
  }

  static cleanHeaderKey(key: string): string {
    return key
      .replace(/\*/g, '')      // Remove asterisk
      .trim();                  // Remove whitespace
  }

  static convertDateToISO(value: any): string | null {
    if (!value) return null;
    
    // If already Date object (from cellDates: true)
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    // If string DD/MM/YYYY
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    // If Excel serial number (fallback)
    if (typeof value === 'number') {
      const date = new Date((value - 25569) * 86400 * 1000); // Excel epoch conversion
      return date.toISOString().split('T')[0];
    }
    
    return null;
  }

  static mapColumnAliases(row: any): ParsedEmployee {
    const mapped: any = {};
    
    for (const [key, value] of Object.entries(row)) {
      const cleanedKey = this.cleanHeaderKey(key);
      const normalizedKey = this.COLUMN_ALIASES[cleanedKey] || cleanedKey;
      
      // Convert date fields to ISO format
      if (normalizedKey === 'join_date' || normalizedKey === 'last_review_date' || normalizedKey === 'birth_date') {
        mapped[normalizedKey] = this.convertDateToISO(value);
      } 
      // Normalize gender (Vietnamese → English)
      else if (normalizedKey === 'gender') {
        if (value === 'Nam' || value === 'Male') mapped[normalizedKey] = 'Male';
        else if (value === 'Nữ' || value === 'Female') mapped[normalizedKey] = 'Female';
        else if (value === 'Khác' || value === 'Other') mapped[normalizedKey] = 'Other';
        else mapped[normalizedKey] = value;
      } 
      // ✅ Handle numeric fields - convert empty string to null
      else if (this.NUMERIC_FIELDS.includes(normalizedKey)) {
        if (value === '' || value === null || value === undefined) {
          mapped[normalizedKey] = null;
        } else {
          // Ensure it's a valid number
          const num = typeof value === 'number' ? value : parseFloat(String(value));
          mapped[normalizedKey] = isNaN(num) ? null : num;
        }
      }
      else {
        mapped[normalizedKey] = value;
      }
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
      errors.push({ 
        row: rowIndex, 
        field: 'join_date', 
        message: `Ngày vào làm không được để trống (giá trị hiện tại: ${row.join_date})` 
      });
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
    const salaryFields = [
      'salary_p1', 
      'allowance_meal', 
      'allowance_fuel', 
      'allowance_phone', 
      'allowance_other',
      'salary_fulltime_probation',
      'salary_fulltime_official',
      'salary_parttime_probation',
      'salary_parttime_official'
    ];
    for (const field of salaryFields) {
      const value = row[field as keyof ParsedEmployee];
      if (value !== undefined && value !== null && Number(value) < 0) {
        errors.push({ row: rowIndex, field, message: `${field} không được âm` });
      }
    }
    
    // Validate gender enum
    if (row.gender && !['Male', 'Female', 'Other'].includes(row.gender)) {
      errors.push({
        row: rowIndex,
        field: 'gender',
        message: `Giới tính không hợp lệ. Chỉ chấp nhận: Nam (Male), Nữ (Female), Khác (Other)`
      });
    }
    
    // Validate birth_date (age 16-100)
    if (row.birth_date) {
      const birthDate = new Date(row.birth_date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (isNaN(birthDate.getTime())) {
        errors.push({
          row: rowIndex,
          field: 'birth_date',
          message: `Ngày sinh không hợp lệ: ${row.birth_date}`
        });
      } else if (age < 16 || age > 100) {
        errors.push({
          row: rowIndex,
          field: 'birth_date',
          message: `Tuổi phải từ 16-100 (hiện tại: ${age})`
        });
      }
    }

    // Validate status enum
    if (row.status && !['active', 'inactive', 'probation', 'terminated'].includes(row.status)) {
      errors.push({
        row: rowIndex,
        field: 'status',
        message: `Trạng thái không hợp lệ. Chỉ chấp nhận: active, inactive, probation, terminated`
      });
    }

    // Validate KPI score
    if (row.kpi_score !== undefined && row.kpi_score !== null) {
      const kpi = Number(row.kpi_score);
      if (kpi < 0 || kpi > 100) {
        errors.push({
          row: rowIndex,
          field: 'kpi_score',
          message: `KPI phải từ 0-100: ${row.kpi_score}`
        });
      }
    }

    // Validate emergency contact phone (if exists)
    if (row.emergency_contact_phone && !/^0\d{9}$/.test(row.emergency_contact_phone.toString().trim())) {
      errors.push({
        row: rowIndex,
        field: 'emergency_contact_phone',
        message: `SĐT khẩn cấp phải có 10 số và bắt đầu bằng 0: ${row.emergency_contact_phone}`
      });
    }

    // Validate emergency contact relationship
    const validRelationships = ['Cha', 'Mẹ', 'Vợ', 'Chồng', 'Anh', 'Chị', 'Em', 'Khác'];
    if (row.emergency_contact_relationship && !validRelationships.includes(row.emergency_contact_relationship)) {
      errors.push({
        row: rowIndex,
        field: 'emergency_contact_relationship',
        message: `Quan hệ không hợp lệ. Chỉ chấp nhận: ${validRelationships.join(', ')}`
      });
    }

    // ✅ REMOVED: Duplicate checks - UPSERT flow handles existing records
    // Duplicates will be handled as UPDATE or SKIP, not validation errors

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
