
import React from 'react';
import { MarketingDashboard } from './pages/MarketingDashboard';

interface MarketingModuleProps {
  currentUser: any;
}

export function MarketingModule({ currentUser }: MarketingModuleProps) {
  return (
    <div className="marketing-module-background min-h-screen">
      <div className="p-6">
        <MarketingDashboard />
      </div>
    </div>
  );
}
