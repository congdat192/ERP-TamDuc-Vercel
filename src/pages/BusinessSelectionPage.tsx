
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Plus, Crown, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/components/auth/AuthContext';
import { Business } from '@/types/business';

export function BusinessSelectionPage() {
  const { businesses, hasOwnBusiness, fetchBusinesses, selectBusiness, isLoading } = useBusiness();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Check authentication and fetch businesses on mount
  useEffect(() => {
    const initializePage = async () => {
      console.log('🚀 [BusinessSelectionPage] Initializing...');
      
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
      } finally {
        setIsInitializing(false);
      }
    };

    initializePage();
  }, [isAuthenticated, currentUser, navigate]); // Remove fetchBusinesses from dependencies

  const handleBusinessSelect = async (business: Business) => {
    if (selectedBusinessId === business.id) return;
    
    setSelectedBusinessId(business.id);
    try {
      console.log('🏢 [BusinessSelectionPage] Selecting business:', business.name);
      await selectBusiness(business.id);
      // Navigate to ERP Dashboard without business ID in URL
      navigate('/ERP/Dashboard');
    } catch (error) {
      console.error('❌ [BusinessSelectionPage] Failed to select business:', error);
      setSelectedBusinessId(null);
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
