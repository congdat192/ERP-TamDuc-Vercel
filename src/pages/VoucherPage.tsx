
import { VoucherModule } from '@/modules/voucher';
import { useAuth } from '@/components/auth/AuthContext';

interface VoucherPageProps {
  onBackToERP: () => void;
}

export function VoucherPage({ onBackToERP }: VoucherPageProps) {
  const { currentUser } = useAuth();
  
  return <VoucherModule currentUser={currentUser} onBackToModules={onBackToERP} />;
}
