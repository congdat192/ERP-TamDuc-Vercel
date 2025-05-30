# Platform Admin Module

## Tổng Quan

Module Platform Admin cung cấp giao diện quản lý toàn diện cho Super Administrator để quản lý toàn bộ nền tảng ERP, bao gồm khách hàng, thanh toán, hỗ trợ và giám sát hệ thống.

## Cấu Trúc Module

```
src/modules/platform-admin/
├── pages/                 # Các trang chính
│   ├── Dashboard.tsx      # Tổng quan nền tảng
│   ├── TenantManagement.tsx # Quản lý khách hàng
│   ├── AuditLogs.tsx      # Nhật ký hệ thống
│   └── SupportTickets.tsx # Hỗ trợ khách hàng
├── components/            # Components riêng cho module
│   ├── PlatformAdminLayout.tsx # Layout chính
│   ├── StatCard.tsx       # Card thống kê
│   ├── RecentActivityCard.tsx # Card hoạt động gần đây
│   ├── SystemHealthCard.tsx # Card tình trạng hệ thống
│   ├── TenantDetailModal.tsx # Modal chi tiết khách hàng
│   └── CreateTenantModal.tsx # Modal tạo khách hàng mới
├── utils/                 # Utilities và mock data
│   └── mockData.ts        # Dữ liệu demo
├── index.tsx             # Entry point chính
└── README.md             # Tài liệu này
```

## Tính Năng Chính

### 1. Dashboard (Tổng Quan)
- **Thống kê tổng quan**: Số lượng khách hàng, doanh thu, trạng thái hệ thống
- **Hoạt động gần đây**: Theo dõi các hoạt động quan trọng trong hệ thống
- **Tình trạng hệ thống**: Giám sát uptime và health của các services
- **Cảnh báo**: Hiển thị các cảnh báo quan trọng cần xử lý
- **Thao tác nhanh**: Shortcuts đến các tính năng thường dùng

### 2. Quản Lý Khách Hàng (Tenant Management)
- **Danh sách khách hàng**: Hiển thị tất cả khách hàng với thông tin cơ bản
- **Tìm kiếm và lọc**: Tìm theo tên công ty, email, gói dịch vụ, trạng thái
- **Chi tiết khách hàng**: Modal xem thông tin chi tiết và thống kê sử dụng
- **Tạo khách hàng mới**: Form tạo tài khoản mới với cấu hình gói dịch vụ
- **Quản lý trạng thái**: Kích hoạt, tạm ngưng, hay chấm dứt tài khoản
- **Thống kê sử dụng**: Số người dùng, dung lượng, API calls

### 3. Nhật Ký Hệ Thống (Audit Logs)
- **Lịch sử hoạt động**: Ghi lại tất cả hành động quan trọng
- **Lọc theo**: Người dùng, hành động, khách hàng, thời gian, kết quả
- **Xuất báo cáo**: Export dữ liệu theo CSV hoặc Excel
- **Chi tiết hành động**: Xem thông tin chi tiết của mỗi log entry
- **Theo dõi bảo mật**: Phát hiện hoạt động bất thường

### 4. Hỗ Trợ Khách Hàng (Support Tickets)
- **Quản lý tickets**: Xem và xử lý tất cả yêu cầu hỗ trợ
- **Phân loại ưu tiên**: Critical, High, Medium, Low
- **Trạng thái tickets**: Mở, Đang xử lý, Đã giải quyết, Đã đóng
- **Phân công**: Assign tickets cho nhân viên support
- **Thống kê**: Dashboard về hiệu suất hỗ trợ

### 5. Các Tính Năng Sẽ Triển Khai
- **Quản Lý Thanh Toán**: Hóa đơn, subscription, payment tracking
- **Giám Sát Hệ Thống**: Chi tiết về server performance, errors
- **Quản Lý Admin Users**: CRUD platform admin accounts
- **Cài Đặt Nền Tảng**: Configuration cho toàn bộ platform

## Quyền Truy Cập

Module này **chỉ dành cho** user có role `platform-admin`. Tất cả routes và UI sẽ bị ẩn/từ chối truy cập đối với các role khác.

### Role-Based Access Control:
- ✅ `platform-admin`: Toàn quyền truy cập
- ❌ `erp-admin`: Không được truy cập
- ❌ `voucher-admin`: Không được truy cập  
- ❌ `telesales`: Không được truy cập
- ❌ `custom`: Không được truy cập

## Cách Tích Hợp

