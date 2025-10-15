import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TopNavItem } from './TopNavItem';
import { MobileNavDrawer } from './MobileNavDrawer';
import { navigationConfig, NavItem } from '@/config/navigation';
import { isPathActive, isModuleActive } from '@/lib/navigationUtils';
import { User } from '@/types/auth';
import { cn } from '@/lib/utils';
import { getAvatarUrl } from '@/types/auth';

interface DoubleTopNavigationProps {
  currentUser: User;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
}

export function DoubleTopNavigation({
  currentUser,
  onNotificationClick,
  onProfileClick
}: DoubleTopNavigationProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter navigation items based on user permissions
  const visibleNavItems = navigationConfig.filter(
    (item) =>
      !item.requiredPermission ||
      currentUser.permissions.modules.includes(item.requiredPermission)
  );

  // Find active module
  const activeModule = visibleNavItems.find((item) =>
    isModuleActive(location.pathname, item.path)
  );

  // Filter subitems based on permissions
  const getVisibleSubItems = (item: NavItem) => {
    if (!item.subItems) return [];
    
    // For voucher module, check voucherFeatures permissions
    if (item.id === 'voucher') {
      return item.subItems.filter(
        (subItem) =>
          !subItem.requiredPermission ||
          currentUser.permissions.voucherFeatures.includes(subItem.requiredPermission as any)
      );
    }
    
    // For other modules, show all subitems
    return item.subItems;
  };

  const visibleSubItems = activeModule ? getVisibleSubItems(activeModule) : [];
  const hasSubNav = visibleSubItems.length > 0;

  const avatarUrl = getAvatarUrl(currentUser.avatarPath);

  return (
    <>
      {/* Level 1 Navigation */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left Section: Menu + Logo + Nav Items (Desktop) */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link to="/ERP/Dashboard" className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">ERP</span>
              </div>
              <span className="font-semibold hidden sm:inline">ERP System</span>
            </Link>

            {/* Desktop Navigation */}
            <ScrollArea className="hidden lg:block flex-1">
              <div className="flex items-center gap-1 px-2">
                {visibleNavItems.map((item) => (
                  <TopNavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    path={item.path}
                    isActive={isModuleActive(location.pathname, item.path)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Section: Notifications + Avatar */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={onProfileClick}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={currentUser.fullName} />
                <AvatarFallback>
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>

        {/* Level 2 Navigation (Submenu) */}
        {hasSubNav && (
          <div className="hidden lg:block bg-accent/50 border-t border-border">
            <ScrollArea className="w-full">
              <div className="flex items-center gap-1 px-4 py-2">
                {visibleSubItems.map((subItem) => (
                  <Link
                    key={subItem.id}
                    to={subItem.path}
                    className={cn(
                      "px-4 py-1.5 rounded-md transition-colors whitespace-nowrap text-sm",
                      isPathActive(location.pathname, subItem.path)
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Spacer to prevent content from hiding under fixed nav */}
      <div className={cn("h-14", hasSubNav && "lg:h-[5.5rem]")} />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={visibleNavItems}
      />
    </>
  );
}
