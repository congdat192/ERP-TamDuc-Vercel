import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AuthProvider } from "@/components/auth/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeSystem } from "@/components/theme/ThemeSystem";
import { ForceChangePasswordDialog } from "@/components/auth/ForceChangePasswordDialog";
import { FeatureProtectedRoute } from "@/components/auth/FeatureProtectedRoute";
import React, { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ForbiddenPage, ServerErrorPage, NetworkErrorPage } from "./pages/ErrorPages";
import { LoginPage } from "./pages/LoginPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { EmailVerificationPage } from "./pages/EmailVerificationPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ChangePasswordPage } from "./pages/ChangePasswordPage";
import { EmployeeOTPLoginPage } from "./pages/EmployeeOTPLoginPage";
import { MyProfilePage } from "./pages/MyProfilePage";
import { LensCatalogPage } from "./pages/LensCatalogPage";
import { LensAdminPage } from "./pages/LensAdminPage";
import { LensQuizPage } from "./pages/LensQuizPage";
import { LensAdminGuide } from "./pages/help/LensAdminGuide";
import { LensCatalogGuide } from "./pages/help/LensCatalogGuide";
import { ERPHome } from "./pages/ERPHome";
import { CustomerPage } from "./pages/CustomerPage";
import { SalesPage } from "./pages/SalesPage";
import { InventoryPage } from "./pages/InventoryPage";
import { MarketingPage } from "./pages/MarketingPage";
import { HRPage } from "./pages/HRPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { InvoiceDetailPage } from "./pages/InvoiceDetailPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { EmployeeSelfServicePage } from "./modules/ess/pages/EmployeeSelfServicePage";
import { Settings } from "./modules/admin/pages/Settings";
import { UserManagementLayout, MembersPage, RolesPage, UserManagementDashboard } from "./modules/user-management";
import { AffiliateModule } from "./modules/affiliate";
import { ERPLayout } from "@/components/layout/ERPLayout";
import { Navigate, useNavigate } from "react-router-dom";
import { VoucherIssuancePage } from "./modules/marketing/pages/VoucherIssuancePage";
import { KiotVietRoutes } from "./modules/kiotviet/routes";

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

