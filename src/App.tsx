
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AuthProvider } from "@/components/auth/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ForbiddenPage, ServerErrorPage, NetworkErrorPage } from "./pages/ErrorPages";
import { LoginPage } from "./pages/LoginPage";
import { ERPHome } from "./pages/ERPHome";
import { CustomerPage } from "./pages/CustomerPage";
import { SalesPage } from "./pages/SalesPage";
import { VoucherPage } from "./pages/VoucherPage";
import { PlatformAdmin } from "./modules/platform-admin";
import { ERPLayout } from "@/components/layout/ERPLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { Navigate } from "react-router-dom";

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

// Protected Route wrapper component
const ProtectedERPRoute = ({ children, module }: { children: React.ReactNode; module: string }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !currentUser) {
    return <LoginPage />;
  }

  if (currentUser.role === 'platform-admin') {
    return <Navigate to="/platformadmin" replace />;
  }

  const handleModuleChange = (newModule: string) => {
    switch (newModule) {
      case 'dashboard':
        window.location.href = '/ERP/Dashboard';
        break;
      case 'customers':
        window.location.href = '/ERP/Customers';
        break;
      case 'sales':
        window.location.href = '/ERP/Invoices';
        break;
      case 'voucher':
        window.location.href = '/ERP/Voucher';
        break;
      case 'inventory':
        window.location.href = '/ERP/Products';
        break;
      case 'system-settings':
        window.location.href = '/ERP/Setting';
        break;
    }
  };

  return (
    <ERPLayout
      currentUser={currentUser}
      currentModule={module as any}
      onModuleChange={handleModuleChange}
      onLogout={logout}
    >
      {children}
    </ERPLayout>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* ERP Routes with explicit full paths */}
              <Route 
                path="/ERP/Dashboard" 
                element={
                  <ProtectedERPRoute module="dashboard">
                    <ERPHome currentUser={null} onModuleChange={() => {}} />
                  </ProtectedERPRoute>
                } 
              />
              <Route 
                path="/ERP/Customers" 
                element={
                  <ProtectedERPRoute module="customers">
                    <CustomerPage onBackToERP={() => window.location.href = '/ERP/Dashboard'} />
                  </ProtectedERPRoute>
                } 
              />
              <Route 
                path="/ERP/Invoices" 
                element={
                  <ProtectedERPRoute module="sales">
                    <SalesPage onBackToERP={() => window.location.href = '/ERP/Dashboard'} />
                  </ProtectedERPRoute>
                } 
              />
              <Route 
                path="/ERP/Voucher" 
                element={
                  <ProtectedERPRoute module="voucher">
                    <VoucherPage onBackToERP={() => window.location.href = '/ERP/Dashboard'} />
                  </ProtectedERPRoute>
                } 
              />
              <Route 
                path="/ERP/Products" 
                element={
                  <ProtectedERPRoute module="inventory">
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>
                      <p>Module đang được phát triển...</p>
                    </div>
                  </ProtectedERPRoute>
                } 
              />
              <Route 
                path="/ERP/Setting" 
                element={
                  <ProtectedERPRoute module="system-settings">
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Cài Đặt Hệ Thống</h1>
                      <p>Module đang được phát triển...</p>
                    </div>
                  </ProtectedERPRoute>
                } 
              />
              
              {/* Redirect /ERP to /ERP/Dashboard */}
              <Route path="/ERP" element={<Navigate to="/ERP/Dashboard" replace />} />
              
              {/* Platform Admin */}
              <Route path="/platformadmin" element={<PlatformAdmin />} />
              
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
