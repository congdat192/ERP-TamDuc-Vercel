
# Sidebar Submenu Navigation Pattern

## Overview
This module demonstrates the new sidebar submenu navigation pattern that should be used for all complex modules in the ERP system. This pattern replaces horizontal tab navigation to provide better scalability and user experience.

## Key Features

### 1. Accordion-Style Navigation
- Collapsible sections with expand/collapse functionality
- Support for nested menu items (multi-level navigation)
- Clear visual hierarchy with proper indentation

### 2. Responsive Design
- Collapsible sidebar on mobile devices
- Overlay navigation on small screens
- Always visible on desktop

### 3. State Management
- Active menu item highlighting
- Expanded sections state preservation
- Form data persistence when navigating

### 4. Accessibility
- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels and roles

## File Structure

```
src/modules/admin/pages/settings/
├── SettingsLayout.tsx          # Main layout with sidebar navigation
├── GeneralInfo.tsx            # Individual setting pages
├── EmailSettings.tsx
├── SecuritySettings.tsx
├── ApiIntegration.tsx         # Complex page with tabs
├── BackupRestore.tsx
├── FeaturesPlans.tsx
└── README.md                  # This documentation
```

## Usage Guidelines

### 1. Creating New Settings Categories
Add new menu items to the `settingsMenuStructure` array:

```typescript
{
  id: 'new-category',
  label: 'Danh Mục Mới',
  icon: 'IconName',
  type: 'single' // or 'expandable' for nested items
}
```

### 2. Adding Expandable Sections
For categories with sub-items:

```typescript
{
  id: 'complex-category',
  label: 'Danh Mục Phức Tạp',
  icon: 'IconName',
  type: 'expandable',
  subItems: [
    { id: 'sub-item-1', label: 'Mục Con 1' },
    { id: 'sub-item-2', label: 'Mục Con 2' }
  ]
}
```

### 3. Creating Setting Pages
Each settings page should be a self-contained component:

```typescript
export function NewSettingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tiêu Đề</h2>
        <p className="text-gray-600">Mô tả trang cài đặt</p>
      </div>
      
      {/* Content cards */}
      <Card>
        <CardHeader>
          <CardTitle>Nhóm Cài Đặt</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Settings form */}
        </CardContent>
      </Card>
    </div>
  );
}
```

## Applying to Other Modules

### User Management Example
```
Quản Lý Người Dùng
├─ Danh Sách Người Dùng
├─ Vai Trò & Quyền
│  ├─ Quản Lý Vai Trò
│  ├─ Phân Quyền Chi Tiết
│  └─ Nhóm Quyền
├─ Nhật Ký Truy Cập
└─ Cài Đặt Bảo Mật
```

### Report Management Example
```
Báo Cáo & Thống Kê
├─ Báo Cáo Tổng Quan
├─ Báo Cáo Bán Hàng
│  ├─ Doanh Thu
│  ├─ Sản Phẩm Bán Chạy
│  └─ Hiệu Suất Nhân Viên
├─ Báo Cáo Tài Chính
└─ Báo Cáo Tùy Chỉnh
```

## Best Practices

1. **Keep navigation shallow**: Maximum 2-3 levels deep
2. **Group related features**: Logical grouping improves UX
3. **Use clear labels**: Vietnamese labels should be descriptive
4. **Provide breadcrumbs**: Help users understand their location
5. **Maintain state**: Preserve form data and scroll position
6. **Mobile-first**: Always test on mobile devices

## Technical Implementation

### Required Components
- `Collapsible` from Radix UI for accordion functionality
- `Button` for menu items
- `Card` for content organization
- Icons from Lucide React

### State Management
- `useState` for sidebar toggle and expanded sections
- URL routing for deep linking (optional)
- Context for global settings state (if needed)

### Styling
- Tailwind CSS for responsive design
- Consistent spacing and typography
- Proper hover and active states
- Accessibility considerations

This pattern ensures consistency, scalability, and excellent user experience across all complex modules in the ERP system.
