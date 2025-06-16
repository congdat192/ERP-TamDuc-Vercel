
import { FilterField } from '../types/filter';

export const CUSTOMER_FIELDS: FilterField[] = [
  {
    id: 'customer_group',
    label: 'Nhóm khách hàng',
    type: 'select',
    category: 'customer',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { value: '1.Giới thiệu', label: '1.Giới thiệu' },
      { value: '2.Khách lẻ', label: '2.Khách lẻ' },
      { value: '3.Doanh nghiệp', label: '3.Doanh nghiệp' }
    ]
  },
  {
    id: 'customer_name',
    label: 'Tên khách hàng',
    type: 'string',
    category: 'customer',
    operators: ['contains', 'not_contains', 'starts_with', 'ends_with', 'equals']
  },
  {
    id: 'customer_phone',
    label: 'Số điện thoại',
    type: 'string',
    category: 'customer',
    operators: ['contains', 'starts_with', 'equals']
  },
  {
    id: 'customer_email',
    label: 'Email',
    type: 'string',
    category: 'customer',
    operators: ['contains', 'ends_with', 'equals']
  },
  {
    id: 'customer_address',
    label: 'Địa chỉ',
    type: 'string',
    category: 'customer',
    operators: ['contains', 'equals']
  },
  {
    id: 'delivery_area',
    label: 'Khu vực giao hàng',
    type: 'select',
    category: 'customer',
    operators: ['equals', 'not_equals', 'in', 'not_in'],
    options: [
      { value: 'Quận 1', label: 'Quận 1' },
      { value: 'Quận 2', label: 'Quận 2' },
      { value: 'Quận 3', label: 'Quận 3' },
      { value: 'Quận 5', label: 'Quận 5' },
      { value: 'Quận 7', label: 'Quận 7' }
    ]
  },
  {
    id: 'total_spent',
    label: 'Tổng chi tiêu',
    type: 'number',
    category: 'customer',
    operators: ['greater_than', 'less_than', 'greater_equal', 'less_equal', 'between', 'equals']
  },
  {
    id: 'points',
    label: 'Điểm tích lũy',
    type: 'number',
    category: 'customer',
    operators: ['greater_than', 'less_than', 'greater_equal', 'less_equal', 'between', 'equals']
  },
  {
    id: 'total_debt',
    label: 'Tổng nợ',
    type: 'number',
    category: 'customer',
    operators: ['greater_than', 'less_than', 'greater_equal', 'less_equal', 'equals']
  },
  {
    id: 'created_date',
    label: 'Ngày đăng ký',
    type: 'date',
    category: 'customer',
    operators: ['greater_than', 'less_than', 'between', 'equals']
  },
  {
    id: 'status',
    label: 'Trạng thái',
    type: 'select',
    category: 'customer',
    operators: ['equals', 'not_equals'],
    options: [
      { value: 'Hoạt động', label: 'Hoạt động' },
      { value: 'Ngưng hoạt động', label: 'Ngưng hoạt động' }
    ]
  }
];

