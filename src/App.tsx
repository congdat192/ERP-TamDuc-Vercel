
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { ERPDashboard } from "./pages/ERPDashboard";
import { CustomerPage } from "./pages/CustomerPage";
import { SalesPage } from "./pages/SalesPage";
import { VoucherPage } from "./pages/VoucherPage";
import { WarehousePage } from "./pages/WarehousePage";
import { AccountingPage } from "./pages/AccountingPage";
import NotFound from "./pages/NotFound";
import { ForbiddenPage, ServerErrorPage, NetworkErrorPage } from "./pages/ErrorPages";

// Platform Admin module
import { PlatformAdmin } from "./modules/platform-admin";

// Admin module pages
import { AuditLog } from '@/modules/admin/pages/AuditLog';
import { RolePermissions } from '@/modules/admin/pages/RolePermissions';
import { SystemSettings } from '@/modules/admin/pages/SystemSettings';
import { UserManagement } from '@/modules/admin/pages/UserManagement';
import { Settings as AdminSettings } from '@/modules/admin/pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Navigate to="/erp" replace />} />
              
              {/* ERP Main Dashboard */}
              <Route 
                path="/erp" 
                element={
                  <ProtectedRoute>
                    <ERPDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* ERP Module Routes - All under /erp/ prefix */}
              <Route 
                path="/erp/customers" 
                element={
                  <ProtectedRoute requiredModule="customers">
                    <CustomerPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/erp/sales" 
                element={
                  <ProtectedRoute requiredModule="sales">
                    <SalesPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/erp/voucher" 
                element={
                  <ProtectedRoute requiredModule="voucher">
                    <VoucherPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/erp/warehouse" 
                element={
                  <ProtectedRoute requiredModule="inventory">
                    <WarehousePage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/erp/accounting" 
                element={
                  <ProtectedRoute requiredModule="accounting">
                    <AccountingPage />
                  </ProtectedRoute>
                } 
              />

              {/* ERP Admin Routes - Under /erp/admin/ prefix */}
              <Route 
                path="/erp/admin/settings" 
                element={
                  <ProtectedRoute requiredModule="system-settings">
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/erp/admin/users" 
                element={
                  <ProtectedRoute requiredModule="user-management">
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/erp/admin/audit" 
                element={
                  <ProtectedRoute requiredModule="audit-log">
                    <AuditLog />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/erp/admin/roles" 
                element={
                  <ProtectedRoute requiredModule="role-permissions">
                    <RolePermissions />
                  </ProtectedRoute>
                } 
              />

              {/* Platform Admin Routes - Separate from ERP */}
              <Route 
                path="/platform-admin/*" 
                element={
                  <ProtectedRoute requiredRole={['platform-admin']}>
                    <PlatformAdmin />
                  </ProtectedRoute>
                } 
              />

              {/* Error Pages */}
              <Route path="/403" element={<ForbiddenPage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="/network-error" element={<NetworkErrorPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