### 1. Import Module vào Main App

```typescript
// src/pages/Index.tsx
import { PlatformAdmin } from '@/modules/platform-admin';

// Trong renderMainContent function
if (currentModule === 'platform-admin') {
  return <PlatformAdmin />;
}
```

### 2. Thêm Module vào Permissions

```typescript
// src/constants/permissions.ts
export const MODULE_PERMISSIONS: ModulePermission[] = [
  // ... existing modules
  {
    module: 'platform-admin',
    label: 'Platform Admin',
    icon: 'Shield',
    allowedRoles: ['platform-admin'] // Chỉ platform-admin
  }
];
```

### 3. Cập nhật Types

```typescript
// src/types/auth.ts
export type ERPModule = 
  | 'dashboard' 
  | 'voucher'
  | 'platform-admin' // Thêm module mới
  | ...
  
export type UserRole = 
  | 'erp-admin'
  | 'voucher-admin' 
  | 'telesales'
  | 'custom'
  | 'platform-admin'; // Thêm role mới
```

## Demo Data

Module sử dụng mock data được định nghĩa trong `utils/mockData.ts`:

- **Platform Stats**: Thống kê tổng quan về khách hàng, doanh thu, uptime
- **Recent Activities**: Danh sách hoạt động gần đây trong hệ thống
- **Tenant List**: Danh sách khách hàng với thông tin chi tiết
- **Support Tickets**: Danh sách tickets hỗ trợ
- **Audit Logs**: Lịch sử hoạt động và thay đổi

## UI/UX Features

### Responsive Design
- ✅ Mobile-first approach
- ✅ Collapsible sidebar trên mobile
- ✅ Responsive tables và cards
- ✅ Touch-friendly interactions

### Accessibility
- ✅ ARIA labels và roles
- ✅ Keyboard navigation
- ✅ Focus states rõ ràng
- ✅ Screen reader support

### Loading & Error States
- ✅ Loading spinners cho async operations
- ✅ Empty states với clear messaging
- ✅ Error handling với user-friendly messages
- ✅ Confirmation dialogs cho destructive actions

### Vietnamese Localization
- ✅ Tất cả text interface bằng tiếng Việt
- ✅ Date/time formatting theo locale Việt Nam
- ✅ Number formatting (VNĐ currency)
- ✅ Relative time với date-fns/locale/vi

## Styling & Design

Module tuân thủ design system hiện tại:
- **Colors**: Sử dụng red accent cho Platform Admin (phân biệt với ERP modules)
- **Typography**: Consistent với font system
- **Spacing**: Theo Tailwind spacing scale
- **Components**: Sử dụng shadcn/ui components
- **Icons**: Lucide React icons

## Dependencies

Module không thêm dependencies mới, sử dụng:
- ✅ React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ shadcn/ui components
- ✅ Lucide React icons
- ✅ date-fns (đã có sẵn)

## Development Notes

### Code Organization
- **Self-contained**: Không modify global files
- **Modular**: Mỗi feature trong file riêng
- **Reusable**: Components có thể tái sử dụng
- **Type-safe**: Full TypeScript coverage

### Performance
- **Lazy loading**: Components load khi cần
- **Memoization**: Prevent unnecessary re-renders
- **Optimistic updates**: UI updates trước khi API confirm

### Security
- **Role verification**: Strict access control
- **Data isolation**: Platform admin data riêng biệt
- **Audit trail**: Log tất cả actions quan trọng

## Future Enhancements

1. **Real-time Features**
   - WebSocket notifications
   - Live system monitoring
   - Real-time chat support

2. **Advanced Analytics**
   - Revenue forecasting
   - Usage trend analysis
   - Customer churn prediction

3. **Integration Features**
   - Stripe/payment gateway integration
   - Email automation
   - SMS notifications

4. **Advanced Security**
   - 2FA for platform admins
   - IP whitelisting
   - Advanced audit logging

## Troubleshooting

### Common Issues

1. **Module không hiển thị**
   - Kiểm tra user role có đúng là `platform-admin`
   - Verify permissions trong constants/permissions.ts

2. **Styling issues**
   - Đảm bảo Tailwind CSS được load
   - Check shadcn/ui components đã import đúng

3. **Type errors**
   - Update types trong src/types/auth.ts
   - Rebuild TypeScript cache

## Contact

Module được thiết kế theo project knowledge base và có thể mở rộng dễ dàng. Để thêm tính năng mới, tạo files trong module structure và update routing accordingly.
