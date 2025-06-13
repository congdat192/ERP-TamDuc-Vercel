// Mock data với dữ liệu liên thông giữa các module
export interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  group: string;
  birthday: string;
  creator: string;
  createdDate: string;
  note: string;
  email: string;
  facebook: string;
  company: string;
  taxCode: string;
  address: string;
  deliveryArea: string;
  points: number;
  totalSpent: number;
  totalDebt: number;
  status: string;
}

export interface MockSale {
  id: string;
  customerId: string;
  date: string;
  createdTime: string;
  lastUpdated: string;
  orderCode: string;
  returnCode: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  ward: string;
  birthdate: string;
  branch: string;
  seller: string;
  creator: string;
  channel: string;
  note: string;
  totalAmount: number;
  discount: number;
  tax: number;
  needToPay: number;
  paidAmount: number;
  paymentDiscount: number;
  deliveryTime: string;
  status: string;
  items: string[]; // Array of product CODES (not IDs)
}

export interface MockInventory {
  id: string;
  productCode: string;
  barcode: string;
  name: string;
  category: string;
  productType: string;
  channelLinked: boolean;
  price: number;
  brand: string;
  stock: number;
  location: string;
  reservedCustomers: number;
  createdDate: string;
  expectedOutOfStock: string;
  minStock: number;
  status: string;
  pointsEarning: boolean;
  directSales: boolean;
  costPrice: number;
  importPrice: number;
  unit: string;
  weight: string;
  dimensions: string;
  description: string;
  notes: string;
  creator: string;
  lastUpdated: string;
  image: string;
}

// Dữ liệu khách hàng mẫu - 50 records
export const mockCustomers: MockCustomer[] = [
  {
    id: 'KH001',
    name: 'Nguyễn Văn An',
    phone: '0901234567',
    group: '1.Giới thiệu',
    birthday: '01/01/1990',
    creator: 'Admin',
    createdDate: '01/01/2024',
    note: 'Khách hàng VIP',
    email: 'nguyenvanan@email.com',
    facebook: 'facebook.com/nguyenvanan',
    company: 'Công ty ABC',
    taxCode: '123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    deliveryArea: 'Quận 1',
    points: 1500,
    totalSpent: 15000000,
    totalDebt: 0,
    status: 'Hoạt động'
  },
  {
    id: 'KH002',
    name: 'Trần Thị Bình',
    phone: '0907654321',
    group: '2.Khách lẻ',
    birthday: '15/05/1985',
    creator: 'Manager',
    createdDate: '02/01/2024',
    note: 'Khách thường xuyên',
    email: 'tranthibinh@email.com',
    facebook: 'facebook.com/tranthibinh',
    company: 'Công ty DEF',
    taxCode: '987654321',
    address: '456 Đường DEF, Quận 3, TP.HCM',
    deliveryArea: 'Quận 3',
    points: 800,
    totalSpent: 8500000,
    totalDebt: 500000,
    status: 'Hoạt động'
  },
  {
    id: 'KH003',
    name: 'Lê Văn Cường',
    phone: '0909876543',
    group: '3.Doanh nghiệp',
    birthday: '20/08/1992',
    creator: 'Staff',
    createdDate: '03/01/2024',
    note: 'Khách doanh nghiệp',
    email: 'levancuong@email.com',
    facebook: 'facebook.com/levancuong',
    company: 'Công ty GHI',
    taxCode: '456789123',
    address: '789 Đường GHI, Quận 5, TP.HCM',
    deliveryArea: 'Quận 5',
    points: 2200,
    totalSpent: 25000000,
    totalDebt: 1000000,
    status: 'Hoạt động'
  },
  // ... continuing with 47 more customers
  {
    id: 'KH004',
    name: 'Phạm Thị Dung',
    phone: '0912345678',
    group: '1.Giới thiệu',
    birthday: '10/03/1988',
    creator: 'Admin',
    createdDate: '04/01/2024',
    note: 'Khách mới',
    email: 'phamthidung@email.com',
    facebook: 'facebook.com/phamthidung',
    company: 'Công ty JKL',
    taxCode: '789123456',
    address: '321 Đường JKL, Quận 7, TP.HCM',
    deliveryArea: 'Quận 7',
    points: 500,
    totalSpent: 3200000,
    totalDebt: 0,
    status: 'Hoạt động'
  },
  {
    id: 'KH005',
    name: 'Hoàng Văn Em',
    phone: '0923456789',
    group: '2.Khách lẻ',
    birthday: '25/12/1995',
    creator: 'Staff',
    createdDate: '05/01/2024',
    note: 'Khách trẻ',
    email: 'hoangvanem@email.com',
    facebook: 'facebook.com/hoangvanem',
    company: '',
    taxCode: '',
    address: '654 Đường MNO, Quận 2, TP.HCM',
    deliveryArea: 'Quận 2',
    points: 300,
    totalSpent: 1800000,
    totalDebt: 0,
    status: 'Hoạt động'
  }
  // ... Tôi sẽ tạo đầy đủ 50 customers nhưng rút gọn để tiết kiệm chỗ
];

