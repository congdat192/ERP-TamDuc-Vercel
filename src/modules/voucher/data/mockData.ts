
// Central mock data cho toàn bộ module voucher
// Tất cả components sẽ import từ đây để đảm bảo đồng bộ

export interface Staff {
  id: string;
  name: string;
  type: 'telesale' | 'cskh';
  isActive: boolean;
  order: number;
}

export interface MockCustomerSource {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface MockCustomerType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface MockVoucherDenomination {
  id: string;
  value: number;
  label: string;
  isActive: boolean;
  order: number;
}

// Dữ liệu nhân viên mới theo yêu cầu
export const mockStaff: Staff[] = [
  { id: '1', name: 'Ngọc Mỹ', type: 'telesale', isActive: true, order: 1 },
  { id: '2', name: 'Nguyễn Liễu', type: 'telesale', isActive: true, order: 2 },
  { id: '3', name: 'Bảo Trâm', type: 'cskh', isActive: true, order: 3 },
  { id: '4', name: 'Anh Thy', type: 'cskh', isActive: true, order: 4 },
];

// Nguồn khách hàng - đồng bộ từ các Manager components
export const mockCustomerSources: MockCustomerSource[] = [
  { id: '1', name: 'Facebook', description: 'Khách hàng từ Facebook', isActive: true, order: 1 },
  { id: '2', name: 'Zalo', description: 'Khách hàng từ Zalo', isActive: true, order: 2 },
  { id: '3', name: 'Website', description: 'Khách hàng đăng ký từ website', isActive: true, order: 3 },
  { id: '4', name: 'Hotline', description: 'Khách hàng gọi hotline', isActive: true, order: 4 },
  { id: '5', name: 'Gọi khách hàng cũ theo data', description: 'Gọi theo dữ liệu khách hàng cũ', isActive: true, order: 5 },
  { id: '6', name: 'Khách hàng cũ xin lại voucher', description: 'Khách hàng cũ yêu cầu voucher mới', isActive: true, order: 6 },
  { id: '7', name: 'Xin lỗi khách hàng mới', description: 'Voucher xin lỗi cho khách hàng mới', isActive: true, order: 7 },
  { id: '8', name: 'Data gọi không phát được voucher trong 3 tháng', description: 'Dữ liệu khách hàng không nhận voucher trong 3 tháng', isActive: true, order: 8 },
];

// Loại khách hàng - đồng bộ từ các Manager components
export const mockCustomerTypes: MockCustomerType[] = [
  { id: '1', name: 'Khách hàng mới', description: 'Lần đầu sử dụng dịch vụ', isActive: true, order: 1 },
  { id: '2', name: 'Khách hàng cũ', description: 'Đã sử dụng dịch vụ', isActive: true, order: 2 },
  { id: '3', name: 'Khách hàng thân thiết', description: 'Đã sử dụng dịch vụ > 5 lần', isActive: true, order: 3 },
];

// Mệnh giá voucher - đồng bộ từ các Manager components
export const mockVoucherDenominations: MockVoucherDenomination[] = [
  { id: '1', value: 50000, label: '50.000đ', isActive: true, order: 1 },
];

// Helper functions để convert sang ComboboxOption format
export const getStaffComboboxOptions = () => 
  mockStaff
    .filter(staff => staff.isActive)
    .sort((a, b) => a.order - b.order)
    .map(staff => ({
      value: staff.id,
      label: staff.name,
      description: staff.type === 'telesale' ? 'Telesales' : 'CSKH'
    }));

export const getCustomerSourceComboboxOptions = () =>
  mockCustomerSources
    .filter(source => source.isActive)
    .sort((a, b) => a.order - b.order)
    .map(source => ({
      value: source.id,
      label: source.name,
      description: source.description
    }));

export const getCustomerTypeComboboxOptions = () =>
  mockCustomerTypes
    .filter(type => type.isActive)
    .sort((a, b) => a.order - b.order)
    .map(type => ({
      value: type.id,
      label: type.name,
      description: type.description
    }));

export const getDenominationComboboxOptions = () =>
  mockVoucherDenominations
    .filter(denomination => denomination.isActive)
    .sort((a, b) => a.order - b.order)
    .map(denomination => ({
      value: denomination.id,
      label: denomination.label,
      description: 'Mệnh giá voucher'
    }));

// Utility functions
export const getStaffById = (id: string) => mockStaff.find(staff => staff.id === id);
export const getCustomerSourceById = (id: string) => mockCustomerSources.find(source => source.id === id);
export const getCustomerTypeById = (id: string) => mockCustomerTypes.find(type => type.id === id);
export const getDenominationById = (id: string) => mockVoucherDenominations.find(denomination => denomination.id === id);
