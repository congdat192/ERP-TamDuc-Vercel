
import { Routes, Route, Navigate } from 'react-router-dom';
import { AffiliateRoleSelection } from './pages/AffiliateRoleSelection';
import { AdminPortalLayout } from './components/AdminPortalLayout';
import { F0PortalLayout } from './components/F0PortalLayout';

// Import Admin Portal pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ApproveF0Page } from './pages/admin/ApproveF0Page';
import { F0ManagementPage } from './pages/admin/F0ManagementPage';
import { ReferralManagementPage } from './pages/admin/ReferralManagementPage';
import { VoucherManagementPage } from './pages/admin/VoucherManagementPage';
import { WithdrawalManagementPage } from './pages/admin/WithdrawalManagementPage';
import { ActivityLogPage } from './pages/admin/ActivityLogPage';
import { SystemSettingsPage } from './pages/admin/SystemSettingsPage';
import { AdminAccountsPage } from './pages/admin/AdminAccountsPage';
import { ReportingPage } from './pages/admin/ReportingPage';

// Import F0 Portal pages
import { F0Dashboard } from './pages/f0/F0Dashboard';
import { F0Registration } from './pages/f0/F0Registration';
import { F0Login } from './pages/f0/F0Login';
import { ReferCustomerPage } from './pages/f0/ReferCustomerPage';
import { ReferralHistoryPage } from './pages/f0/ReferralHistoryPage';
import { WithdrawalPage } from './pages/f0/WithdrawalPage';
import { ProfilePage } from './pages/f0/ProfilePage';
import { NotificationsPage } from './pages/f0/NotificationsPage';
import { PasswordResetPage } from './pages/f0/PasswordResetPage';
import { OTPVerificationPage } from './pages/f0/OTPVerificationPage';

export function AffiliateModule() {
  return (
    <Routes>
      {/* Role Selection Page */}
      <Route path="/" element={<AffiliateRoleSelection />} />
      
      {/* Admin Portal Routes */}
      <Route path="/admin" element={<AdminPortalLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="approve-f0" element={<ApproveF0Page />} />
        <Route path="f0-management" element={<F0ManagementPage />} />
        <Route path="referral-management" element={<ReferralManagementPage />} />
        <Route path="voucher-management" element={<VoucherManagementPage />} />
        <Route path="withdrawal-management" element={<WithdrawalManagementPage />} />
        <Route path="activity-log" element={<ActivityLogPage />} />
        <Route path="system-settings" element={<SystemSettingsPage />} />
        <Route path="admin-accounts" element={<AdminAccountsPage />} />
        <Route path="reporting" element={<ReportingPage />} />
      </Route>

      {/* F0 Portal Routes */}
      <Route path="/f0" element={<F0PortalLayout />}>
        <Route index element={<F0Dashboard />} />
        <Route path="refer-customer" element={<ReferCustomerPage />} />
        <Route path="referral-history" element={<ReferralHistoryPage />} />
        <Route path="withdrawal" element={<WithdrawalPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* F0 Auth Routes (outside layout) */}
      <Route path="/f0/register" element={<F0Registration />} />
      <Route path="/f0/login" element={<F0Login />} />
      <Route path="/f0/password-reset" element={<PasswordResetPage />} />
      <Route path="/f0/otp-verification" element={<OTPVerificationPage />} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/erp/affiliate" replace />} />
    </Routes>
  );
}
