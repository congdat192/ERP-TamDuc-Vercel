# ERP System - Modular Architecture

A comprehensive Enterprise Resource Planning (ERP) system built with React, TypeScript, and Tailwind CSS, featuring a modular architecture for scalability and maintainability.

## 📁 Project Structure

The project follows a modular enterprise-ready structure that separates business logic into dedicated modules while maintaining shared components and utilities.

```
src/
├── modules/                    # Business modules (self-contained)
│   ├── voucher/               # Voucher management module
│   │   ├── pages/             # All voucher-related pages
│   │   │   ├── VoucherDashboard.tsx
│   │   │   ├── VoucherIssue.tsx
│   │   │   ├── VoucherList.tsx
│   │   │   ├── VoucherAnalytics.tsx
│   │   │   ├── VoucherLeaderboard.tsx
│   │   │   └── VoucherSettings.tsx
│   │   ├── components/        # Voucher-specific components
│   │   │   └── VoucherCard.tsx
│   │   ├── hooks/            # Voucher-specific hooks
│   │   │   └── useVoucher.ts
│   │   └── types/            # Voucher-specific types
│   │       └── index.ts
│   ├── admin/                # Administration module
│   │   └── pages/            # Admin-related pages
│   │       ├── AuditLog.tsx
│   │       ├── RolePermissions.tsx
│   │       ├── SystemSettings.tsx
│   │       └── UserManagement.tsx
│   └── [future-modules]/     # Sales, HR, Inventory, etc.
│
├── components/               # Global/shared components
│   ├── ui/                  # Reusable UI components (shadcn/ui)
│   ├── layout/              # Application layout components
│   │   ├── ERPLayout.tsx
│   │   ├── ERPMainSidebar.tsx
│   │   ├── VoucherModuleSidebar.tsx
│   │   └── Header.tsx
│   └── pages/               # Shared page components
│       ├── LoginPage.tsx
│       └── ModuleEmptyState.tsx
│
├── pages/                   # Top-level entry point pages
│   ├── Index.tsx           # Main application entry
│   ├── ERPHome.tsx         # ERP dashboard/home
│   └── NotFound.tsx        # 404 page
│
├── types/                   # Global TypeScript types
│   └── auth.ts             # Authentication & permission types
│
├── constants/               # Application-wide constants
│   └── permissions.ts      # Role and permission definitions
│
├── hooks/                   # Global/shared hooks
├── lib/                     # Utility functions and libraries
├── routes/                  # Route configurations
└── ...                     # Other global files (main.tsx, etc.)
```

## 🏗️ Architecture Principles

### 1. Modular Design
- Each business domain (voucher, admin, sales, etc.) is a separate module
- Modules are self-contained with their own pages, components, hooks, and types
- Easy to add new modules without affecting existing code

### 2. Separation of Concerns
- **Business Logic**: Lives in respective modules (`src/modules/`)
- **Shared UI**: Common components in `src/components/ui/`
- **Layout**: Application layout in `src/components/layout/`
- **Global Types**: Shared types in `src/types/`
- **Constants**: Application constants in `src/constants/`

### 3. Role-Based Access Control (RBAC)
- Comprehensive permission system with module and feature-level access
- Supports multiple user roles: ERP Admin, Voucher Admin, Telesales, Custom
- Easy to extend with new roles and permissions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or bun

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Demo Accounts
The application includes demo accounts for testing:

| Username | Role | Password | Access Level |
|----------|------|----------|--------------|
| `admin` | ERP Admin | any | Full system access |
| `voucher_admin` | Voucher Admin | any | Voucher module + dashboard |
| `telesales` | Telesales | any | Limited voucher access |
| `custom` | Custom | any | Dashboard only |

## 📦 Adding New Modules

To add a new business module (e.g., `sales`):

1. **Create Module Structure**:
```bash
src/modules/sales/
├── pages/
├── components/
├── hooks/
├── services/     # Optional
└── types/        # Optional
```

2. **Update Types** (`src/types/auth.ts`):
```typescript
export type ERPModule = 
  | 'dashboard' 
  | 'voucher'
  | 'sales'      // Add new module
  | ...
```

3. **Update Permissions** (`src/constants/permissions.ts`):
```typescript
export const MODULE_PERMISSIONS: ModulePermission[] = [
  // ... existing modules
  {
    module: 'sales',
    label: 'Bán Hàng',
    icon: 'TrendingUp',
    allowedRoles: ['erp-admin', 'sales-manager']
  }
];
```

4. **Add Route Handling** (`src/pages/Index.tsx`):
```typescript
// Import module pages
import { SalesDashboard } from '@/modules/sales/pages/SalesDashboard';

// Add to renderMainContent()
if (currentModule === 'sales') {
  return <SalesDashboard />;
}
```

## 🔧 Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **React Router** - Client-side routing
- **Vite** - Build tool

## 🎯 Key Features

- **Modular Architecture**: Easy to extend and maintain
- **Role-Based Access Control**: Comprehensive permission system
- **Responsive Design**: Works on all device sizes
- **TypeScript**: Full type safety throughout the application
- **Component Library**: Consistent UI with shadcn/ui
- **Vietnamese Localization**: Fully localized for Vietnamese users

## 📝 Development Guidelines

### Module Development
- Keep modules self-contained and independent
- Use descriptive naming (e.g., `VoucherDashboard.tsx` not `Dashboard.tsx`)
- Follow the established folder structure within modules
- Import shared components from `@/components/ui/` and `@/components/layout/`

### Naming Conventions
- Files: PascalCase for components (`VoucherDashboard.tsx`)
- Folders: lowercase with hyphens (`voucher-analytics`)
- Constants: UPPER_SNAKE_CASE
- Functions: camelCase

### Adding New Features
1. Determine if it's module-specific or global
2. Place in appropriate folder following the structure
3. Update types and permissions if needed
4. Add proper TypeScript types
5. Test with different user roles

## 🔐 Permission System

The application uses a hierarchical permission system:

1. **Module Level**: Controls access to entire modules
2. **Feature Level**: Controls access to specific features within modules
3. **Action Level**: Controls specific actions (view all, manage users, etc.)

Example permission structure:
```typescript
{
  modules: ['dashboard', 'voucher'],
  voucherFeatures: ['voucher-dashboard', 'issue-voucher'],
  canManageUsers: false,
  canViewAllVouchers: true
}
```

## 🚀 Deployment

The application can be deployed to any static hosting service:

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

This project is proprietary software for internal company use.

---

**Note**: This is a demo implementation focusing on structure and UI patterns. Business logic and data integration would be implemented based on specific requirements.
