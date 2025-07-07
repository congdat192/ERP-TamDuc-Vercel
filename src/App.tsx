
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AuthProvider } from "@/components/auth/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeSystem } from "@/components/theme/ThemeSystem";
import { getSelectedBusinessId } from "@/services/apiService";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ForbiddenPage, ServerErrorPage, NetworkErrorPage } from "./pages/ErrorPages";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { EmailVerificationPage } from "./pages/EmailVerificationPage";
import { BusinessSelectionPage } from "./pages/BusinessSelectionPage";
import { CreateBusinessPage } from "./pages/CreateBusinessPage";
import { ERPHome } from "./pages/ERPHome";
import { CustomerPage } from "./pages/CustomerPage";
import { SalesPage } from "./pages/SalesPage";
import { VoucherPage } from "./pages/VoucherPage";
import { InventoryPage } from "./pages/InventoryPage";
import { MarketingPage } from "./pages/MarketingPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { InvoiceDetailPage } from "./pages/InvoiceDetailPage";
import { PlatformAdmin } from "./modules/platform-admin";
import { Settings } from "./modules/admin/pages/Settings";
import { ERPLayout } from "@/components/layout/ERPLayout";
import { useAuth } from "@/components/auth/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { Navigate, useNavigate } from "react-router-dom";

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
  const { currentBusiness } = useBusiness();
  const navigate = useNavigate();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'platform-admin') {
    return <Navigate to="/platformadmin" replace />;
  }

  // Check if business context is valid
  const storedBusinessId = getSelectedBusinessId();
  if (!storedBusinessId || !currentBusiness) {
    console.log('⚠️ [ProtectedERPRoute] Missing business context, redirecting to business selection');
    return <Navigate to="/business-selection" replace />;
  }

  // Verify business ID consistency (stored vs context)
  if (currentBusiness.id.toString() !== storedBusinessId) {
    console.log('⚠️ [ProtectedERPRoute] Business context mismatch, redirecting to business selection');
    return <Navigate to="/business-selection" replace />;
  }

  const handleModuleChange = (newModule: string) => {
    switch (newModule) {
      case 'dashboard':
        navigate('/ERP/Dashboard');
        break;
      case 'customers':
        navigate('/ERP/Customers');
        break;
      case 'sales':
        navigate('/ERP/Invoices');
        break;
      case 'voucher':
        navigate('/ERP/Voucher');
        break;
      case 'inventory':
        navigate('/ERP/Products');
        break;
      case 'marketing':
        navigate('/ERP/Marketing');
        break;
      case 'system-settings':
        navigate('/ERP/Setting');
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
      <ThemeSystem />
    </ERPLayout>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <BusinessProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/email/verify/:id/:hash" element={<EmailVerificationPage />} />
                  <Route path="/xac-nhan-tai-khoan/:email/:hash" element={<EmailVerificationPage />} />
                  <Route path="/business-selection" element={<BusinessSelectionPage />} />
                  <Route path="/create-business" element={<CreateBusinessPage />} />
                  
                  {/* ERP Routes without business ID */}
                  <Route 
                    path="/ERP/Dashboard" 
                    element={
                      <ProtectedERPRoute module="dashboard">
                        <ERPHome />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Customers" 
                    element={
                      <ProtectedERPRoute module="customers">
                        <CustomerPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Invoices" 
                    element={
                      <ProtectedERPRoute module="sales">
                        <SalesPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Invoices/:invoiceId" 
                    element={
                      <ProtectedERPRoute module="sales">
                        <InvoiceDetailPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Voucher/*" 
                    element={
                      <ProtectedERPRoute module="voucher">
                        <VoucherPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Products" 
                    element={
                      <ProtectedERPRoute module="inventory">
                        <InventoryPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Products/:productCode" 
                    element={
                      <ProtectedERPRoute module="inventory">
                        <ProductDetailPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Marketing" 
                    element={
                      <ProtectedERPRoute module="marketing">
                        <MarketingPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Setting/*" 
                    element={
                      <ProtectedERPRoute module="system-settings">
                        <Settings />
                      </ProtectedERPRoute>
                    } 
                  />
                  
                  {/* Legacy redirects */}
                  <Route path="/ERP/*" element={<Navigate to="/business-selection" replace />} />
                  
                  {/* Platform Admin */}
                  <Route path="/platformadmin" element={<PlatformAdmin />} />
                  
                  {/* Error Pages */}
                  <Route path="/403" element={<ForbiddenPage />} />
                  <Route path="/500" element={<ServerErrorPage />} />
                  <Route path="/network-error" element={<NetworkErrorPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </BusinessProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

const AppWrapper = () => {
  return <App />;
};

export default AppWrapper;
