import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Building2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { ERPModule, User, getAvatarUrl } from "@/types/auth";
import { MODULE_PERMISSIONS } from "@/constants/permissions";
import { getIconComponent } from "@/lib/icons";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ERPMainSidebarProps {
  currentModule: ERPModule;
  onModuleChange: (module: ERPModule) => void;
  isExpanded: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
  onMobileToggle: () => void;
  currentUser: User;
}

export function ERPMainSidebar({
  currentModule,
  onModuleChange,
  isExpanded,
  isMobileOpen,
  onToggle,
  onMobileToggle,
  currentUser,
}: ERPMainSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedModules, setExpandedModules] = useState<Set<ERPModule>>(new Set(["marketing"]));

  const allowedModules = MODULE_PERMISSIONS.filter((module) => currentUser.permissions.modules.includes(module.module));

  const toggleModuleExpand = (module: ERPModule) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(module)) {
        next.delete(module);
      } else {
        next.add(module);
      }
      return next;
    });
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "erp-admin":
        return "Quản Trị ERP";
      case "voucher-admin":
        return "Quản Lý Voucher";
      case "telesales":
        return "Nhân Viên Telesales";
      case "custom":
        return "Vai Trò Tùy Chỉnh";
      default:
        return "Người Dùng";
    }
  };

  return (
    <TooltipProvider>
      {/* Mobile backdrop */}
      {isMobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileToggle} />}

      {/* Main ERP Sidebar - Neutral styling */}
      <div
        className={cn(
          "bg-sidebar-background text-sidebar-foreground transition-all duration-300 ease-in-out relative border-r border-sidebar-border",
          // Desktop behavior
          "hidden lg:flex lg:flex-col",
          isExpanded ? "lg:w-72" : "lg:w-16",
          // Mobile behavior
          "lg:relative lg:translate-x-0",
          // Mobile overlay
          isMobileOpen && "fixed inset-y-0 left-0 z-50 w-72 flex flex-col lg:hidden",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border min-h-[73px]">
            {isExpanded || isMobileOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 theme-bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Mắt Kính Tâm Đức</h1>
              </div>
            ) : (
              <div className="w-8 h-8 theme-bg-primary rounded-lg flex items-center justify-center mx-auto">
                <Building2 className="w-5 h-5 text-white" />
              </div>
            )}

            {/* Toggle buttons */}
            <div className="flex items-center space-x-2">
              {/* Desktop toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent p-1"
              >
                {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>

              {/* Mobile close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileToggle}
                className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* User Profile */}
          {(isExpanded || isMobileOpen) && (
            <div className="p-4 border-b border-sidebar-border">
              <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-sidebar-accent rounded-lg p-2 -m-2 transition-colors"
                onClick={() => {
                  navigate("/ERP/Profile");
                  if (isMobileOpen) {
                    onMobileToggle();
                  }
                }}
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={getAvatarUrl(currentUser.avatarPath) || "/placeholder.svg"} />
                  <AvatarFallback className="theme-bg-secondary text-white">
                    {currentUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.fullName}</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">{getRoleDisplayName(currentUser.role)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {(isExpanded || isMobileOpen) && (
                <div className="px-3 py-2">
                  <p className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                    Các Module
                  </p>
                </div>
              )}

              {allowedModules.map((module) => {
                const IconComponent = getIconComponent(module.icon);
                const isActive = currentModule === module.module;
                const hasSubMenus = module.subMenus && module.subMenus.length > 0;
                const isExpanded_Module = expandedModules.has(module.module);

                // Check if any sub-menu is active
                const isSubMenuActive = hasSubMenus && module.subMenus!.some((sub) => location.pathname === sub.path);

                if (hasSubMenus && (isExpanded || isMobileOpen)) {
                  return (
                    <Collapsible
                      key={module.module}
                      open={isExpanded_Module}
                      onOpenChange={() => toggleModuleExpand(module.module)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full h-11 transition-all duration-200 justify-between",
                            isActive || isSubMenuActive
                              ? "theme-bg-primary text-white hover:theme-bg-primary/90 shadow-md"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          )}
                        >
                          <div className="flex items-center">
                            <IconComponent className="w-5 h-5 mr-3" />
                            <span>{module.label}</span>
                          </div>
                          <ChevronDown
                            className={cn("w-4 h-4 transition-transform", isExpanded_Module && "rotate-180")}
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 mt-1 ml-4">
                        {module.subMenus!.map((subMenu) => {
                          const SubIcon = getIconComponent(subMenu.icon);
                          const isSubActive = location.pathname === subMenu.path;
                          
                          // ✅ CHECK PERMISSION for voucher sub-menu
                          if (subMenu.path === '/ERP/Marketing/voucher') {
                            if (!currentUser.permissions.modules.includes('voucher')) {
                              return null;
                            }
                          }
                          
                          // ✅ CHECK PERMISSION for lens admin sub-menu
                          if (subMenu.path === '/ERP/Operations/Lens-Admin') {
                            if (!currentUser.permissions.modules.includes('operations')) {
                              return null;
                            }
                          }

                          return (
                            <Button
                              key={subMenu.path}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start text-sm h-9",
                                isSubActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
                              )}
                              onClick={() => {
                                navigate(subMenu.path);
                                if (isMobileOpen) {
                                  onMobileToggle();
                                }
                              }}
                            >
                              <SubIcon className="w-4 h-4 mr-2" />
                              {subMenu.label}
                            </Button>
                          );
                        })}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }

                const buttonContent = (
                  <Button
                    key={module.module}
                    variant="ghost"
                    className={cn(
                      "w-full h-11 transition-all duration-200",
                      isExpanded || isMobileOpen ? "justify-start text-left" : "justify-center p-0",
                      isActive
                        ? "theme-bg-primary text-white hover:theme-bg-primary/90 shadow-md"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    onClick={() => {
                      onModuleChange(module.module);
                      if (isMobileOpen) {
                        onMobileToggle();
                      }
                    }}
                  >
                    <IconComponent className={cn("w-5 h-5", isExpanded || isMobileOpen ? "mr-3" : "")} />
                    {(isExpanded || isMobileOpen) && <span>{module.label}</span>}
                  </Button>
                );

                // Wrap with tooltip when collapsed on desktop
                if (!isExpanded && !isMobileOpen) {
                  return (
                    <Tooltip key={module.module}>
                      <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                      <TooltipContent side="right" className="ml-2">
                        <p>{module.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return buttonContent;
              })}
            </nav>
          </div>

          {/* Footer */}
          {(isExpanded || isMobileOpen) && (
            <div className="p-4 border-t border-sidebar-border">
              <div className="text-xs text-sidebar-foreground/70 text-center">ERP v1.0.0 • © 2024 Company</div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
