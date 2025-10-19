import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, User, Gift, FileText, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmployeePersonalInfoTab } from '@/components/profile/EmployeePersonalInfoTab';
import { EmployeeBenefitsTab } from '@/components/profile/EmployeeBenefitsTab';
import { EmployeePersonalDocumentsTab } from '@/components/profile/EmployeePersonalDocumentsTab';
import { EmployeeChangeRequestsTab } from '@/components/profile/EmployeeChangeRequestsTab';

export function MyProfilePage() {
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [employee, setEmployee] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 [MyProfile] currentUser:', currentUser);
    console.log('🔍 [MyProfile] currentUser.id:', currentUser?.id);
    
    if (!currentUser?.id) {
      console.log('⏳ [MyProfile] Waiting for currentUser...');
      
      // Timeout fallback to prevent infinite loading
      const timeout = setTimeout(() => {
        console.error('❌ [MyProfile] Timeout waiting for currentUser');
        setIsLoading(false);
        toast({
          title: "Lỗi Timeout",
          description: "Không thể tải thông tin. Vui lòng đăng nhập lại.",
          variant: "destructive",
        });
      }, 10000); // 10s timeout
      
      return () => clearTimeout(timeout);
    }

    let retryCount = 0;
    const maxRetries = 3;

    const fetchEmployee = async () => {
      console.log(`📥 [MyProfile] Fetching employee for user_id: ${currentUser.id}`);
      
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (error) {
          console.error('❌ [MyProfile] Error fetching employee:', error);
          toast({
            title: "Lỗi",
            description: "Không thể tải thông tin nhân viên",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        console.log('📦 [MyProfile] Employee data:', data);

        if (!data && retryCount < maxRetries) {
          retryCount++;
          console.log(`🔄 [MyProfile] Retry fetch employee (${retryCount}/${maxRetries})...`);
          setTimeout(fetchEmployee, 1000);
          return;
        }

        setEmployee(data);
        setIsLoading(false);
      } catch (err: any) {
        console.error('❌ [MyProfile] Error in fetchEmployee:', err);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin nhân viên",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [currentUser?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không Tìm Thấy Thông Tin</h2>
          <p className="text-muted-foreground mb-4">
            Tài khoản của bạn chưa được liên kết với hồ sơ nhân viên.
          </p>
          <Button onClick={logout}>Đăng Xuất</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Hồ Sơ Nhân Viên</h1>
            <p className="text-muted-foreground mt-1">
              {employee.full_name} - {employee.employee_code}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Đăng Xuất
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="personal">
              <User className="w-4 h-4 mr-2" />
              Thông Tin
            </TabsTrigger>
            <TabsTrigger value="benefits">
              <Gift className="w-4 h-4 mr-2" />
              Phúc Lợi
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="w-4 h-4 mr-2" />
              Hồ Sơ
            </TabsTrigger>
            <TabsTrigger value="requests">
              <Send className="w-4 h-4 mr-2" />
              Yêu Cầu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <EmployeePersonalInfoTab
              employee={employee}
              onChangeTab={setActiveTab}
              onEmployeeUpdate={setEmployee}
            />
          </TabsContent>

          <TabsContent value="benefits">
            <EmployeeBenefitsTab employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="documents">
            <EmployeePersonalDocumentsTab employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="requests">
            <EmployeeChangeRequestsTab
              employeeId={employee.id}
              employeeName={employee.full_name}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
