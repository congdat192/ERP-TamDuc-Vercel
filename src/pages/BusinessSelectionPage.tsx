
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Crown, Users, ArrowRight, Loader2, RefreshCw, Mail } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/components/auth/AuthContext';
import { Business } from '@/types/business';
import { useToast } from '@/hooks/use-toast';
import { UserInvitationService } from '@/modules/user-management/services/userInvitationService';

export function BusinessSelectionPage() {
  const { businesses, hasOwnBusiness, selectBusiness, isLoading, error, refreshBusinesses } = useBusiness();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingInvitationsCount, setPendingInvitationsCount] = useState(0);
  const [loadingInvitations, setLoadingInvitations] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication on mount - don't fetch businesses (BusinessContext handles this)
  useEffect(() => {
    console.log('🚀 [BusinessSelectionPage] Initializing...');
    
    if (!isAuthenticated || !currentUser) {
      console.log('❌ [BusinessSelectionPage] User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('✅ [BusinessSelectionPage] User authenticated, waiting for BusinessContext to load businesses');
  }, [isAuthenticated, currentUser, navigate]);

  // Fetch pending invitations count
  const fetchPendingInvitations = async () => {
    if (!isAuthenticated || !currentUser) return;
    
    setLoadingInvitations(true);
    try {
      const response = await UserInvitationService.getUserInvitations({
        page: 1,
        perPage: 100, // Get all to count
        orderBy: 'created_at',
        orderDirection: 'desc'
      });
      setPendingInvitationsCount(response.data.length);
      console.log('📧 [BusinessSelectionPage] Pending invitations:', response.data.length);
    } catch (error: any) {
      console.error('❌ [BusinessSelectionPage] Error fetching invitations:', error);
      // Don't show toast for invitation fetch errors as it's not critical
    } finally {
      setLoadingInvitations(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchPendingInvitations();
    }
  }, [isAuthenticated, currentUser]);

  const handleBusinessSelect = async (business: Business) => {
    if (selectedBusinessId === business.id || isSelecting || isLoading) return;
    
    setSelectedBusinessId(business.id);
    setIsSelecting(true);
    
    try {
      console.log('🏢 [BusinessSelectionPage] Selecting business:', business.name);
      await selectBusiness(business.id);
      
      // Check for intended route to restore
      const intendedRoute = sessionStorage.getItem('intendedRoute');
      if (intendedRoute && intendedRoute !== '/business-selection') {
        console.log('🔄 [BusinessSelectionPage] Restoring intended route:', intendedRoute);
        sessionStorage.removeItem('intendedRoute');
        navigate(intendedRoute);
      } else {
        // Navigate to ERP Dashboard by default
        navigate('/ERP/Dashboard');
      }
    } catch (error: any) {
      console.error('❌ [BusinessSelectionPage] Failed to select business:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể chọn doanh nghiệp",
        variant: "destructive",
      });
      setSelectedBusinessId(null);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleCreateBusiness = () => {
    if (hasOwnBusiness) {
      toast({
        title: "Thông báo",
        description: "Bạn đã có doanh nghiệp riêng. Mỗi tài khoản chỉ được tạo tối đa 1 doanh nghiệp.",
        variant: "default",
      });
      return;
    }
    navigate('/create-business');
  };

  const handleRefresh = async () => {
    if (isRefreshing || isLoading) return;
    
    setIsRefreshing(true);
    try {
      console.log('🔄 [BusinessSelectionPage] Manually refreshing businesses');
      await Promise.all([
        refreshBusinesses(),
        fetchPendingInvitations()
      ]);
      toast({
        title: "Thành công",
        description: "Đã làm mới danh sách doanh nghiệp",
        variant: "default",
      });
    } catch (error: any) {
      console.error('❌ [BusinessSelectionPage] Failed to refresh businesses:', error);
      toast({
        title: "Lỗi",
        description: "Không thể làm mới danh sách doanh nghiệp",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleManageInvitations = () => {
    navigate('/invitations');
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

  // Redirect if not authenticated
  if (!isAuthenticated || !currentUser) {
    return null;
  }

  // Show loading while BusinessContext is loading
  if (isLoading && businesses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải doanh nghiệp...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error and no cached businesses
  if (error && businesses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không thể tải doanh nghiệp
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <div className="space-x-2">
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Thử lại
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
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
          
          {/* Show intended route message if exists */}
          {sessionStorage.getItem('intendedRoute') && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Bạn sẽ được chuyển về trang đã truy cập trước đó sau khi chọn doanh nghiệp.
              </p>
            </div>
          )}

          {/* Show error message if there's an error but we have cached businesses */}
          {error && businesses.length > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                Cảnh báo: {error}
              </p>
            </div>
          )}

          {/* Invitation Notification */}
          {pendingInvitationsCount > 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">
                  Bạn có {pendingInvitationsCount} lời mời đang chờ phản hồi
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border-green-300 text-green-700 hover:bg-green-100"
                onClick={handleManageInvitations}
              >
                Xem và quản lý lời mời
              </Button>
            </div>
          )}
        </div>

        {/* User Info & Actions */}
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
          <div className="flex space-x-2">
            {/* Invitations Button with Badge */}
            <Button 
              variant="outline" 
              onClick={handleManageInvitations}
              className="relative"
              size="sm"
            >
              <Mail className="w-4 h-4 mr-2" />
              Lời mời
              {pendingInvitationsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                  {pendingInvitationsCount}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={isRefreshing || isLoading}
              size="sm"
            >
              {isRefreshing ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Làm mới
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Đăng Xuất
            </Button>
          </div>
        </div>

        {/* Businesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {businesses.map((business) => (
            <Card 
              key={business.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
              onClick={() => handleBusinessSelect(business)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={getRoleBadgeColor(business.user_role)}>
                    {business.is_owner && <Crown className="w-3 h-3 mr-1" />}
                    {getRoleDisplayName(business.user_role)}
                  </Badge>
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
                  disabled={selectedBusinessId === business.id || isLoading || isSelecting}
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
          ))}

          {/* Create Business Card */}
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-300"
            onClick={handleCreateBusiness}
          >
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle className="text-lg">
                {hasOwnBusiness ? 'Tạo Doanh Nghiệp' : 'Tạo Doanh Nghiệp Mới'}
              </CardTitle>
              <CardDescription className="text-sm">
                {hasOwnBusiness 
                  ? 'Bạn đã có doanh nghiệp riêng (giới hạn 1 doanh nghiệp/tài khoản)' 
                  : 'Tạo doanh nghiệp của riêng bạn'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant={hasOwnBusiness ? "outline" : "default"}
                className="w-full"
                disabled={hasOwnBusiness}
              >
                {hasOwnBusiness ? 'Đã có doanh nghiệp' : 'Tạo Mới'}
                {!hasOwnBusiness && <Plus className="w-4 h-4 ml-2" />}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* No Businesses Message */}
        {businesses.length === 0 && !isLoading && (
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
