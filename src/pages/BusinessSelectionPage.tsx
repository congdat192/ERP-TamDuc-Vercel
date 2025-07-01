
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
  const { businesses, isLoading, hasOwnBusiness, fetchBusinesses, selectBusiness } = useBusiness();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Auto-redirect logic
  useEffect(() => {
    if (!isLoading && businesses.length > 0) {
      // If user has only 1 business and it's their own, auto-select
      if (businesses.length === 1 && hasOwnBusiness) {
        const ownBusiness = businesses[0];
        handleSelectBusiness(ownBusiness.id);
        return;
      }
    }
    
    // If user has no businesses, redirect to create business
    if (!isLoading && businesses.length === 0) {
      navigate('/create-business');
      return;
    }
  }, [businesses, isLoading, hasOwnBusiness, navigate]);

  const handleSelectBusiness = async (businessId: number) => {
    setSelectedBusinessId(businessId);
    try {
      await selectBusiness(businessId);
      navigate(`/ERP/${businessId}/Dashboard`);
    } catch (error) {
      console.error('Failed to select business:', error);
      setSelectedBusinessId(null);
    }
  };

  const handleCreateBusiness = () => {
    navigate('/create-business');
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải danh sách doanh nghiệp...</p>
        </div>
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
            Chào mừng {currentUser?.fullName}! Vui lòng chọn doanh nghiệp để tiếp tục.
          </p>
          <p className="text-sm text-gray-500">
            Bạn đang tham gia {businesses.length} doanh nghiệp
          </p>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {businesses.map((business) => (
            <Card 
              key={business.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                selectedBusinessId === business.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleSelectBusiness(business.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getRoleBadgeColor(business.user_role)}>
                          {business.is_owner && <Crown className="w-3 h-3 mr-1" />}
                          {getRoleDisplayName(business.user_role)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {selectedBusinessId === business.id ? (
                    <Loader2 className="animate-spin w-5 h-5 text-blue-500" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm mb-3">
                  {business.description || 'Chưa có mô tả'}
                </CardDescription>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>ID: {business.id}</span>
                  </div>
                  <span>
                    {new Date(business.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Business Section */}
        <div className="text-center">
          <Card className="max-w-md mx-auto border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tạo Doanh Nghiệp Mới
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {hasOwnBusiness 
                  ? 'Bạn đã có doanh nghiệp riêng. Chỉ được tạo tối đa 1 doanh nghiệp.'
                  : 'Tạo doanh nghiệp riêng để quản lý hoạt động kinh doanh của bạn.'
                }
              </p>
              <Button 
                onClick={handleCreateBusiness}
                disabled={hasOwnBusiness}
                className="w-full"
                variant={hasOwnBusiness ? "outline" : "default"}
              >
                <Plus className="w-4 h-4 mr-2" />
                {hasOwnBusiness ? 'Đã Tạo Doanh Nghiệp' : 'Tạo Doanh Nghiệp'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
