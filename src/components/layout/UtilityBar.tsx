import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeModeToggle } from '@/components/theme/ThemeModeToggle';
import { LanguageSelector } from './LanguageSelector';
import { BusinessSwitcher } from '@/components/ui/business-switcher';
import { NotificationCenter } from '@/components/ui/notification-center';
import { UserAvatar } from './UserAvatar';
import { User } from '@/types/auth';
import { useNavigate } from 'react-router-dom';

interface UtilityBarProps {
  currentUser: User;
  onLogout?: () => void;
}

export function UtilityBar({ currentUser, onLogout }: UtilityBarProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-accent/30 border-b border-border backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left: Theme + Language + Business */}
        <div className="flex items-center gap-2">
          <ThemeModeToggle compact />
          <LanguageSelector />
          <BusinessSwitcher compact />
        </div>
        
        {/* Right: Notifications + Settings + Avatar */}
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => navigate('/ERP/Setting')}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <UserAvatar 
            user={currentUser}
            onProfileClick={() => navigate('/user-profile')}
            onSettingsClick={() => navigate('/ERP/Setting')}
            onLogout={onLogout}
          />
        </div>
      </div>
    </div>
  );
}
