import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Phone, Building, Briefcase, Calendar, LogOut } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface EmployeeProfile {
  id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string;
  position: string;
  join_date: string;
  status: string;
  employment_type: string;
}

export function MyProfilePage() {
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/employee-login');
      return;
    }

    fetchEmployeeProfile();
  }, [isAuthenticated, currentUser]);

  const fetchEmployeeProfile = async () => {
    try {
      setLoading(true);

      const { data: employeeData, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', currentUser?.id)
        .single();

      if (error) {
        console.error('❌ Error fetching employee:', error);
        throw error;
      }

      if (!employeeData) {
        throw new Error('Không tìm thấy thông tin nhân viên');
      }

      setEmployee(employeeData);
    } catch (error: any) {
      console.error('❌ Error:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải thông tin nhân viên',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/employee-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                Không tìm thấy thông tin nhân viên. Vui lòng liên hệ HR.
              </AlertDescription>
            </Alert>
            <Button 
              className="w-full mt-4" 
              onClick={handleLogout}
            >
              Đăng Xuất
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Nhân Viên</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng Xuất
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{employee.full_name}</CardTitle>
                <p className="text-blue-100">Mã NV: {employee.employee_code}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium text-gray-900">{employee.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>Số điện thoại</span>
                </div>
                <p className="font-medium text-gray-900">{employee.phone || 'Chưa cập nhật'}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Building className="w-4 h-4" />
                  <span>Phòng ban</span>
                </div>
                <p className="font-medium text-gray-900">{employee.department}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Briefcase className="w-4 h-4" />
                  <span>Chức vụ</span>
                </div>
                <p className="font-medium text-gray-900">{employee.position}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Ngày vào công ty</span>
                </div>
                <p className="font-medium text-gray-900">
                  {new Date(employee.join_date).toLocaleDateString('vi-VN')}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="w-4 h-4" />
                  <span>Loại hợp đồng</span>
                </div>
                <p className="font-medium text-gray-900">
                  {employee.employment_type === 'Thử việc' ? 'Thử việc' : 
                   employee.employment_type === 'Chính thức' ? 'Chính thức' : 
                   employee.employment_type}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="pt-4 border-t">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                employee.status === 'working' ? 'bg-green-100 text-green-800' :
                employee.status === 'probation' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {employee.status === 'working' ? '✓ Đang làm việc' :
                 employee.status === 'probation' ? '⏱ Thử việc' :
                 employee.status}
              </span>
            </div>

            {/* Info Alert */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-sm text-gray-700">
                💡 Nếu cần thay đổi thông tin cá nhân (số điện thoại, địa chỉ, v.v.), vui lòng liên hệ Phòng Nhân sự.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
