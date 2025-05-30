
# ERP System - Modular Enterprise Solution

A modern, modular ERP system built with React, TypeScript, and Tailwind CSS. This system provides a scalable foundation for enterprise resource planning with role-based access control and modular architecture.

## 🏗️ Project Structure

### Modular Architecture

```
src/
├── modules/                    # Business modules
│   └── voucher/               # Voucher management module
│       ├── components/        # Module-specific components
│       ├── hooks/            # Module-specific React hooks
│       ├── pages/            # Module pages/screens
│       ├── services/         # API services for the module
│       └── types/            # TypeScript types for the module
│
├── components/                # Shared components
│   ├── ui/                   # Reusable UI components (shadcn/ui)
│   └── layout/               # Layout components (sidebar, header, etc.)
│
├── pages/                    # Top-level application pages
├── types/                    # Global TypeScript types
├── constants/                # Application constants and configs
├── routes/                   # Route definitions
├── hooks/                    # Global React hooks
├── lib/                      # Utility functions and libraries
└── data/                     # Static data and configurations
```

### Module Organization

Each business module follows this structure:

- **pages/**: All page-level components for the module
- **components/**: Reusable components specific to the module
- **hooks/**: React hooks specific to the module's functionality
- **services/**: API calls and business logic services
- **types/**: TypeScript interfaces and types for the module

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun

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

## 👥 User Roles & Permissions

The system supports role-based access control with the following predefined roles:

### ERP Admin
- Full access to all modules and features
- User management capabilities
- System settings configuration
- Complete voucher module access

### Voucher Admin
- Full access to voucher module
- Analytics and reporting
- Voucher settings management
- Can view all vouchers

### Telesales
- Limited voucher module access
- Can issue and manage own vouchers
- Access to leaderboard
- Cannot access analytics or settings

### Custom Role
- Configurable permissions
- Module access can be customized
- Feature-level permission control

## 🔐 Authentication & Demo

For demonstration purposes, the following test accounts are available:

- **Username:** `admin` - ERP Administrator
- **Username:** `voucher_admin` - Voucher Module Administrator  
- **Username:** `telesales` - Telesales User
- **Username:** `custom` - Custom Role User

All accounts use any password for demo login.

## 📱 Modules

### Current Modules

#### Voucher Management
- **Dashboard**: Overview and statistics
- **Issue Voucher**: Create new vouchers for customers
- **Voucher List**: View and manage vouchers (with privacy controls)
- **Analytics**: Reports and performance analysis
- **Leaderboard**: Staff performance rankings
- **Settings**: Module configuration

#### Other Modules (UI Scaffolding)
- Customer Management
- Sales Management
- Inventory Management
- Accounting
- Human Resources
- System Settings
- User Management

## 🛠️ Adding New Modules

To add a new business module:

1. **Create Module Directory Structure**
   ```bash
   src/modules/your-module/
   ├── components/
   ├── hooks/
   ├── pages/
   ├── services/
   └── types/
   ```

2. **Define Module Types**
   ```typescript
   // src/modules/your-module/types/index.ts
   export interface YourModuleData {
     // Define your interfaces
   }
   ```

3. **Create Module Pages**
   ```typescript
   // src/modules/your-module/pages/YourModuleDashboard.tsx
   export function YourModuleDashboard() {
     // Your page component
   }
   ```

4. **Update Route Configuration**
   ```typescript
   // src/routes/index.ts
   export const ROUTES = {
     // Add your module routes
     YOUR_MODULE: '/your-module',
   }
   ```

5. **Configure Permissions**
   ```typescript
   // src/constants/permissions.ts
   // Add module to MODULE_PERMISSIONS array
   ```

6. **Register in Main Application**
   ```typescript
   // src/pages/Index.tsx
   // Import and add routing logic
   ```

## 🎨 Styling & UI

- **Framework**: Tailwind CSS for utility-first styling
- **Components**: shadcn/ui for consistent, accessible components
- **Theme**: Customizable color schemes per module
- **Responsive**: Mobile-first responsive design

## 🔧 Development Guidelines

### File Naming Conventions
- Use PascalCase for component files: `VoucherDashboard.tsx`
- Use camelCase for utility functions: `formatCurrency.ts`
- Use kebab-case for non-component files: `api-client.ts`

### Component Structure
- Keep components focused and single-responsibility
- Use TypeScript interfaces for all props
- Implement proper error boundaries
- Follow React hooks best practices

### Module Development
- Each module should be self-contained
- Avoid cross-module dependencies (use shared utilities instead)
- Implement proper TypeScript types
- Include comprehensive empty states

## 📊 Features

### Implemented Features
- ✅ Role-based authentication
- ✅ Modular architecture
- ✅ Voucher management system
- ✅ Permission-based navigation
- ✅ Responsive design
- ✅ Vietnamese localization
- ✅ Empty state handling

### Planned Features
- 🔄 API integration
- 🔄 Real-time notifications
- 🔄 Advanced reporting
- 🔄 Multi-language support
- 🔄 Audit logging
- 🔄 Data export capabilities

## 🤝 Contributing

1. Follow the modular architecture patterns
2. Maintain TypeScript strict mode compliance
3. Add proper documentation for new modules
4. Ensure responsive design implementation
5. Include proper error handling and empty states

## 📄 License

This project is proprietary software. All rights reserved.

---

For questions or support, please refer to the project documentation or contact the development team.
