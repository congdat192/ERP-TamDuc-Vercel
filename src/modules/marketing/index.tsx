
import React from 'react';
import { CustomerSegmentation } from './pages/CustomerSegmentation';

interface MarketingModuleProps {
  currentUser: any;
}

export function MarketingModule({ currentUser }: MarketingModuleProps) {
  return (
    <div className="marketing-module-background min-h-screen">
      <div className="p-6">
        <CustomerSegmentation />
      </div>
    </div>
  );
}
