
import React from 'react';
import { MarketingModule } from '@/modules/marketing';
import { useAuth } from '@/components/auth/AuthContext';

export function MarketingPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Unauthorized</div>;
  }

  return <MarketingModule currentUser={currentUser} />;
}
