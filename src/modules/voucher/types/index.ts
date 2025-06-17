
export interface Voucher {
  id: string;
  code: string;
  value: string;
  customerName: string;
  customerPhone: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  usedDate?: string;
  notes?: string;
}

export interface VoucherIssueRequest {
  customerPhone: string;
  customerSource: string;
  customerType: string;
  voucherValue: string;
  notes?: string;
}

export interface VoucherReissueRequest {
  customerPhone: string;
  reason: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  lastVoucher?: string;
  totalVouchers: number;
  type: 'VIP' | 'Premium' | 'Regular';
}

// Staff interface
export interface Staff {
  id: string;
  name: string;
  type: 'telesale' | 'cskh';
  isActive: boolean;
  order: number;
}

// New configuration types
export interface VoucherDenomination {
  id: string;
  value: number;
  label: string;
  isActive: boolean;
  order: number;
}

export interface CustomerSource {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface CustomerType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  order: number;
}

export interface VoucherTemplate {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherSettings {
  denominations: VoucherDenomination[];
  customerSources: CustomerSource[];
  customerTypes: CustomerType[];
  staff: Staff[];
  templates: VoucherTemplate[];
  allowCustomValue: boolean;
  defaultTemplateId: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  description: string;
  placeholder: string;
}

export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  {
    key: '$tenKH',
    label: 'Tên Khách Hàng',
    description: 'Tên của khách hàng nhận voucher',
    placeholder: 'Nguyễn Văn An'
  },
  {
    key: '$mavoucher',
    label: 'Mã Voucher',
    description: 'Mã voucher được tạo tự động',
    placeholder: 'VCH-2024-001234'
  },
  {
    key: '$sdt',
    label: 'Số Điện Thoại',
    description: 'Số điện thoại khách hàng',
    placeholder: '0901234567'
  },
  {
    key: '$giatri',
    label: 'Giá Trị Voucher',
    description: 'Giá trị mệnh giá của voucher',
    placeholder: '50.000đ'
  },
  {
    key: '$hansudung',
    label: 'Hạn Sử Dụng',
    description: 'Ngày hết hạn của voucher',
    placeholder: '31/12/2024'
  },
  {
    key: '$nhanvien',
    label: 'Nhân Viên',
    description: 'Tên nhân viên phát hành voucher',
    placeholder: 'Trần Thị Lan'
  }
];
