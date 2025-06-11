
// Enhanced mock data for inventory filters

export interface CategoryNode {
  id: string;
  name: string;
  productCount: number;
  children?: CategoryNode[];
  expanded?: boolean;
}

export interface AttributeOption {
  value: string;
  label: string;
}

export interface ProductAttribute {
  key: string;
  label: string;
  options: AttributeOption[];
}

// Tree structure for product categories
export const categoryTree: CategoryNode[] = [
  {
    id: 'electronics',
    name: 'Điện tử',
    productCount: 156,
    children: [
      {
        id: 'phones',
        name: 'Điện thoại',
        productCount: 89,
        children: [
          { id: 'iphone', name: 'iPhone', productCount: 25 },
          { id: 'samsung', name: 'Samsung', productCount: 32 },
          { id: 'xiaomi', name: 'Xiaomi', productCount: 18 },
          { id: 'oppo', name: 'Oppo', productCount: 14 }
        ]
      },
      {
        id: 'laptops',
        name: 'Laptop',
        productCount: 45,
        children: [
          { id: 'macbook', name: 'MacBook', productCount: 15 },
          { id: 'dell', name: 'Dell', productCount: 12 },
          { id: 'asus', name: 'Asus', productCount: 18 }
        ]
      },
      {
        id: 'accessories',
        name: 'Phụ kiện',
        productCount: 22,
        children: [
          { id: 'cases', name: 'Ốp lưng', productCount: 8 },
          { id: 'chargers', name: 'Sạc', productCount: 7 },
          { id: 'headphones', name: 'Tai nghe', productCount: 7 }
        ]
      }
    ]
  },
  {
    id: 'fashion',
    name: 'Thời trang',
    productCount: 234,
    children: [
      {
        id: 'clothing',
        name: 'Quần áo',
        productCount: 156,
        children: [
          { id: 'shirts', name: 'Áo sơ mi', productCount: 45 },
          { id: 'pants', name: 'Quần', productCount: 38 },
          { id: 'dresses', name: 'Váy', productCount: 73 }
        ]
      },
      {
        id: 'shoes',
        name: 'Giày dép',
        productCount: 78,
        children: [
          { id: 'sneakers', name: 'Giày thể thao', productCount: 34 },
          { id: 'formal', name: 'Giày tây', productCount: 22 },
          { id: 'sandals', name: 'Dép', productCount: 22 }
        ]
      }
    ]
  },
  {
    id: 'home',
    name: 'Gia dụng',
    productCount: 89,
    children: [
      { id: 'kitchen', name: 'Nhà bếp', productCount: 45 },
      { id: 'cleaning', name: 'Vệ sinh', productCount: 23 },
      { id: 'decoration', name: 'Trang trí', productCount: 21 }
    ]
  }
];