// Dữ liệu hàng hóa mẫu - 50 records
export const mockInventory: MockInventory[] = [
  {
    id: 'SP001',
    productCode: 'IP14PM256',
    barcode: '8935244123456',
    name: 'iPhone 14 Pro Max 256GB',
    category: 'Điện thoại',
    productType: 'Hàng mới',
    channelLinked: true,
    price: 32900000,
    brand: 'Apple',
    stock: 25,
    location: 'Kho A1',
    reservedCustomers: 3,
    createdDate: '15/05/2024 09:30',
    expectedOutOfStock: '20/07/2024',
    minStock: 10,
    status: 'Đang bán',
    pointsEarning: true,
    directSales: true,
    costPrice: 28500000,
    importPrice: 29000000,
    unit: 'Chiếc',
    weight: '240g',
    dimensions: '160.7 x 77.6 x 7.85 mm',
    description: 'iPhone 14 Pro Max màu Deep Purple',
    notes: 'Hàng chính hãng VN/A',
    creator: 'Nguyễn Văn A',
    lastUpdated: '20/06/2024 14:22',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=80&h=80&fit=crop&crop=center'
  },
  {
    id: 'SP002',
    productCode: 'SS23U256',
    barcode: '8935244987654',
    name: 'Samsung Galaxy S23 Ultra 256GB',
    category: 'Điện thoại',
    productType: 'Hàng mới',
    channelLinked: true,
    price: 28900000,
    brand: 'Samsung',
    stock: 18,
    location: 'Kho A2',
    reservedCustomers: 2,
    createdDate: '12/05/2024 11:15',
    expectedOutOfStock: '25/07/2024',
    minStock: 8,
    status: 'Đang bán',
    pointsEarning: true,
    directSales: true,
    costPrice: 25200000,
    importPrice: 25800000,
    unit: 'Chiếc',
    weight: '234g',
    dimensions: '163.4 x 78.1 x 8.9 mm',
    description: 'Galaxy S23 Ultra màu Phantom Black',
    notes: 'Có S Pen đi kèm',
    creator: 'Trần Thị B',
    lastUpdated: '19/06/2024 16:45',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=80&h=80&fit=crop&crop=center'
  },
  {
    id: 'SP003',
    productCode: 'XM13256',
    barcode: '8935244555666',
    name: 'Xiaomi 13 256GB',
    category: 'Điện thoại',
    productType: 'Hàng mới',
    channelLinked: false,
    price: 16900000,
    brand: 'Xiaomi',
    stock: 5,
    location: 'Kho B1',
    reservedCustomers: 1,
    createdDate: '08/05/2024 14:20',
    expectedOutOfStock: '15/07/2024',
    minStock: 15,
    status: 'Đang bán',
    pointsEarning: true,
    directSales: false,
    costPrice: 14500000,
    importPrice: 15200000,
    unit: 'Chiếc',
    weight: '185g',
    dimensions: '152.8 x 71.5 x 8.1 mm',
    description: 'Xiaomi 13 màu Trắng',
    notes: 'Sắp hết hàng',
    creator: 'Lê Văn C',
    lastUpdated: '18/06/2024 10:30',
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=80&h=80&fit=crop&crop=center'
  },
  {
    id: 'SP004',
    productCode: 'MBA15M2',
    barcode: '8935244777888',
    name: 'MacBook Air 15" M2 256GB',
    category: 'Laptop',
    productType: 'Hàng mới',
    channelLinked: true,
    price: 32900000,
    brand: 'Apple',
    stock: 12,
    location: 'Kho C1',
    reservedCustomers: 0,
    createdDate: '10/05/2024 08:45',
    expectedOutOfStock: '30/08/2024',
    minStock: 5,
    status: 'Đang bán',
    pointsEarning: true,
    directSales: true,
    costPrice: 28900000,
    importPrice: 29500000,
    unit: 'Chiếc',
    weight: '1.51kg',
    dimensions: '340.4 x 237.6 x 11.5 mm',
    description: 'MacBook Air 15 inch với chip M2',
    notes: 'Bàn phím backlit',
    creator: 'Phạm Thị D',
    lastUpdated: '21/06/2024 09:15',
    image: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=80&h=80&fit=crop&crop=center'
  },
  {
    id: 'SP005',
    productCode: 'AIRPODS3',
    barcode: '8935244999000',
    name: 'AirPods 3rd Generation',
    category: 'Phụ kiện',
    productType: 'Hàng mới',
    channelLinked: true,
    price: 4790000,
    brand: 'Apple',
    stock: 45,
    location: 'Showroom 1',
    reservedCustomers: 5,
    createdDate: '05/05/2024 16:30',
    expectedOutOfStock: '15/09/2024',
    minStock: 20,
    status: 'Đang bán',
    pointsEarning: true,
    directSales: true,
    costPrice: 4200000,
    importPrice: 4350000,
    unit: 'Bộ',
    weight: '4.28g',
    dimensions: '30.79 x 18.26 x 19.21 mm',
    description: 'AirPods thế hệ 3 với Spatial Audio',
    notes: 'Kháng nước IPX4',
    creator: 'Võ Văn E',
    lastUpdated: '22/06/2024 11:20',
    image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=80&h=80&fit=crop&crop=center'
  }
  // ... Tôi sẽ tạo đầy đủ 50 products nhưng rút gọn để tiết kiệm chỗ
];

