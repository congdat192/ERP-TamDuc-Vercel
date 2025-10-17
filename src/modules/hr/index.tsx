import { HRModuleSidebar } from './components/HRModuleSidebar';
import { HRRouter } from './components/HRRouter';

interface HRModuleProps {
  currentUser: any;
  onBackToModules: () => void;
}

export function HRModule({ currentUser, onBackToModules }: HRModuleProps) {
  return (
    <div className="flex h-screen theme-background">
      <HRModuleSidebar currentUser={currentUser} onBackToModules={onBackToModules} />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <HRRouter currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
