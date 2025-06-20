
import { Routes, Route, Navigate } from 'react-router-dom';
import { VoucherDashboard } from '../pages/VoucherDashboard';
import { CampaignManagement } from '../pages/CampaignManagement';
import { VoucherIssue } from '../pages/VoucherIssue';
import { VoucherList } from '../pages/VoucherList';
import { VoucherAnalytics } from '../pages/VoucherAnalytics';
import { VoucherLeaderboard } from '../pages/VoucherLeaderboard';
import VoucherSettings from '../pages/VoucherSettings';
import { User } from '@/types/auth';

interface VoucherRouterProps {
  currentUser: User;
}

export function VoucherRouter({ currentUser }: VoucherRouterProps) {
  return (
    <Routes>
      <Route index element={<Navigate to="Dashboard" replace />} />
      <Route path="Dashboard" element={<VoucherDashboard />} />
      <Route path="Campaign" element={<CampaignManagement />} />
      <Route path="Issue" element={<VoucherIssue />} />
      <Route path="List" element={<VoucherList currentUser={currentUser} />} />
      <Route path="Report" element={<VoucherAnalytics />} />
      <Route path="Ranking" element={<VoucherLeaderboard />} />
      <Route path="Setting" element={<VoucherSettings />} />
      <Route path="*" element={<Navigate to="Dashboard" replace />} />
    </Routes>
  );
}
