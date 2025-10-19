import * as XLSX from 'xlsx';
import { Employee } from '../types';

export class ExportService {
  static exportToExcel(employees: Employee[], filename: string = 'employees.xlsx') {
    // Prepare data for export - Full 29 columns
    const data = employees.map((emp) => ({
      'MNV': emp.employeeCode,
      'Họ và tên': emp.fullName,
      'Email': emp.email,
      'SĐT': emp.phone || '',
      'Giới tính': emp.gender === 'Male' ? 'Nam' : 
                   emp.gender === 'Female' ? 'Nữ' : 
                   emp.gender === 'Other' ? 'Khác' : '',
      'Ngày sinh': emp.birthDate || '',
      'Phòng ban': emp.department,
      'Chức danh': emp.position,
      'Nhóm': emp.team || '',
      'Ngày vào làm': emp.joinDate,
      'Loại công': emp.employmentType,
      'Trạng thái': emp.status || '',
      'Lương cơ bản': emp.salary.basic || 0,
      'Phụ cấp ăn trưa': emp.salary.allowanceMeal || 0,
      'Phụ cấp xăng xe': emp.salary.allowanceFuel || 0,
      'Phụ cấp điện thoại': emp.salary.allowancePhone || 0,
      'Phụ cấp khác': emp.salary.allowanceOther || 0,
      'Tổng lương cứng': emp.salary.totalFixed || 0,
      'Lương Full-time Thử việc': emp.salary.fulltimeProbation || 0,
      'Lương Full-time Chính thức': emp.salary.fulltimeOfficial || 0,
      'Lương Part-time Thử việc': emp.salary.parttimeProbation || 0,
      'Lương Part-time Chính thức': emp.salary.parttimeOfficial || 0,
      'KPI': emp.performance.kpi || 0,
      'Ngày đánh giá': emp.performance.lastReview || '',
      'Địa chỉ hiện tại': emp.currentAddress || '',
      'Người liên hệ khẩn cấp': emp.emergencyContact?.name || '',
      'SĐT khẩn cấp': emp.emergencyContact?.phone || '',
      'Quan hệ': emp.emergencyContact?.relationship || '',
      'Ghi chú': emp.notes || ''
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths - 29 columns
    const colWidths = [
      { wch: 10 },  // MNV
      { wch: 25 },  // Họ và tên
      { wch: 30 },  // Email
      { wch: 12 },  // SĐT
      { wch: 10 },  // Giới tính
      { wch: 12 },  // Ngày sinh
      { wch: 15 },  // Phòng ban
      { wch: 20 },  // Chức danh
      { wch: 15 },  // Nhóm
      { wch: 12 },  // Ngày vào làm
      { wch: 12 },  // Loại công
      { wch: 12 },  // Trạng thái
      { wch: 15 },  // Lương cơ bản
      { wch: 15 },  // Phụ cấp ăn trưa
      { wch: 15 },  // Phụ cấp xăng xe
      { wch: 15 },  // Phụ cấp điện thoại
      { wch: 15 },  // Phụ cấp khác
      { wch: 15 },  // Tổng lương cứng
      { wch: 20 },  // Lương Full-time Thử việc
      { wch: 20 },  // Lương Full-time Chính thức
      { wch: 20 },  // Lương Part-time Thử việc
      { wch: 20 },  // Lương Part-time Chính thức
      { wch: 10 },  // KPI
      { wch: 12 },  // Ngày đánh giá
      { wch: 30 },  // Địa chỉ hiện tại
      { wch: 20 },  // Người liên hệ khẩn cấp
      { wch: 12 },  // SĐT khẩn cấp
      { wch: 10 },  // Quan hệ
      { wch: 30 }   // Ghi chú
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Nhân Viên');

    // Generate and download file
    XLSX.writeFile(wb, filename);
  }
}
