
import { VoucherModuleSidebar } from '@/components/layout/VoucherModuleSidebar';
import { VoucherRouter } from './components/VoucherRouter';

interface VoucherModuleProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function VoucherModule({ currentUser, onBackToModules }: VoucherModuleProps) {
  return (
    <div className="flex h-screen voucher-module-background">
      {/* Voucher Module Sidebar - Always visible */}
      <VoucherModuleSidebar
        currentUser={currentUser}
        onBackToModules={onBackToModules}
      />
      
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <VoucherRouter currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
