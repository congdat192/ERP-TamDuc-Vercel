import { Routes, Route, Navigate } from 'react-router-dom';
import { HRDashboard } from '../pages/HRDashboard';
import { HRISPage } from '../pages/HRISPage';
import { TimeAttendancePage } from '../pages/TimeAttendancePage';
import { PayrollPage } from '../pages/PayrollPage';
import { ManagePayrollSlipsPage } from '../pages/ManagePayrollSlipsPage';
import { RecruitmentPage } from '../pages/RecruitmentPage';
import { TrainingPage } from '../pages/TrainingPage';
import { PerformancePage } from '../pages/PerformancePage';
import { BenefitsPage } from '../pages/BenefitsPage';
import { AdministrationPage } from '../pages/AdministrationPage';
import { ChangeRequestsPage } from '../pages/ChangeRequestsPage';
import { ProtectedHRRoute } from './ProtectedHRRoute';

interface HRRouterProps {
  currentUser: any;
}

export function HRRouter({ currentUser }: HRRouterProps) {
  return (
    <Routes>
      <Route index element={<Navigate to="Dashboard" replace />} />
      
      <Route 
        path="Dashboard" 
        element={
          <ProtectedHRRoute requiredPermission="view_hr_dashboard">
            <HRDashboard />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="HRIS" 
        element={
          <ProtectedHRRoute requiredPermission="view_employees">
            <HRISPage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="TimeAttendance" 
        element={
          <ProtectedHRRoute requiredPermission="view_attendance">
            <TimeAttendancePage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="Payroll" 
        element={
          <ProtectedHRRoute requiredPermission="view_payroll">
            <PayrollPage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="QuanLyPhieuLuong" 
        element={
          <ProtectedHRRoute requiredPermission="manage_payroll">
            <ManagePayrollSlipsPage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="Recruitment" 
        element={
          <ProtectedHRRoute requiredPermission="view_recruitment">
            <RecruitmentPage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="Training" 
        element={
          <ProtectedHRRoute requiredPermission="view_training">
            <TrainingPage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="Performance" 
        element={
          <ProtectedHRRoute requiredPermission="view_performance">
            <PerformancePage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="Benefits" 
        element={
          <ProtectedHRRoute requiredPermission="view_benefits">
            <BenefitsPage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="Administration" 
        element={
          <ProtectedHRRoute requiredPermission="view_admin_documents">
            <AdministrationPage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route 
        path="ChangeRequests" 
        element={
          <ProtectedHRRoute requiredPermission="approve_change_requests">
            <ChangeRequestsPage />
          </ProtectedHRRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="Dashboard" replace />} />
    </Routes>
  );
}