export const INVOICE_FIELDS: FilterField[] = [
  {
    id: 'invoice_count',
    label: 'Số lượng hóa đơn',
    type: 'number',
    category: 'invoice',
    operators: ['greater_than', 'less_than', 'greater_equal', 'less_equal', 'equals']
  },
  {
    id: 'total_invoice_value',
    label: 'Tổng giá trị hóa đơn',
    type: 'number',
    category: 'invoice',
    operators: ['greater_than', 'less_than', 'greater_equal', 'less_equal', 'between']
  },
  {
    id: 'last_purchase_date',
    label: 'Ngày mua gần nhất',
    type: 'date',
    category: 'invoice',
    operators: ['greater_than', 'less_than', 'between']
  },
  {
    id: 'invoice_status',
    label: 'Trạng thái hóa đơn',
    type: 'select',
    category: 'invoice',
    operators: ['equals', 'not_equals', 'in'],
    options: [
      { value: 'Hoàn thành', label: 'Hoàn thành' },
      { value: 'Đang xử lý', label: 'Đang xử lý' },
      { value: 'Đã hủy', label: 'Đã hủy' }
    ]
  },
  {
    id: 'purchase_channel',
    label: 'Kênh mua hàng',
    type: 'select',
    category: 'invoice',
    operators: ['equals', 'not_equals', 'in'],
    options: [
      { value: 'Website', label: 'Website' },
      { value: 'Cửa hàng', label: 'Cửa hàng' },
      { value: 'Điện thoại', label: 'Điện thoại' }
    ]
  },
  {
    id: 'branch',
    label: 'Chi nhánh',
    type: 'select',
    category: 'invoice',
    operators: ['equals', 'not_equals', 'in'],
    options: [
      { value: 'Chi nhánh Quận 1', label: 'Chi nhánh Quận 1' },
      { value: 'Chi nhánh Quận 2', label: 'Chi nhánh Quận 2' },
      { value: 'Chi nhánh Quận 3', label: 'Chi nhánh Quận 3' },
      { value: 'Chi nhánh Quận 5', label: 'Chi nhánh Quận 5' },
      { value: 'Chi nhánh Quận 7', label: 'Chi nhánh Quận 7' }
    ]
  },
  {
    id: 'average_order_value',
    label: 'Giá trị đơn hàng trung bình',
    type: 'number',
    category: 'invoice',
    operators: ['greater_than', 'less_than', 'greater_equal', 'less_equal', 'between']
  }
];

export const PRODUCT_FIELDS: FilterField[] = [
  {
    id: 'purchased_products',
    label: 'Đã mua sản phẩm',
    type: 'multiselect',
    category: 'product',
    operators: ['in', 'not_in'],
    options: [
      { value: 'SP001', label: 'iPhone 14 Pro Max 256GB' },
      { value: 'SP002', label: 'Samsung Galaxy S23 Ultra 256GB' },
      { value: 'SP003', label: 'Xiaomi 13 256GB' },
      { value: 'SP004', label: 'MacBook Air 15" M2 256GB' },
      { value: 'SP005', label: 'AirPods 3rd Generation' }
    ]
  },
  {
    id: 'product_category',
    label: 'Đã mua nhóm sản phẩm',
    type: 'multiselect',
    category: 'product',
    operators: ['in', 'not_in'],
    options: [
      { value: 'Điện thoại', label: 'Điện thoại' },
      { value: 'Laptop', label: 'Laptop' },
      { value: 'Phụ kiện', label: 'Phụ kiện' }
    ]
  },
  {
    id: 'product_brand',
    label: 'Đã mua thương hiệu',
    type: 'multiselect',
    category: 'product',
    operators: ['in', 'not_in'],
    options: [
      { value: 'Apple', label: 'Apple' },
      { value: 'Samsung', label: 'Samsung' },
      { value: 'Xiaomi', label: 'Xiaomi' }
    ]
  },
  {
    id: 'product_quantity',
    label: 'Số lượng sản phẩm đã mua',
    type: 'number',
    category: 'product',
    operators: ['greater_than', 'less_than', 'greater_equal', 'less_equal', 'equals']
  },
  {
    id: 'never_purchased_category',
    label: 'Chưa từng mua nhóm SP',
    type: 'multiselect',
    category: 'product',
    operators: ['not_in'],
    options: [
      { value: 'Điện thoại', label: 'Điện thoại' },
      { value: 'Laptop', label: 'Laptop' },
      { value: 'Phụ kiện', label: 'Phụ kiện' }
    ]
  }
];

export const ALL_FILTER_FIELDS = [...CUSTOMER_FIELDS, ...INVOICE_FIELDS, ...PRODUCT_FIELDS];

export const getFieldById = (id: string): FilterField | undefined => {
  return ALL_FILTER_FIELDS.find(field => field.id === id);
};

export const getFieldsByCategory = (category: 'customer' | 'invoice' | 'product'): FilterField[] => {
  return ALL_FILTER_FIELDS.filter(field => field.category === category);
};
