import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Plus, Crown, Users, ArrowRight, Loader2, UserCheck, AlertCircle } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/components/auth/AuthContext';
import { Business } from '@/types/business';

export function BusinessSelectionPage() {
  const { businesses, hasOwnBusiness, fetchBusinesses, selectBusiness, isLoading } = useBusiness();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Ensure businesses is always an array with defensive programming
  const safeBusinesses = Array.isArray(businesses) ? businesses : [];
  
  // Separate owned and invited businesses with defensive programming
  const ownedBusinesses = safeBusinesses.filter(business => business && business.is_owner === true);
  const invitedBusinesses = safeBusinesses.filter(business => business && business.is_owner === false);

  // Check authentication and fetch businesses on mount with error handling
  useEffect(() => {
    const initializePage = async () => {
      console.log('🚀 [BusinessSelectionPage] Initializing...');
      setError(null);
      
      if (!isAuthenticated || !currentUser) {
        console.log('❌ [BusinessSelectionPage] User not authenticated, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('🔄 [BusinessSelectionPage] Fetching businesses...');
        await fetchBusinesses();
      } catch (error) {
        console.error('❌ [BusinessSelectionPage] Failed to fetch businesses:', error);
        setError(error instanceof Error ? error.message : 'Không thể tải danh sách doanh nghiệp');
      } finally {
        setIsInitializing(false);
      }
    };

    initializePage();
  }, [isAuthenticated, currentUser, fetchBusinesses, navigate]);

  const handleBusinessSelect = async (business: Business) => {
    if (selectedBusinessId === business.id) return;
    
    setSelectedBusinessId(business.id);
    try {
      console.log('🏢 [BusinessSelectionPage] Selecting business:', business.name);
      await selectBusiness(business.id);
      navigate(`/ERP/${business.id}/Dashboard`);
    } catch (error) {
      console.error('❌ [BusinessSelectionPage] Failed to select business:', error);
      setSelectedBusinessId(null);
      setError(error instanceof Error ? error.message : 'Không thể chọn doanh nghiệp');
    }
  };

  const handleCreateBusiness = () => {
    if (hasOwnBusiness) {
      // User already has a business, show limitation message
      alert('Bạn đã có doanh nghiệp riêng. Mỗi tài khoản chỉ được tạo tối đa 1 doanh nghiệp.');
      return;
    }
    navigate('/create-business');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
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

  const BusinessCard = ({ business, isOwned }: { business: Business; isOwned: boolean }) => (
    <Card 
      key={business.id} 
      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
      onClick={() => handleBusinessSelect(business)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isOwned 
              ? 'bg-gradient-to-br from-yellow-500 to-orange-600' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600'
          }`}>
            {isOwned ? (
              <Crown className="w-6 h-6 text-white" />
            ) : (
              <Building2 className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getRoleBadgeColor(business.user_role)}>
              {business.is_owner && <Crown className="w-3 h-3 mr-1" />}
              {getRoleDisplayName(business.user_role)}
            </Badge>
            {isOwned && (
              <Badge variant="outline" className="text-xs">
                Của tôi
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg">{business.name}</CardTitle>
        {business.description && (
          <CardDescription className="text-sm">
            {business.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full"
          disabled={selectedBusinessId === business.id || isLoading}
        >
          {selectedBusinessId === business.id ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Đang chọn...
            </>
          ) : (
            <>
              Vào ERP
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải doanh nghiệp...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đã xảy ra lỗi</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Tải lại trang
              </Button>
              <Button variant="outline" onClick={handleLogout} className="w-full">
                Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Chọn Doanh Nghiệp</h1>
          </div>
          <p className="text-gray-600 mb-2">
            Chào mừng {currentUser.fullName}! Hãy chọn doanh nghiệp để bắt đầu làm việc.
          </p>
          <p className="text-sm text-gray-500">
            Bạn có thể chuyển đổi giữa các doanh nghiệp bất kỳ lúc nào
          </p>
        </div>

        {/* User Info & Logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser.fullName}</p>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Đăng Xuất
          </Button>
        </div>

        {/* Owned Businesses Section */}
        {ownedBusinesses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Doanh Nghiệp Của Tôi ({ownedBusinesses.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} isOwned={true} />
              ))}
            </div>
          </div>
        )}

        {/* Invited Businesses Section */}
        {invitedBusinesses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <UserCheck className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Doanh Nghiệp Được Mời ({invitedBusinesses.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitedBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} isOwned={false} />
              ))}
            </div>
          </div>
        )}

        {/* Separator only if both sections exist */}
        {ownedBusinesses.length > 0 && invitedBusinesses.length > 0 && (
          <Separator className="my-8" />
        )}

        {/* Create Business Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Plus className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tạo Doanh Nghiệp Mới</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              className={`cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed ${
                hasOwnBusiness 
                  ? 'border-gray-200 hover:border-gray-300 opacity-60' 
                  : 'border-blue-300 hover:border-blue-400'
              }`}
              onClick={handleCreateBusiness}
            >
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-lg">
                  Tạo Doanh Nghiệp Mới
                </CardTitle>
                <CardDescription className="text-sm">
                  {hasOwnBusiness 
                    ? 'Bạn đã có doanh nghiệp riêng (giới hạn 1 doanh nghiệp/tài khoản)' 
                    : 'Tạo doanh nghiệp của riêng bạn và trở thành chủ sở hữu'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant={hasOwnBusiness ? "outline" : "default"}
                  className="w-full"
                  disabled={hasOwnBusiness}
                >
                  {hasOwnBusiness ? (
                    <>
                      <Crown className="w-4 h-4 mr-2" />
                      Đã có doanh nghiệp
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo Mới
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* No Businesses Message */}
        {businesses.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có doanh nghiệp nào
              </h3>
              <p className="text-gray-500 mb-4">
                Bạn chưa tham gia hoặc tạo doanh nghiệp nào. Hãy tạo doanh nghiệp đầu tiên!
              </p>
              <Button onClick={handleCreateBusiness}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo Doanh Nghiệp Đầu Tiên
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
