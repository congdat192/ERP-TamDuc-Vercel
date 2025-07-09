
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Users, 
  Calendar, 
  Crown, 
  Settings,
  ExternalLink,
  UserMinus
} from 'lucide-react';
import { Business } from '@/types/business';

interface BusinessMembershipCardProps {
  businesses?: Business[];
  currentBusiness?: Business;
  isOwnProfile?: boolean;
  onSwitchBusiness?: (businessId: string) => void;
  onLeaveBusiness?: (businessId: string) => void;
}

export function BusinessMembershipCard({ 
  businesses = [], 
  currentBusiness,
  isOwnProfile = true,
  onSwitchBusiness,
  onLeaveBusiness 
}: BusinessMembershipCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="w-5 h-5" />
          <span>Business Membership</span>
        </CardTitle>
        <CardDescription>
          Danh sách các business/workspace bạn đang tham gia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Business */}
          {currentBusiness && (
            <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900">{currentBusiness.name}</h4>
                    <p className="text-sm text-blue-700">{currentBusiness.description}</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-blue-500">
                  <Crown className="w-3 h-3 mr-1" />
                  Business chính
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600 font-medium">Tham gia từ:</span>
                  <p className="text-blue-800">{new Date(currentBusiness.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <span className="text-blue-600 font-medium">Vai trò:</span>
                  <p className="text-blue-800">Owner/Admin</p>
                </div>
              </div>

              {isOwnProfile && (
                <div className="flex space-x-2 mt-3">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-1" />
                    Quản lý
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Xem chi tiết
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Other Businesses */}
          {businesses.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Các business khác:</h4>
              {businesses.map((business) => (
                <div key={business.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-medium">{business.name}</h5>
                      <p className="text-sm text-gray-500">
                        Tham gia: {new Date(business.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Member</Badge>
                    {isOwnProfile && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onLeaveBusiness?.(business.id.toString())}
                      >
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Building className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">Chưa tham gia business nào khác</p>
              {isOwnProfile && (
                <Button variant="outline" className="mt-3">
                  Yêu cầu tham gia business
                </Button>
              )}
            </div>
          )}

          {/* Business Statistics */}
          {currentBusiness && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Thống kê business:</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <Users className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <p className="text-sm font-medium">Tổng thành viên</p>
                  <p className="text-lg font-bold text-gray-900">--</p>
                </div>
                <div>
                  <Calendar className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <p className="text-sm font-medium">Hoạt động</p>
                  <p className="text-lg font-bold text-gray-900">--</p>
                </div>
                <div>
                  <Settings className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                  <p className="text-sm font-medium">Modules</p>
                  <p className="text-lg font-bold text-gray-900">8</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
