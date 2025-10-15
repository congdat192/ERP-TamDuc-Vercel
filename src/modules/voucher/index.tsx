
import { VoucherRouter } from './components/VoucherRouter';

interface VoucherModuleProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function VoucherModule({ currentUser }: VoucherModuleProps) {
  return (
    <div className="p-6">
      <VoucherRouter currentUser={currentUser} />
    </div>
  );
}
