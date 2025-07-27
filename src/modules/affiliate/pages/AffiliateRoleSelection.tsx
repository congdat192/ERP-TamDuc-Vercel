
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, ArrowRight, Eye, UserCheck } from 'lucide-react';

export function AffiliateRoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'f0' | null>(null);

  const handleRoleSelect = (role: 'admin' | 'f0') => {
    setSelectedRole(role);
    if (role === 'admin') {
      navigate('/erp/affiliate/admin');
    } else {
      navigate('/erp/affiliate/f0');
    }
  };

  const roles = [
    {
      id: 'admin' as const,
      title: 'Admin Portal',
      description: 'Quản lý hệ thống Affiliate',
      icon: Shield,
      color: 'theme-bg-primary',
      textColor: 'text-white',
      features: [
        'Duyệt đăng ký F0',
        'Quản lý giới thiệu',
        'Quản lý voucher',
        'Duyệt rút tiền',
        'Thống kê & báo cáo',
        'Cài đặt hệ thống'
      ],
      buttonText: 'Truy cập Admin Portal'
    },
    {
      id: 'f0' as const,
      title: 'F0 Portal',
      description: 'Dành cho người giới thiệu',
      icon: Users,
      color: 'theme-bg-secondary',
      textColor: 'text-white',
      features: [
        'Đăng ký tài khoản F0',
        'Giới thiệu khách hàng mới',
        'Theo dõi hoa hồng',
        'Yêu cầu rút tiền',
        'Lịch sử giới thiệu',
        'Quản lý thông tin cá nhân'
      ],
      buttonText: 'Truy cập F0 Portal'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold theme-text mb-2">
            Hệ Thống Affiliate
          </h1>
          <p className="theme-text-muted text-lg">
            Mắt Kính Tâm Đức - Chương trình giới thiệu khách hàng
          </p>
          <div className="mt-4 flex justify-center">
            <Badge variant="outline" className="text-sm">
              Chọn loại tài khoản để tiếp tục
            </Badge>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
                  selectedRole === role.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className={`w-8 h-8 ${role.textColor}`} />
                  </div>
                  <CardTitle className="text-xl theme-text">
                    {role.title}
                  </CardTitle>
                  <p className="theme-text-muted">
                    {role.description}
                  </p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm theme-text">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${role.color} ${role.textColor} hover:opacity-90`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelect(role.id);
                    }}
                  >
                    {role.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Về Chương Trình Affiliate
                  </h3>
                  <p className="text-blue-700 text-sm">
                    Hệ thống giới thiệu 1 cấp: F0 (người giới thiệu) mời F1 (khách hàng mới) bằng cách nhập số điện thoại. 
                    Nếu F1 chưa là khách hàng, họ sẽ nhận voucher qua SMS. Khi F1 sử dụng voucher mua hàng, 
                    F0 nhận hoa hồng tiền mặt có thể rút về (được admin duyệt).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