// Protected Route wrapper component for ERP modules
const ProtectedERPRoute = ({ children, module }: { children: React.ReactNode; module: string }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isEmployeeOnly, setIsEmployeeOnly] = React.useState<boolean | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = React.useState(true);
  const { toast } = useToast();

  console.log('🔐 [ProtectedERPRoute] Checking access for module:', module);
  console.log('🔐 [ProtectedERPRoute] User authenticated:', isAuthenticated);

  // Check if user is employee-only on mount
  React.useEffect(() => {
    const checkEmployeeAccess = async () => {
      if (currentUser) {
        try {
          const { data: employee } = await supabase
            .from('employees')
            .select('is_employee_only')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          
          const isEmpOnly = employee?.is_employee_only === true;
          setIsEmployeeOnly(isEmpOnly);
          
          // If employee-only, block access to ERP and redirect
          if (isEmpOnly) {
            console.log('🚫 [ProtectedERPRoute] Employee-only user blocked from ERP');
            toast({
              title: "Truy cập bị từ chối",
              description: "Bạn không có quyền truy cập khu vực quản trị. Vui lòng sử dụng trang Hồ Sơ Cá Nhân.",
              variant: "destructive",
            });
            navigate('/my-profile', { replace: true });
          }
        } catch (error) {
          console.error('❌ [ProtectedERPRoute] Error checking employee access:', error);
          setIsEmployeeOnly(false);
        } finally {
          setIsCheckingAccess(false);
        }
      } else {
        setIsCheckingAccess(false);
      }
    };
    
    checkEmployeeAccess();
  }, [currentUser, navigate, toast]);

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
      case 'inventory':
        navigate('/ERP/Products');
        break;
      case 'marketing':
        navigate('/ERP/Marketing');
        break;
      case 'operations':
        navigate('/ERP/Operations/Lens-Admin');
        break;
      case 'hr':
        navigate('/ERP/HR');
        break;
      case 'affiliate':
        navigate('/ERP/Affiliate');
        break;
      case 'user-management':
        navigate('/ERP/UserManagement');
        break;
      case 'system-settings':
        navigate('/ERP/Setting');
        break;
    }
  };

  if (!isAuthenticated || !currentUser) {
    console.log('❌ [ProtectedERPRoute] Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Show loading while checking employee access
  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Block employee-only users
  if (isEmployeeOnly === true) {
    return null;
  }

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

// Protected Route for general authentication (not business-specific)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      // Save current URL to redirect back after login
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem('redirectAfterLogin', currentPath);
      navigate('/login');
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return <>{children}</>;
};

// Content wrapper to access auth context
const AppContent = () => {
  const { requirePasswordChange, setRequirePasswordChange, refreshUserProfile } = useAuth();

  const handlePasswordChanged = async () => {
    setRequirePasswordChange(false);
    await refreshUserProfile();
  };

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/employee-login" element={<EmployeeOTPLoginPage />} />
                <Route path="/my-profile" element={<MyProfilePage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="/email/verify/:id/:hash" element={<EmailVerificationPage />} />
                <Route path="/xac-nhan-tai-khoan/:email/:hash" element={<EmailVerificationPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/doi-mat-khau/" element={<ResetPasswordPage />} />
                <Route path="/change-password" element={<ChangePasswordPage />} />
                
                {/* Public Lens Catalog - No login required */}
            <Route path="/lens-catalog" element={<LensCatalogPage />} />
            <Route path="/lens-quiz" element={<LensQuizPage />} />
            <Route path="/help/lens-admin" element={<LensAdminGuide />} />
            <Route path="/help/lens-catalog" element={<LensCatalogGuide />} />
                  
                  {/* Redirect /ERP to /ERP/Dashboard */}
                  <Route path="/ERP" element={<Navigate to="/ERP/Dashboard" replace />} />
                  
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
                  
                  {/* KiotViet Integration Routes */}
                  <Route 
                    path="/ERP/KiotViet/*" 
                    element={
                      <ProtectedERPRoute module="inventory">
                        <KiotVietRoutes />
                      </ProtectedERPRoute>
                    } 
                  />
                  
                  <Route
                    path="/ERP/Operations/Lens-Admin" 
                    element={
                      <ProtectedERPRoute module="operations">
                        <LensAdminPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  {/* Redirect old voucher URL to new location */}
                  <Route path="/ERP/Voucher" element={<Navigate to="/ERP/Marketing/voucher" replace />} />
                  
                  {/* Voucher route with feature-level protection */}
                  <Route 
                    path="/ERP/Marketing/voucher" 
                    element={
                      <ProtectedERPRoute module="voucher">
                        <FeatureProtectedRoute requiredFeature="view_vouchers">
                          <VoucherIssuancePage />
                        </FeatureProtectedRoute>
                      </ProtectedERPRoute>
                    } 
                  />
                  
                  {/* Other Marketing routes */}
                  <Route 
                    path="/ERP/Marketing/*" 
                    element={
                      <ProtectedERPRoute module="marketing">
                        <MarketingPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/HR/*" 
                    element={
                      <ProtectedERPRoute module="hr">
                        <HRPage />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/ESS" 
                    element={
                      <ProtectedRoute>
                        <EmployeeSelfServicePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Affiliate/*"
                    element={
                      <ProtectedERPRoute module="affiliate">
                        <AffiliateModule />
                      </ProtectedERPRoute>
                    } 
                  />
                  
                  {/* User Management Nested Routes */}
                  <Route 
                    path="/ERP/UserManagement" 
                    element={
                      <ProtectedERPRoute module="user-management">
                        <UserManagementLayout />
                      </ProtectedERPRoute>
                    }
                  >
                    <Route index element={<UserManagementDashboard />} />
                    <Route path="Members" element={<MembersPage />} />
                    <Route path="Roles" element={<RolesPage />} />
                  </Route>
                  
                  <Route 
                    path="/ERP/Setting/*" 
                    element={
                      <ProtectedERPRoute module="system-settings">
                        <Settings />
                      </ProtectedERPRoute>
                    } 
                  />
                  <Route 
                    path="/ERP/Profile" 
                    element={
                      <ProtectedERPRoute module="profile">
                        <UserProfilePage />
                      </ProtectedERPRoute>
                    } 
                  />
                  
                  {/* Error Pages */}
                  <Route path="/403" element={<ForbiddenPage />} />
                  <Route path="/500" element={<ServerErrorPage />} />
                  <Route path="/network-error" element={<NetworkErrorPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <ForceChangePasswordDialog
                isOpen={requirePasswordChange}
                onPasswordChanged={handlePasswordChanged}
              />
    </>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
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
