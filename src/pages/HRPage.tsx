import { HRModule } from '@/modules/hr';
import { useAuth } from '@/components/auth/AuthContext';

export function HRPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Unauthorized</div>;
  }

  return <HRModule currentUser={currentUser} onBackToModules={() => {}} />;
}
