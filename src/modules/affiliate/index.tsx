
import { Routes, Route } from 'react-router-dom';
import { AffiliateModuleSidebar } from './components/AffiliateModuleSidebar';
import { F0PortalLayout } from './components/F0PortalLayout';
import { AffiliateDashboard } from './pages/AffiliateDashboard';
import { F0ApprovalPage } from './pages/F0ApprovalPage';
import { ReferralManagementPage } from './pages/ReferralManagementPage';
import { VoucherManagementPage } from './pages/VoucherManagementPage';
import { WithdrawalManagementPage } from './pages/WithdrawalManagementPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { ReportsPage } from './pages/ReportsPage';
import { F0DashboardPage } from './pages/F0DashboardPage';
import { F0LinkGenerationPage } from './pages/F0LinkGenerationPage';
import { F0ReferralPage } from './pages/F0ReferralPage';
import { F0ReferralHistoryPage } from './pages/F0ReferralHistoryPage';
import { F0WithdrawalPage } from './pages/F0WithdrawalPage';
import { F0AccountInfoPage } from './pages/F0AccountInfoPage';
import { F0NotificationsPage } from './pages/F0NotificationsPage';

export function AffiliateModule() {
  return (
    <div className="flex h-screen bg-background">
      <AffiliateModuleSidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route index element={<AffiliateDashboard />} />
          <Route path="f0-approval" element={<F0ApprovalPage />} />
          <Route path="referral-management" element={<ReferralManagementPage />} />
          <Route path="voucher-management" element={<VoucherManagementPage />} />
          <Route path="withdrawal-management" element={<WithdrawalManagementPage />} />
          <Route path="activity-log" element={<ActivityLogPage />} />
          <Route path="reports" element={<ReportsPage />} />
          
          {/* F0 Portal Routes */}
          <Route path="f0-dashboard" element={<F0PortalLayout />}>
            <Route index element={<F0DashboardPage />} />
          </Route>
          <Route path="f0-link-generation" element={<F0PortalLayout />}>
            <Route index element={<F0LinkGenerationPage />} />
          </Route>
          <Route path="f0-referral" element={<F0PortalLayout />}>
            <Route index element={<F0ReferralPage />} />
          </Route>
          <Route path="f0-referral-history" element={<F0PortalLayout />}>
            <Route index element={<F0ReferralHistoryPage />} />
          </Route>
          <Route path="f0-withdrawal" element={<F0PortalLayout />}>
            <Route index element={<F0WithdrawalPage />} />
          </Route>
          <Route path="f0-account-info" element={<F0PortalLayout />}>
            <Route index element={<F0AccountInfoPage />} />
          </Route>
          <Route path="f0-notifications" element={<F0PortalLayout />}>
            <Route index element={<F0NotificationsPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}
