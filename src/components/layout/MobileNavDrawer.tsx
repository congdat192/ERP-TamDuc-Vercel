import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { NavItem } from '@/config/navigation';
import { isPathActive, isModuleActive } from '@/lib/navigationUtils';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export function MobileNavDrawer({ isOpen, onClose, navItems }: MobileNavDrawerProps) {
  const location = useLocation();
  const [openModules, setOpenModules] = useState<string[]>(() => {
    // Auto-open the current module
    const currentModule = navItems.find(item => isModuleActive(location.pathname, item.path));
    return currentModule && currentModule.subItems ? [currentModule.id] : [];
  });

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleNavClick = () => {
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openModules.includes(item.id);
              const isActive = isModuleActive(location.pathname, item.path);

              if (!hasSubItems) {
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={handleNavClick}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                      isPathActive(location.pathname, item.path)
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground/70 hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <Collapsible
                  key={item.id}
                  open={isOpen}
                  onOpenChange={() => toggleModule(item.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3 px-4 py-3 h-auto font-normal",
                        isActive && "bg-accent"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 pr-2 pt-1 space-y-1">
                    {item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.path}
                        onClick={handleNavClick}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm",
                          isPathActive(location.pathname, subItem.path)
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-foreground/60 hover:text-foreground hover:bg-accent"
                        )}
                      >
                        <span>↪</span>
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
