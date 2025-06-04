
import { VoucherModule } from '@/modules/voucher';
import { useAuth } from '@/components/auth/AuthContext';

export function VoucherPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <VoucherModule 
      currentUser={currentUser} 
      onBackToModules={() => {}} // Navigation will be handled by React Router
    />
  );
}
