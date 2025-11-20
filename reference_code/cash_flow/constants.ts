
import { Branch, Transaction, TransactionType, FundType, Supplier } from './types';

export const BRANCHES: Branch[] = [
  { id: 'b0', name: 'Văn phòng 438QT', code: 'VP438', isHeadOffice: true },
  { id: 'b1', name: '01. CN Tân Bình', code: 'CN01', isHeadOffice: false },
  { id: 'b2', name: '02. CN Q11', code: 'CN02', isHeadOffice: false },
  { id: 'b3', name: '03. CN Thủ Đức', code: 'CN03', isHeadOffice: false },
  { id: 'b4', name: '04. CN Bình Thạnh', code: 'CN04', isHeadOffice: false },
  { id: 'b5', name: '05. CN Quận 1', code: 'CN05', isHeadOffice: false },
  { id: 'b6', name: '06. CN Gò Vấp', code: 'CN06', isHeadOffice: false },
  { id: 'b7', name: '07. CN Quận 7', code: 'CN07', isHeadOffice: false },
  { id: 'b8', name: '08. CN Quận 12', code: 'CN08', isHeadOffice: false },
  { id: 'b9', name: '09. CN Quận 9', code: 'CN09', isHeadOffice: false },
];

export const CATEGORIES = {
  [TransactionType.INCOME]: [
    'Doanh thu bán hàng',
    'Dịch vụ tư vấn',
    'Thu hồi công nợ',
    'Đầu tư tài chính',
    'Khác',
  ],
  [TransactionType.EXPENSE]: [
    'Tiền thuê mặt bằng',
    'Lương nhân viên',
    'Nhập hàng hóa',
    'Văn phòng phẩm',
    'Điện/Nước/Internet',
    'Marketing/Quảng cáo',
    'Bảo trì thiết bị',
    'Tiếp khách',
    'Trả nợ nhà cung cấp',
    'Khác',
  ],
};

export const MOCK_SUPPLIERS: Supplier[] = [
  { id: 's1', name: 'Công ty NPP Á Châu', code: 'NCC01', initialDebt: 5000000, phone: '0909123456' },
  { id: 's2', name: 'VPP Hồng Hà', code: 'NCC02', initialDebt: 0, phone: '02838112233' },
  { id: 's3', name: 'Điện máy Xanh', code: 'NCC03', initialDebt: 12000000, phone: '18001061' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-20', amount: 50000000, type: TransactionType.INCOME, fundType: FundType.BANK, category: 'Doanh thu bán hàng', branchId: 'b1', description: 'Doanh thu tuần 3' },
  { id: 't2', date: '2024-05-21', amount: 15000000, type: TransactionType.EXPENSE, fundType: FundType.BANK, category: 'Tiền thuê mặt bằng', branchId: 'b1', description: 'Thanh toán tiền nhà T5' },
  { id: 't3', date: '2024-05-21', amount: 120000000, type: TransactionType.INCOME, fundType: FundType.BANK, category: 'Đầu tư tài chính', branchId: 'b0', description: 'Lợi nhuận từ quỹ đầu tư' },
  { id: 't4', date: '2024-05-22', amount: 5000000, type: TransactionType.EXPENSE, fundType: FundType.CASH, category: 'Văn phòng phẩm', branchId: 'b0', description: 'Mua giấy in và mực' },
  { id: 't5', date: '2024-05-22', amount: 35000000, type: TransactionType.INCOME, fundType: FundType.BANK, category: 'Dịch vụ tư vấn', branchId: 'b3', description: 'Hợp đồng tư vấn công ty A' },
  { id: 't6', date: '2024-05-23', amount: 8000000, type: TransactionType.EXPENSE, fundType: FundType.BANK, category: 'Điện/Nước/Internet', branchId: 'b3', description: 'Hóa đơn VNPT' },
  { id: 't7', date: '2024-05-23', amount: 42000000, type: TransactionType.INCOME, fundType: FundType.BANK, category: 'Doanh thu bán hàng', branchId: 'b5', description: 'Bán lô hàng #992' },
  { id: 't8', date: '2024-05-24', amount: 25000000, type: TransactionType.EXPENSE, fundType: FundType.BANK, category: 'Lương nhân viên', branchId: 'b5', description: 'Tạm ứng lương T5' },
  { id: 't9', date: '2024-05-24', amount: 2000000, type: TransactionType.EXPENSE, fundType: FundType.CASH, category: 'Tiếp khách', branchId: 'b1', description: 'Tiếp đối tác ăn trưa' },
  { id: 't10', date: '2024-05-25', amount: 5000000, type: TransactionType.INCOME, fundType: FundType.CASH, category: 'Thu hồi công nợ', branchId: 'b2', description: 'Khách lẻ trả tiền mặt' },
];
