
import { Routes, Route } from 'react-router-dom';
import { AffiliateModuleSidebar } from './components/AffiliateModuleSidebar';
import { AffiliateDashboard } from './pages/AffiliateDashboard';
import { F0ApprovalPage } from './pages/F0ApprovalPage';
import { ReferralManagementPage } from './pages/ReferralManagementPage';
import { VoucherManagementPage } from './pages/VoucherManagementPage';
import { WithdrawalManagementPage } from './pages/WithdrawalManagementPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { ReportsPage } from './pages/ReportsPage';

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
        </Routes>
      </main>
    </div>
  );
}
