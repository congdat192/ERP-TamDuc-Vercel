
import { DoubleTopNavigation } from './DoubleTopNavigation';
import { User, ERPModule } from '@/types/auth';

interface ERPLayoutProps {
  currentUser: User;
  currentModule: ERPModule;
  onModuleChange: (module: ERPModule) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function ERPLayout({
  currentUser,
  onLogout,
  children
}: ERPLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <DoubleTopNavigation
        currentUser={currentUser}
        onLogout={onLogout}
      />
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