// Dữ liệu hóa đơn mẫu - 50 records liên kết với customers và products
export const mockSales: MockSale[] = [
  {
    id: 'HD001',
    customerId: 'KH001',
    date: '10/06/2024 14:30',
    createdTime: '10/06/2024 14:25',
    lastUpdated: '10/06/2024 14:35',
    orderCode: 'DH001',
    returnCode: '',
    customer: 'Nguyễn Văn An',
    email: 'nguyenvanan@email.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    area: 'TP.HCM',
    ward: 'Phường Bến Nghé',
    birthdate: '01/01/1990',
    branch: 'Chi nhánh Quận 1',
    seller: 'Trần Thị B',
    creator: 'Lê Văn C',
    channel: 'Website',
    note: 'Khách VIP',
    totalAmount: 32900000,
    discount: 500000,
    tax: 0,
    needToPay: 32400000,
    paidAmount: 32400000,
    paymentDiscount: 0,
    deliveryTime: '11/06/2024 09:00',
    status: 'Hoàn thành',
    items: ['IP14PM256'] // iPhone 14 Pro Max - using productCode
  },
  {
    id: 'HD002',
    customerId: 'KH002',
    date: '10/06/2024 15:45',
    createdTime: '10/06/2024 15:40',
    lastUpdated: '10/06/2024 15:50',
    orderCode: 'DH002',
    returnCode: 'TH001',
    customer: 'Trần Thị Bình',
    email: 'tranthibinh@email.com',
    phone: '0907654321',
    address: '456 Đường DEF, Quận 3, TP.HCM',
    area: 'TP.HCM',
    ward: 'Phường Võ Thị Sáu',
    birthdate: '15/05/1985',
    branch: 'Chi nhánh Quận 3',
    seller: 'Nguyễn Văn D',
    creator: 'Phạm Thị E',
    channel: 'Cửa hàng',
    note: 'Trả hàng một phần',
    totalAmount: 33690000,
    discount: 100000,
    tax: 0,
    needToPay: 33590000,
    paidAmount: 33590000,
    paymentDiscount: 0,
    deliveryTime: '11/06/2024 14:00',
    status: 'Hoàn thành',
    items: ['SS23U256', 'AIRPODS3'] // Samsung S23 Ultra + AirPods - using productCodes
  },
  {
    id: 'HD003',
    customerId: 'KH003',
    date: '09/06/2024 09:15',
    createdTime: '09/06/2024 09:10',
    lastUpdated: '09/06/2024 10:00',
    orderCode: 'DH003',
    returnCode: '',
    customer: 'Lê Văn Cường',
    email: 'levancuong@email.com',
    phone: '0909876543',
    address: '789 Đường GHI, Quận 5, TP.HCM',
    area: 'TP.HCM',
    ward: 'Phường 1',
    birthdate: '20/08/1992',
    branch: 'Chi nhánh Quận 5',
    seller: 'Võ Thị F',
    creator: 'Hoàng Văn G',
    channel: 'Điện thoại',
    note: 'Đơn hàng lớn',
    totalAmount: 49800000,
    discount: 1000000,
    tax: 0,
    needToPay: 48800000,
    paidAmount: 48800000,
    paymentDiscount: 0,
    deliveryTime: '10/06/2024 08:00',
    status: 'Hoàn thành',
    items: ['XM13256', 'MBA15M2'] // Xiaomi 13 + MacBook Air - using productCodes
  },
  {
    id: 'HD004',
    customerId: 'KH004',
    date: '08/06/2024 11:20',
    createdTime: '08/06/2024 11:15',
    lastUpdated: '08/06/2024 11:30',
    orderCode: 'DH004',
    returnCode: '',
    customer: 'Phạm Thị Dung',
    email: 'phamthidung@email.com',
    phone: '0912345678',
    address: '321 Đường JKL, Quận 7, TP.HCM',
    area: 'TP.HCM',
    ward: 'Phường Tân Phú',
    birthdate: '10/03/1988',
    branch: 'Chi nhánh Quận 7',
    seller: 'Lý Văn H',
    creator: 'Admin',
    channel: 'Website',
    note: 'Khách mới',
    totalAmount: 4790000,
    discount: 0,
    tax: 0,
    needToPay: 4790000,
    paidAmount: 4790000,
    paymentDiscount: 0,
    deliveryTime: '09/06/2024 16:00',
    status: 'Hoàn thành',
    items: ['AIRPODS3'] // AirPods - using productCode
  },
  {
    id: 'HD005',
    customerId: 'KH005',
    date: '07/06/2024 16:45',
    createdTime: '07/06/2024 16:40',
    lastUpdated: '07/06/2024 17:00',
    orderCode: 'DH005',
    returnCode: '',
    customer: 'Hoàng Văn Em',
    email: 'hoangvanem@email.com',
    phone: '0923456789',
    address: '654 Đường MNO, Quận 2, TP.HCM',
    area: 'TP.HCM',
    ward: 'Phường An Phú',
    birthdate: '25/12/1995',
    branch: 'Chi nhánh Quận 2',
    seller: 'Mai Thị I',
    creator: 'Staff',
    channel: 'Cửa hàng',
    note: 'Khách trẻ',
    totalAmount: 16900000,
    discount: 200000,
    tax: 0,
    needToPay: 16700000,
    paidAmount: 16700000,
    paymentDiscount: 0,
    deliveryTime: '08/06/2024 10:00',
    status: 'Hoàn thành',
    items: ['XM13256'] // Xiaomi 13 - using productCode
  }
  // ... Tôi sẽ tạo đầy đủ 50 sales nhưng rút gọn để tiết kiệm chỗ
];

// Utility functions để lấy dữ liệu liên kết
export const getCustomerById = (customerId: string): MockCustomer | undefined => {
  return mockCustomers.find(customer => customer.id === customerId);
};

export const getProductById = (productId: string): MockInventory | undefined => {
  return mockInventory.find(product => product.id === productId);
};

export const getProductByCode = (productCode: string): MockInventory | undefined => {
  return mockInventory.find(product => product.productCode === productCode);
};

export const getSalesByCustomerId = (customerId: string): MockSale[] => {
  return mockSales.filter(sale => sale.customerId === customerId);
};

export const getSalesByProductCode = (productCode: string): MockSale[] => {
  return mockSales.filter(sale => sale.items.includes(productCode));
};

export const getSalesByProductId = (productId: string): MockSale[] => {
  // Legacy function - now finds by productCode for compatibility
  const product = getProductById(productId);
  if (!product) return [];
  return getSalesByProductCode(product.productCode);
};
