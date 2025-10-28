import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Gift, FileText, Send, ChevronDown, DollarSign, Lock, ExternalLink, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EmployeePersonalInfoTab } from "@/components/profile/EmployeePersonalInfoTab";
import { EmployeeBenefitsTab } from "@/components/profile/EmployeeBenefitsTab";
import { EmployeePersonalDocumentsTab } from "@/components/profile/EmployeePersonalDocumentsTab";
import { EmployeeChangeRequestsTab } from "@/components/profile/EmployeeChangeRequestsTab";
import EmployeePayrollTab from "@/components/profile/EmployeePayrollTab";
import { EmployeeSecurityTab } from "@/components/profile/EmployeeSecurityTab";
import { Footer } from "@/components/layout/Footer";
import logoTamDuc from "@/assets/logo_tamduc.jpg";
import { CreatePasswordDialog } from "@/components/auth/CreatePasswordDialog";

export function MyProfilePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  const [employee, setEmployee] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(true);
  const [hasERPAccess, setHasERPAccess] = useState(false);
  const [showCreatePasswordDialog, setShowCreatePasswordDialog] = useState(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    console.log("🔍 [MyProfile] currentUser:", currentUser);
    console.log("🔍 [MyProfile] currentUser.id:", currentUser?.id);

    if (!currentUser?.id) {
      console.log("⏳ [MyProfile] Waiting for currentUser...");

      // Increased timeout to 15s for slower connections
      const timeout = setTimeout(() => {
        console.error("❌ [MyProfile] Timeout waiting for currentUser");
        setIsLoading(false);
        toast({
          title: "Lỗi Timeout",
          description: "Không thể tải thông tin. Vui lòng đăng nhập lại.",
          variant: "destructive",
        });
      }, 15000); // 15s timeout

      return () => clearTimeout(timeout);
    }

    // Reset retry count when currentUser changes
    retryCountRef.current = 0;

    const fetchEmployee = async () => {
      console.log(`📥 [MyProfile] Fetching employee for user_id: ${currentUser.id}`);

      try {
        const { data, error } = await supabase
          .from("employees")
          .select("*")
          .eq("user_id", currentUser.id)
          .maybeSingle();

        if (error) {
          console.error("❌ [MyProfile] Error fetching employee:", error);
          toast({
            title: "Lỗi",
            description: "Không thể tải thông tin nhân viên",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        console.log("📦 [MyProfile] Employee data:", data);

        if (!data && retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          console.log(`🔄 [MyProfile] Retry fetch employee (${retryCountRef.current}/${maxRetries})...`);
          setTimeout(fetchEmployee, 1000);
          return;
        }

        setEmployee(data);
        setHasERPAccess(!data?.is_employee_only); // false = có ERP, true = chỉ ESS
        setIsLoading(false);
      } catch (err: any) {
        console.error("❌ [MyProfile] Error in fetchEmployee:", err);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin nhân viên",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchEmployee();
  }, [currentUser?.id, toast]);

  useEffect(() => {
    const checkAndShowPasswordPrompt = async () => {
      if (!currentUser?.id || !employee) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('password_change_required')
        .eq('id', currentUser.id)
        .single();
      
      const hasPasswordNow = !profile?.password_change_required;
      setHasPassword(hasPasswordNow);
      
      // Nếu CHƯA có password → Hiện pop-up tự động
      if (!hasPasswordNow) {
        setTimeout(() => {
          setShowCreatePasswordDialog(true);
        }, 1000);
      }
    };
    
    checkAndShowPasswordPrompt();
  }, [currentUser?.id, employee]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-6xl mx-auto py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-12 w-full mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không Tìm Thấy Thông Tin</h2>
          <p className="text-muted-foreground mb-4">Tài khoản của bạn chưa được liên kết với hồ sơ nhân viên.</p>
          <Button onClick={logout}>Đăng Xuất</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="green-forest-theme min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          {/* Left: Company Branding */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <img
              src={logoTamDuc}
              alt="TamDuc Optical Logo"
              className="w-12 h-12 rounded-lg border border-border shadow-md object-contain bg-white p-1"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mắt Kính Tâm Đức</h1>
              <p className="text-sm text-muted-foreground">Employee Self Service Portal</p>
            </div>
          </div>

          {/* Right: ERP Button + User Menu Dropdown */}
          <div className="flex items-center gap-2">
            {/* Nút Truy Cập ERP - Hiện nếu có quyền */}
            {hasERPAccess && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/ERP/Dashboard')}
                className="gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Truy Cập ERP</span>
              </Button>
            )}

            {/* Dropdown Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{employee.full_name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{employee.full_name}</p>
                    <p className="text-xs text-muted-foreground">{employee.employee_code}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('requests')} className="cursor-pointer">
                  <Send className="w-4 h-4 mr-2" />
                  Yêu Cầu Thay Đổi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCreatePasswordDialog(true)} className="cursor-pointer">
                  <Shield className="w-4 h-4 mr-2" />
                  {hasPassword ? 'Đổi Mật Khẩu' : 'Tạo Mật Khẩu'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng Xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="relative">
          <div className="sticky top-0 z-20 bg-gradient-to-br from-green-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="personal">
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Thông Tin</span>
              </TabsTrigger>
              <TabsTrigger value="benefits">
                <Gift className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Phúc Lợi</span>
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Hồ Sơ</span>
              </TabsTrigger>
              <TabsTrigger value="payroll">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Phiếu Lương</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="personal">
            <EmployeePersonalInfoTab employee={employee} onChangeTab={setActiveTab} onEmployeeUpdate={setEmployee} />
          </TabsContent>

          <TabsContent value="benefits">
            <EmployeeBenefitsTab employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="documents">
            <EmployeePersonalDocumentsTab employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="payroll">
            <EmployeePayrollTab employeeId={employee.id} />
          </TabsContent>

          <TabsContent value="requests">
            <EmployeeChangeRequestsTab employeeId={employee.id} employeeName={employee.full_name} />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
      
      {/* Dialog tạo mật khẩu */}
      <CreatePasswordDialog
        isOpen={showCreatePasswordDialog}
        onClose={() => {
          setShowCreatePasswordDialog(false);
          // Refresh password status after creating password
          supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('password_change_required')
                .eq('id', user.id)
                .single();
              setHasPassword(!profile?.password_change_required);
            }
          });
        }}
        isRequired={false}
      />
    </div>
  );
}
