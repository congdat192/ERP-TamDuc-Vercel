
import { SecuritySettings as SecuritySettingsComponent } from '@/pages/SecuritySettings';
import { User } from '@/types/auth';

interface SecuritySettingsProps {
  currentUser: User;
  onLogout: () => void;
}

export const SecuritySettings = ({ currentUser, onLogout }: SecuritySettingsProps) => {
  return (
    <SecuritySettingsComponent 
      currentUser={currentUser} 
      onLogout={onLogout} 
    />
  );
};
