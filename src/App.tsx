import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BusinessProvider } from '@/contexts/BusinessContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { EmailVerificationPage } from '@/pages/EmailVerificationPage';
import { ChangePasswordPage } from '@/pages/ChangePasswordPage';
import { CreateBusinessPage } from '@/pages/CreateBusinessPage';
import { BusinessSelectionPage } from '@/pages/BusinessSelectionPage';
import { InvitationManagementPage } from '@/pages/InvitationManagementPage';
import { InvitationAcceptPage } from '@/pages/InvitationAcceptPage';
import { UserProfilePage } from '@/pages/UserProfilePage';
import { ERPHome } from '@/pages/ERPHome';
import { VoucherPage } from '@/pages/VoucherPage';
import { CustomerPage } from '@/pages/CustomerPage';
import { SalesPage } from '@/pages/SalesPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { MarketingPage } from '@/pages/MarketingPage';
import { InvoiceDetailPage } from '@/pages/InvoiceDetailPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { NotFound } from '@/pages/NotFound';
import { Index } from '@/pages/Index';

// Theme System
import { ThemeSystem } from '@/components/theme/ThemeSystem';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BusinessProvider>
              <StoreProvider>
                <Router>
                  <div className="App">
                    <ThemeSystem />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/reset-password" element={<ResetPasswordPage />} />
                      <Route path="/verify-email" element={<EmailVerificationPage />} />
                      <Route path="/change-password" element={<ChangePasswordPage />} />
                      <Route path="/create-business" element={<CreateBusinessPage />} />
                      <Route path="/business-selection" element={<BusinessSelectionPage />} />
                      <Route path="/invitations" element={<InvitationManagementPage />} />
                      <Route path="/invitation/:token" element={<InvitationAcceptPage />} />
                      <Route path="/profile" element={<UserProfilePage />} />
                      
                      {/* ERP Routes */}
                      <Route path="/ERP/*" element={<ERPHome />} />
                      
                      {/* Module Routes */}
                      <Route path="/voucher/*" element={<VoucherPage />} />
                      <Route path="/customer/*" element={<CustomerPage />} />
                      <Route path="/sales/*" element={<SalesPage />} />
                      <Route path="/inventory/*" element={<InventoryPage />} />
                      <Route path="/marketing/*" element={<MarketingPage />} />
                      
                      {/* Detail Pages */}
                      <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      
                      {/* 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                  </div>
                </Router>
              </StoreProvider>
            </BusinessProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
