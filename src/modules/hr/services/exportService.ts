import * as XLSX from 'xlsx';
import { Employee } from '../types';

export class ExportService {
  static exportToExcel(employees: Employee[], filename: string = 'employees.xlsx') {
    // Prepare data for export
    const data = employees.map((emp) => ({
      'Mã NV': emp.employeeCode,
      'Họ Tên': emp.fullName,
      'Email': emp.email,
      'Số ĐT': emp.phone,
      'Phòng Ban': emp.department,
      'Chức Vụ': emp.position,
      'Loại HĐ': emp.contractType,
      'Trạng Thái': emp.status === 'active' ? 'Đang làm' :
                    emp.status === 'probation' ? 'Thử việc' :
                    emp.status === 'inactive' ? 'Nghỉ việc' : 'Đã sa thải',
      'Ngày Vào Làm': emp.joinDate,
      'Lương Cơ Bản': emp.salary.p1,
      'Hệ Số': emp.salary.p2,
      'Phụ Cấp': emp.salary.p3,
      'Tổng Lương': emp.salary.total,
      'KPI': emp.performance.kpi,
      'Ngày Đánh Giá': emp.performance.lastReview || ''
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const colWidths = [
      { wch: 10 },  // Mã NV
      { wch: 25 },  // Họ Tên
      { wch: 30 },  // Email
      { wch: 12 },  // Số ĐT
      { wch: 15 },  // Phòng Ban
      { wch: 20 },  // Chức Vụ
      { wch: 12 },  // Loại HĐ
      { wch: 12 },  // Trạng Thái
      { wch: 12 },  // Ngày Vào Làm
      { wch: 15 },  // Lương Cơ Bản
      { wch: 8 },   // Hệ Số
      { wch: 12 },  // Phụ Cấp
      { wch: 15 },  // Tổng Lương
      { wch: 8 },   // KPI
      { wch: 12 }   // Ngày Đánh Giá
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Nhân Viên');

    // Generate and download file
    XLSX.writeFile(wb, filename);
  }
}
