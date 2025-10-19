import * as XLSX from 'xlsx';

export class TemplateService {
  static generateEmployeeTemplate() {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Sheet 1: Employee_Info (Template) - 29 columns
    const employeeInfoData = [
      [
        'MNV',
        'Họ và tên',
        'Email',
        'SĐT',
        'Giới tính',
        'Ngày sinh',
        'Phòng ban',
        'Chức danh',
        'Nhóm',
        'Ngày vào làm',
        'Loại công',
        'Trạng thái',
        'Lương cơ bản',
        'Phụ cấp ăn trưa',
        'Phụ cấp xăng xe',
        'Phụ cấp điện thoại',
        'Phụ cấp khác',
        'Tổng lương cứng',
        'Lương Full-time Thử việc',
        'Lương Full-time Chính thức',
        'Lương Part-time Thử việc',
        'Lương Part-time Chính thức',
        'KPI',
        'Ngày đánh giá',
        'Địa chỉ hiện tại',
        'Người liên hệ khẩn cấp',
        'SĐT khẩn cấp',
        'Quan hệ',
        'Ghi chú'
      ],
      [
        '(Bắt buộc)',
        '(Bắt buộc)',
        '(Bắt buộc)',
        '',
        '',
        '',
        '(Bắt buộc)',
        '(Bắt buộc)',
        '',
        '(Bắt buộc)',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
      ]
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(employeeInfoData);
    
    // Set column widths - 29 columns
    ws1['!cols'] = [
      { wch: 15 }, // MNV
      { wch: 25 }, // Họ và tên
      { wch: 30 }, // Email
      { wch: 15 }, // SĐT
      { wch: 10 }, // Giới tính
      { wch: 12 }, // Ngày sinh
      { wch: 20 }, // Phòng ban
      { wch: 20 }, // Chức danh
      { wch: 15 }, // Nhóm
      { wch: 18 }, // Ngày vào làm
      { wch: 15 }, // Loại công
      { wch: 12 }, // Trạng thái
      { wch: 18 }, // Lương cơ bản
      { wch: 18 }, // Phụ cấp ăn trưa
      { wch: 18 }, // Phụ cấp xăng xe
      { wch: 20 }, // Phụ cấp điện thoại
      { wch: 18 }, // Phụ cấp khác
      { wch: 18 }, // Tổng lương cứng
      { wch: 22 }, // Lương Full-time Thử việc
      { wch: 22 }, // Lương Full-time Chính thức
      { wch: 22 }, // Lương Part-time Thử việc
      { wch: 22 }, // Lương Part-time Chính thức
      { wch: 10 }, // KPI
      { wch: 18 }, // Ngày đánh giá
      { wch: 30 }, // Địa chỉ hiện tại
      { wch: 25 }, // Người liên hệ khẩn cấp
      { wch: 15 }, // SĐT khẩn cấp
      { wch: 12 }, // Quan hệ
      { wch: 30 }  // Ghi chú
    ];

    XLSX.utils.book_append_sheet(wb, ws1, 'Employee_Info');

    // Sheet 2: Data_Dictionary - 29 columns
    const dataDictionaryData = [
      ['Column', 'Type', 'Required', 'Format/Values', 'Example'],
      ['MNV', 'Text', 'Yes', 'Chữ in hoa và số, tối đa 20 ký tự', 'NV001'],
      ['Họ và tên', 'Text', 'Yes', '2-100 ký tự', 'Nguyễn Văn A'],
      ['Email', 'Email', 'Yes', 'Format email hợp lệ', 'nguyenvana@company.com'],
      ['SĐT', 'Text', 'No', '10 số, bắt đầu bằng 0', '0912345678'],
      ['Giới tính', 'Enum', 'No', 'Nam, Nữ, Khác', 'Nam'],
      ['Ngày sinh', 'Date', 'No', 'DD/MM/YYYY, tuổi từ 16-100', '15/05/1990'],
      ['Phòng ban', 'Text', 'Yes', 'Tối đa 100 ký tự', 'Kinh doanh'],
      ['Chức danh', 'Text', 'Yes', 'Tối đa 100 ký tự', 'Nhân viên kinh doanh'],
      ['Nhóm', 'Text', 'No', 'Tối đa 100 ký tự', 'Team A'],
      ['Ngày vào làm', 'Date', 'Yes', 'DD/MM/YYYY', '01/01/2024'],
      ['Loại công', 'Enum', 'No', 'Full-time, Part-time, CTV, Thử việc, Thực tập', 'Full-time'],
      ['Trạng thái', 'Enum', 'No', 'active, inactive, probation, terminated', 'active'],
      ['Lương cơ bản', 'Number', 'No', 'Số dương', '10000000'],
      ['Phụ cấp ăn trưa', 'Number', 'No', 'Số dương', '1000000'],
      ['Phụ cấp xăng xe', 'Number', 'No', 'Số dương', '500000'],
      ['Phụ cấp điện thoại', 'Number', 'No', 'Số dương', '300000'],
      ['Phụ cấp khác', 'Number', 'No', 'Số dương', '200000'],
      ['Tổng lương cứng', 'Number', 'No', 'Tự động tính (hiển thị tham khảo)', '12000000'],
      ['Lương Full-time Thử việc', 'Number', 'No', 'Số dương', '8000000'],
      ['Lương Full-time Chính thức', 'Number', 'No', 'Số dương', '12000000'],
      ['Lương Part-time Thử việc', 'Number', 'No', 'Số dương', '5000000'],
      ['Lương Part-time Chính thức', 'Number', 'No', 'Số dương', '7000000'],
      ['KPI', 'Number', 'No', 'Số từ 0-100', '85'],
      ['Ngày đánh giá', 'Date', 'No', 'DD/MM/YYYY', '01/06/2024'],
      ['Địa chỉ hiện tại', 'Text', 'No', 'Tối đa 500 ký tự', '123 Nguyễn Văn Linh, Q7, TP.HCM'],
      ['Người liên hệ khẩn cấp', 'Text', 'No', 'Tối đa 100 ký tự', 'Nguyễn Văn B'],
      ['SĐT khẩn cấp', 'Text', 'No', '10 số, bắt đầu bằng 0', '0987654321'],
      ['Quan hệ', 'Enum', 'No', 'Cha, Mẹ, Vợ, Chồng, Anh, Chị, Em, Khác', 'Cha'],
      ['Ghi chú', 'Text', 'No', 'Tối đa 1000 ký tự', 'Nhân viên mới']
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(dataDictionaryData);
    ws2['!cols'] = [
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 45 },
      { wch: 30 }
    ];
    XLSX.utils.book_append_sheet(wb, ws2, 'Data_Dictionary');

    // Sheet 3: Example_Data - 29 columns
    const exampleData = [
      [
        'MNV',
        'Họ và tên',
        'Email',
        'SĐT',
        'Giới tính',
        'Ngày sinh',
        'Phòng ban',
        'Chức danh',
        'Nhóm',
        'Ngày vào làm',
        'Loại công',
        'Trạng thái',
        'Lương cơ bản',
        'Phụ cấp ăn trưa',
        'Phụ cấp xăng xe',
        'Phụ cấp điện thoại',
        'Phụ cấp khác',
        'Tổng lương cứng',
        'Lương Full-time Thử việc',
        'Lương Full-time Chính thức',
        'Lương Part-time Thử việc',
        'Lương Part-time Chính thức',
        'KPI',
        'Ngày đánh giá',
        'Địa chỉ hiện tại',
        'Người liên hệ khẩn cấp',
        'SĐT khẩn cấp',
        'Quan hệ',
        'Ghi chú'
      ],
      [
        'NV001',
        'Nguyễn Văn A',
        'nguyenvana@company.com',
        '0912345678',
        'Nam',
        '15/05/1985',
        'Kinh doanh',
        'Trưởng phòng',
        'Team A',
        '01/01/2024',
        'Full-time',
        'active',
        15000000,
        1000000,
        500000,
        300000,
        200000,
        17000000,
        10000000,
        15000000,
        0,
        0,
        85,
        '01/06/2024',
        '123 Lê Lợi, Q1, TP.HCM',
        'Nguyễn Văn B',
        '0987654321',
        'Cha',
        'Nhân viên chính thức'
      ],
      [
        'NV002',
        'Trần Thị B',
        'tranthib@company.com',
        '0987654322',
        'Nữ',
        '20/08/1992',
        'Marketing',
        'Nhân viên Marketing',
        'Team B',
        '15/02/2024',
        'Full-time',
        'active',
        10000000,
        1000000,
        500000,
        300000,
        0,
        11800000,
        8000000,
        10000000,
        0,
        0,
        90,
        '01/06/2024',
        '456 Nguyễn Huệ, Q1, TP.HCM',
        'Trần Văn C',
        '0901234567',
        'Mẹ',
        ''
      ],
      [
        'NV003',
        'Lê Văn C',
        'levanc@company.com',
        '0912345679',
        'Nam',
        '10/12/2002',
        'Kỹ thuật',
        'Thực tập sinh',
        '',
        '01/03/2024',
        'Thực tập',
        'probation',
        5000000,
        0,
        0,
        0,
        0,
        5000000,
        0,
        0,
        3000000,
        5000000,
        0,
        '',
        '',
        '',
        '',
        '',
        'Thực tập 3 tháng'
      ]
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(exampleData);
    // Set column widths - 29 columns
    ws3['!cols'] = [
      { wch: 15 }, // MNV
      { wch: 25 }, // Họ và tên
      { wch: 30 }, // Email
      { wch: 15 }, // SĐT
      { wch: 10 }, // Giới tính
      { wch: 12 }, // Ngày sinh
      { wch: 20 }, // Phòng ban
      { wch: 20 }, // Chức danh
      { wch: 15 }, // Nhóm
      { wch: 18 }, // Ngày vào làm
      { wch: 15 }, // Loại công
      { wch: 12 }, // Trạng thái
      { wch: 18 }, // Lương cơ bản
      { wch: 18 }, // Phụ cấp ăn trưa
      { wch: 18 }, // Phụ cấp xăng xe
      { wch: 20 }, // Phụ cấp điện thoại
      { wch: 18 }, // Phụ cấp khác
      { wch: 18 }, // Tổng lương cứng
      { wch: 22 }, // Lương Full-time Thử việc
      { wch: 22 }, // Lương Full-time Chính thức
      { wch: 22 }, // Lương Part-time Thử việc
      { wch: 22 }, // Lương Part-time Chính thức
      { wch: 10 }, // KPI
      { wch: 18 }, // Ngày đánh giá
      { wch: 30 }, // Địa chỉ hiện tại
      { wch: 25 }, // Người liên hệ khẩn cấp
      { wch: 15 }, // SĐT khẩn cấp
      { wch: 12 }, // Quan hệ
      { wch: 30 }  // Ghi chú
    ];
    XLSX.utils.book_append_sheet(wb, ws3, 'Example_Data');

    // Write file
    XLSX.writeFile(wb, 'Template_Nhan_Vien.xlsx');
  }
}