// Product attributes with options
export const productAttributes: ProductAttribute[] = [
  // Main attributes (always visible)
  {
    key: 'design',
    label: 'THIẾT KẾ',
    options: [
      { value: 'modern', label: 'Hiện đại' },
      { value: 'classic', label: 'Cổ điển' },
      { value: 'minimalist', label: 'Tối giản' },
      { value: 'luxury', label: 'Sang trọng' }
    ]
  },
  {
    key: 'extract',
    label: 'CHIẾT XUẤT',
    options: [
      { value: 'natural', label: 'Tự nhiên' },
      { value: 'synthetic', label: 'Tổng hợp' },
      { value: 'organic', label: 'Hữu cơ' },
      { value: 'premium', label: 'Cao cấp' }
    ]
  },
  {
    key: 'coating',
    label: 'LỚP PHỦ',
    options: [
      { value: 'matte', label: 'Nhám' },
      { value: 'glossy', label: 'Bóng' },
      { value: 'satin', label: 'Satin' },
      { value: 'textured', label: 'Có họa tiết' }
    ]
  },
  // Extended attributes (shown when expanded)
  {
    key: 'style',
    label: 'KIỂU DÁNG',
    options: [
      { value: 'round', label: 'Tròn' },
      { value: 'square', label: 'Vuông' },
      { value: 'rectangular', label: 'Chữ nhật' },
      { value: 'oval', label: 'Oval' }
    ]
  },
  {
    key: 'nose',
    label: 'VE MŨI',
    options: [
      { value: 'straight', label: 'Thẳng' },
      { value: 'curved', label: 'Cong' },
      { value: 'pointed', label: 'Nhọn' },
      { value: 'rounded', label: 'Tròn' }
    ]
  },
  {
    key: 'size',
    label: 'SIZE',
    options: [
      { value: 'xs', label: 'XS' },
      { value: 's', label: 'S' },
      { value: 'm', label: 'M' },
      { value: 'l', label: 'L' },
      { value: 'xl', label: 'XL' },
      { value: 'xxl', label: 'XXL' }
    ]
  },
  {
    key: 'material',
    label: 'CHẤT LIỆU',
    options: [
      { value: 'cotton', label: 'Cotton' },
      { value: 'polyester', label: 'Polyester' },
      { value: 'leather', label: 'Da' },
      { value: 'metal', label: 'Kim loại' },
      { value: 'plastic', label: 'Nhựa' },
      { value: 'wood', label: 'Gỗ' }
    ]
  }
];

// Stock status options
export const stockStatusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'below_min', label: 'Dưới định mức tồn' },
  { value: 'above_max', label: 'Vượt định mức tồn' },
  { value: 'in_stock', label: 'Còn hàng trong kho' },
  { value: 'out_of_stock', label: 'Hết hàng trong kho' },
  { value: 'custom', label: 'Tùy chỉnh giá trị tồn' }
];

// Product type options
export const productTypeOptions = [
  { value: 'normal', label: 'Hàng hóa thường' },
  { value: 'batch_expiry', label: 'Hàng hóa – lô/hạn sử dụng' },
  { value: 'service', label: 'Dịch vụ' },
  { value: 'combo', label: 'Combo – đóng gói' }
];

// Time presets for different filter types
export const timePresets = {
  outOfStock: {
    daily: [
      { value: 'tomorrow', label: 'Ngày mai' },
      { value: 'day_after', label: 'Ngày kia' },
      { value: '3_days', label: '3 ngày tới' },
      { value: '5_days', label: '5 ngày tới' },
      { value: '7_days', label: '7 ngày tới' }
    ],
    period: [
      { value: 'this_week', label: 'Tuần này' },
      { value: '2_weeks', label: '2 tuần tới' },
      { value: 'this_month', label: 'Tháng này' },
      { value: '30_days', label: '30 ngày tới' }
    ]
  },
  created: {
    recent: [
      { value: 'today', label: 'Hôm nay' },
      { value: 'yesterday', label: 'Hôm qua' },
      { value: '7_days_ago', label: '7 ngày qua' }
    ],
    period: [
      { value: 'this_week', label: 'Tuần này' },
      { value: 'last_week', label: 'Tuần trước' },
      { value: 'this_month', label: 'Tháng này' },
      { value: 'last_month', label: 'Tháng trước' },
      { value: 'this_quarter', label: 'Quý này' },
      { value: 'this_year', label: 'Năm này' },
      { value: 'lunar', label: 'Âm lịch' }
    ]
  }
};

// Brands for dropdown
export const brandOptions = [
  'Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Vivo', 'Nokia', 'Huawei', 'Realme',
  'Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance'
];

// Locations for dropdown
export const locationOptions = [
  'Kho A1', 'Kho A2', 'Kho B1', 'Kho B2', 'Kho C1', 'Kho C2',
  'Showroom 1', 'Showroom 2', 'Showroom 3', 'Chi nhánh Quận 1',
  'Chi nhánh Quận 3', 'Chi nhánh Quận 7'
];
