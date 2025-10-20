import * as XLSX from 'xlsx';

export class PayrollTemplateService {
  static generateTemplate() {
    const wb = XLSX.utils.book_new();

    // ==================== SHEET 1: HƯỚNG DẪN ====================
    const instructionData = [
      ['📋 HƯỚNG DẪN SỬ DỤNG TEMPLATE PHIẾU LƯƠNG'],
      [],
      ['✅ QUAN TRỌNG:'],
      ['• Tất cả số liệu phải tính toán TRƯỚC trong Excel'],
      ['• Hệ thống KHÔNG tự động tính toán'],
      ['• Điền đầy đủ cột TỔNG (Tổng Lương, Tổng Thưởng, Thực Nhận, v.v.)'],
      ['• Các cột có dấu (*) là BẮT BUỘC'],
      [],
      ['📝 CÁCH ĐIỀN:'],
      ['1. Mã nhân viên phải khớp với hệ thống (ví dụ: NV001, NV002)'],
      ['2. Tháng: Nhập số từ 1-12'],
      ['3. Năm: Nhập đầy đủ 4 chữ số (ví dụ: 2024)'],
      ['4. Số tiền: Nhập số nguyên không dấu phẩy (ví dụ: 15000000)'],
      ['5. Các trường để trống sẽ được tính là 0'],
      [],
      ['🔄 QUY TRÌNH:'],
      ['Import → Trạng thái "Nháp" → Admin/HR review → Phát hành → Nhân viên xem được'],
      [],
      ['⚠️ LƯU Ý:'],
      ['• Nếu số liệu sai, phải sửa trong Excel và import lại'],
      ['• Admin/HR có quyền phát hành và khóa phiếu lương'],
      ['• Sau khi khóa, không thể sửa được nữa'],
    ];
    const wsInstructions = XLSX.utils.aoa_to_sheet(instructionData);
    wsInstructions['!cols'] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng Dẫn');

    // ==================== SHEET 2: PHIẾU LƯƠNG ====================
    const headers = [
      // === THÔNG TIN CƠ BẢN ===
      'Tháng*',
      'Năm*',
      'Mã Nhân Viên*',
      'Họ và Tên*',
      'Phòng Ban',
      'Chức Danh',
      'Công Chuẩn',
      'PC Trách Nhiệm',
      
      // === THÔNG TIN LƯƠNG ===
      'Lương FT Thử Việc',
      'Lương FT Chính Thức',
      'Lương PT Chính Thức',
      'Lương PT Thử Việc',
      'PC Ăn/Ngày',
      
      // === (1) CÁC KHOẢN LƯƠNG ===
      'Công CT Thực Tế',
      'Công CT Lễ',
      'Công CT Chế Độ',
      'CT - OT Buổi',
      'CT - OT Ngày',
      'CT - OT Giờ',
      'Công TV Thực Tế',
      'Công TV Lễ',
      'Công TV Chế Độ',
      'TV - OT Buổi',
      'TV - OT Giờ',
      'Công Hệ Partime',
      'Ngày Nghỉ Phép',
      
      // === (2) CÁC KHOẢN THƯỞNG ===
      'Thưởng HĐ BH/CS',
      'Thưởng HĐ KTV',
      'Thưởng Hiệu Suất',
      'Phụ Cấp Trách Nhiệm',
      'Phụ Cấp Ăn',
      'Happy Birthday',
      'Phụ Cấp Gửi Xe',
      'Hỗ Trợ Khác 1',
      'Hỗ Trợ Khác 2',
      'Thanh Toán Phép Tồn',
      
      // === TỔNG HỢP ===
      'Tổng Lương (1)*',
      'Tổng Thưởng (2)*',
      'A. Tổng Thu Nhập*',
      
      // === (B) CÁC KHOẢN TRỪ ===
      'Trừ BHXH',
      'Trừ Khác',
      'Ứng Lương',
      'B. Tổng Các Khoản Trừ*',
      
      // === THỰC NHẬN ===
      'C. Thực Nhận*',
      
      // === CHI TIẾT THANH TOÁN ===
      'Đã Chi Tạm Ứng',
      'Đã Chi Ngày 3',
      'Chi Dự Ngày 15',
      'Tổng Công Ty Đã Chi*',
      'Chi Dư*',
      
      // === HOA HỒNG HÓA ĐƠN ===
      'HĐ 500K - SL',
      'HĐ 500K - Giá Trị',
      'HĐ 1tr - SL',
      'HĐ 1tr - Giá Trị',
      'Đơn Hoàn 500K - SL',
      'Đơn Hoàn 500K - Giá Trị',
      'Đơn Hoàn 1tr - SL',
      'Đơn Hoàn 1tr - Giá Trị',
      
      // === GHI CHÚ ===
      'Ghi Chú',
    ];

    // Sample data
    const sampleData = [
      3, 2024, 'NV001', 'Nguyễn Văn A', 'Kinh Doanh', 'Trưởng Phòng',
      26, 2000000, 0, 15000000, 0, 0, 30000,
      24, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1,
      2000000, 0, 1500000, 2000000, 720000, 200000, 300000, 0, 0, 0,
      14000000, 6720000, 20720000,
      1500000, 0, 3000000, 4500000,
      16220000,
      3000000, 5000000, 8220000, 16220000, 0,
      10, 5000000, 5, 5000000, 1, 500000, 0, 0,
      'Đây là dữ liệu mẫu. HR tự tính toán các cột TỔNG.',
    ];

    const wsData = XLSX.utils.aoa_to_sheet([headers, sampleData]);
    wsData['!cols'] = headers.map(() => ({ wch: 18 }));
    XLSX.utils.book_append_sheet(wb, wsData, 'Phiếu Lương');

    // Export file
    XLSX.writeFile(wb, `Template_Phieu_Luong_${new Date().getFullYear()}.xlsx`);
  }
}
