import * as XLSX from 'xlsx';
import { Employee } from '../types';

export class ExportService {
  static exportToExcel(employees: Employee[], filename: string = 'employees.xlsx') {
    // Prepare data for export - Match Template headers exactly
    const data = employees.map((emp) => ({
      'MNV': emp.employeeCode,
      'Họ và tên': emp.fullName,
      'Email': emp.email,
      'SĐT': emp.phone || '',
      'Phòng ban': emp.department,
      'Chức danh': emp.position,
      'Nhóm': emp.team || '',
      'Ngày vào làm': emp.joinDate,
      'Loại công': emp.employmentType,
      'Lương cơ bản': emp.salary.basic || 0,
      'Phụ cấp ăn trưa': emp.salary.allowanceMeal || 0,
      'Phụ cấp xăng xe': emp.salary.allowanceFuel || 0,
      'Phụ cấp điện thoại': emp.salary.allowancePhone || 0,
      'Phụ cấp khác': emp.salary.allowanceOther || 0,
      'Ghi chú': emp.notes || ''
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths - Match Template structure
    const colWidths = [
      { wch: 10 },  // MNV
      { wch: 25 },  // Họ và tên
      { wch: 30 },  // Email
      { wch: 12 },  // SĐT
      { wch: 15 },  // Phòng ban
      { wch: 20 },  // Chức danh
      { wch: 15 },  // Nhóm
      { wch: 12 },  // Ngày vào làm
      { wch: 12 },  // Loại công
      { wch: 15 },  // Lương cơ bản
      { wch: 15 },  // Phụ cấp ăn trưa
      { wch: 15 },  // Phụ cấp xăng xe
      { wch: 15 },  // Phụ cấp điện thoại
      { wch: 15 },  // Phụ cấp khác
      { wch: 30 }   // Ghi chú
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Nhân Viên');

    // Generate and download file
    XLSX.writeFile(wb, filename);
  }
}
