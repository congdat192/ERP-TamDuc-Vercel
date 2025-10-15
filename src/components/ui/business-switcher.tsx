
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, Plus, Crown, Users, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBusiness } from '@/contexts/BusinessContext';
import { useNavigate } from 'react-router-dom';
import { Business } from '@/types/business';
import { getBusinessLogoUrl } from '@/services/businessService';

interface BusinessSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function BusinessSwitcher({ className, compact = false }: BusinessSwitcherProps) {
  const { businesses, currentBusiness, hasOwnBusiness, selectBusiness } = useBusiness();
  const [isSelectingBusiness, setIsSelectingBusiness] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const navigate = useNavigate();

  const handleBusinessSelect = async (business: Business) => {
    if (business.id === currentBusiness?.id) return;
    
    setIsSelectingBusiness(true);
    try {
      await selectBusiness(business.id);
      navigate('/ERP/Dashboard');
    } catch (error) {
      console.error('Failed to switch business:', error);
    } finally {
      setIsSelectingBusiness(false);
    }
  };

  const handleCreateBusiness = () => {
    if (hasOwnBusiness) {
      setShowCreateDialog(true);
    } else {
      navigate('/create-business');
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'owner': return 'Chủ Sở Hữu';
      case 'admin': return 'Quản Trị Viên';
      case 'member': return 'Thành Viên';
      default: return 'Thành Viên';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Business logo component for consistent rendering
  const BusinessLogo = ({ business, size = "w-8 h-8" }: { business: Business; size?: string }) => {
    const logoUrl = getBusinessLogoUrl(business.logo_path);
    
    if (logoUrl) {
      return (
        <div className={`${size} rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 flex-shrink-0`}>
          <img 
            src={logoUrl} 
            alt={`${business.name} logo`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <Building2 className="w-4 h-4 text-gray-600 hidden" />
        </div>
      );
    }
    
    return (
      <div className={`${size} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Building2 className="w-4 h-4 text-white" />
      </div>
    );
  };

  if (!currentBusiness) return null;

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={`flex items-center gap-1.5 h-8 px-2 ${className}`}
          >
            <BusinessLogo business={currentBusiness} size="w-5 h-5" />
            <span className="text-xs max-w-24 truncate hidden sm:inline">
              {currentBusiness.name}
            </span>
            <ChevronDown className="w-3 h-3 flex-shrink-0 hidden sm:inline" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              Doanh nghiệp của bạn ({businesses.length})
            </div>
            
            {businesses.map((business) => (
              <DropdownMenuItem
                key={business.id}
                onClick={() => handleBusinessSelect(business)}
                disabled={isSelectingBusiness}
                className="p-3 cursor-pointer"
              >
                <div className="flex items-center space-x-3 w-full">
                  <BusinessLogo business={business} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {business.name}
                      </span>
                      {business.id === currentBusiness.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs px-1 py-0 ${getRoleBadgeColor(business.user_role)}`}>
                        {business.is_owner && <Crown className="w-2 h-2 mr-1" />}
                        {getRoleDisplayName(business.user_role)}
                      </Badge>
                      {business.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {business.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={handleCreateBusiness}
              disabled={isSelectingBusiness}
              className="p-3 cursor-pointer"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-sm">
                    {hasOwnBusiness ? 'Tạo Doanh Nghiệp' : 'Tạo Doanh Nghiệp Mới'}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {hasOwnBusiness 
                      ? 'Bạn đã có doanh nghiệp riêng' 
                      : 'Tạo doanh nghiệp của riêng bạn'
                    }
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={`flex items-center space-x-2 h-auto p-2 ${className}`}
          >
            <BusinessLogo business={currentBusiness} />
            <div className="flex flex-col items-start min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm truncate max-w-32">
                  {currentBusiness.name}
                </span>
                <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex items-center space-x-1">
                <Badge className={`text-xs px-1 py-0 ${getRoleBadgeColor(currentBusiness.user_role)}`}>
                  {currentBusiness.is_owner && <Crown className="w-2 h-2 mr-1" />}
                  {getRoleDisplayName(currentBusiness.user_role)}
                </Badge>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">
              Doanh nghiệp của bạn ({businesses.length})
            </div>
            
            {businesses.map((business) => (
              <DropdownMenuItem
                key={business.id}
                onClick={() => handleBusinessSelect(business)}
                disabled={isSelectingBusiness}
                className="p-3 cursor-pointer"
              >
                <div className="flex items-center space-x-3 w-full">
                  <BusinessLogo business={business} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">
                        {business.name}
                      </span>
                      {business.id === currentBusiness.id && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs px-1 py-0 ${getRoleBadgeColor(business.user_role)}`}>
                        {business.is_owner && <Crown className="w-2 h-2 mr-1" />}
                        {getRoleDisplayName(business.user_role)}
                      </Badge>
                      {business.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {business.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={handleCreateBusiness}
              disabled={isSelectingBusiness}
              className="p-3 cursor-pointer"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-sm">
                    {hasOwnBusiness ? 'Tạo Doanh Nghiệp' : 'Tạo Doanh Nghiệp Mới'}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {hasOwnBusiness 
                      ? 'Bạn đã có doanh nghiệp riêng' 
                      : 'Tạo doanh nghiệp của riêng bạn'
                    }
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Business Limitation Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giới Hạn Tạo Doanh Nghiệp</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Bạn đã có doanh nghiệp riêng
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Mỗi tài khoản chỉ được tạo tối đa 1 doanh nghiệp riêng. Bạn có thể được mời tham gia các doanh nghiệp khác với vai trò thành viên hoặc quản trị viên.
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateDialog(false)}
                  >
                    Đã Hiểu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
