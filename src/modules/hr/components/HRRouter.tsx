import { Routes, Route, Navigate } from 'react-router-dom';
import { HRDashboard } from '../pages/HRDashboard';
import { HRISPage } from '../pages/HRISPage';
import { TimeAttendancePage } from '../pages/TimeAttendancePage';
import { PayrollPage } from '../pages/PayrollPage';
import { RecruitmentPage } from '../pages/RecruitmentPage';
import { TrainingPage } from '../pages/TrainingPage';
import { PerformancePage } from '../pages/PerformancePage';
import { BenefitsPage } from '../pages/BenefitsPage';
import { AdministrationPage } from '../pages/AdministrationPage';

interface HRRouterProps {
  currentUser: any;
}

export function HRRouter({ currentUser }: HRRouterProps) {
  return (
    <Routes>
      <Route index element={<Navigate to="Dashboard" replace />} />
      <Route path="Dashboard" element={<HRDashboard />} />
      <Route path="HRIS" element={<HRISPage />} />
      <Route path="TimeAttendance" element={<TimeAttendancePage />} />
      <Route path="Payroll" element={<PayrollPage />} />
      <Route path="Recruitment" element={<RecruitmentPage />} />
      <Route path="Training" element={<TrainingPage />} />
      <Route path="Performance" element={<PerformancePage />} />
      <Route path="Benefits" element={<BenefitsPage />} />
      <Route path="Administration" element={<AdministrationPage />} />
      <Route path="*" element={<Navigate to="Dashboard" replace />} />
    </Routes>
  );
}
