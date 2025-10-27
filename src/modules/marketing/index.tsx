import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MarketingDashboard } from './pages/MarketingDashboard';
import { VoucherIssuancePage } from './pages/VoucherIssuancePage';

interface MarketingModuleProps {
  currentUser: any;
}

export function MarketingModule({ currentUser }: MarketingModuleProps) {
  return (
    <div className="marketing-module-background min-h-screen">
      <Routes>
        <Route index element={<MarketingDashboard />} />
        <Route path="voucher" element={<VoucherIssuancePage />} />
      </Routes>
    </div>
  );
}
