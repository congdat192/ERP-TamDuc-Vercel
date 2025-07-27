
import React from 'react';
import { MarketingModule } from '@/modules/marketing';
import { useAuth } from '@/hooks/useAuth';

export function MarketingPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Unauthorized</div>;
  }

  const handleBackToModules = () => {
    // Navigate back to main modules view
    window.location.href = '/';
  };

  return <MarketingModule currentUser={currentUser} onBackToModules={handleBackToModules} />;
}
