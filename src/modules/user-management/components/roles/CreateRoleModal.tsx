
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { RoleCreationData, CustomRole, ModuleInfo, ModulePermissions } from '../../types/role-management';
import { RoleService } from '../../services/roleService';
import { ModuleService } from '../../services/moduleService';
import { SimpleModuleList } from './SimpleModuleList';
import { PermissionDetailArea } from './PermissionDetailArea';
import { AlertTriangle, Info } from 'lucide-react';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleCreated: (role: CustomRole) => void;
}

interface FormData {
  name: string;
  description: string;
}

export function CreateRoleModal({ isOpen, onClose, onRoleCreated }: CreateRoleModalProps) {
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [permissions, setPermissions] = useState<ModulePermissions>({});
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [moduleLoadError, setModuleLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (isOpen) {
      loadModules();
    }
  }, [isOpen]);

  const loadModules = async () => {
    try {
      setIsLoadingModules(true);
      setModuleLoadError(null);
      console.log('🔧 [CreateRoleModal] Loading modules...');
      
      const modulesData = await ModuleService.getActiveModules();
      console.log('🔧 [CreateRoleModal] Loaded modules:', modulesData);
      
      setModules(modulesData);
      
      // Initialize permissions for all modules
      const initialPermissions: ModulePermissions = {};
      modulesData.forEach(module => {
        initialPermissions[module.id] = {
          view: false,
          add: false,
          edit: false,
          delete: false
        };
      });
      setPermissions(initialPermissions);
      
      // Select first module by default if available
      if (modulesData.length > 0 && !selectedModuleId) {
        setSelectedModuleId(modulesData[0].id);
      }
    } catch (error) {
      console.error('❌ [CreateRoleModal] Error loading modules:', error);
      setModuleLoadError('Không thể tải danh sách modules. Sử dụng modules mặc định.');
      
      // Use fallback modules
      const fallbackModules: ModuleInfo[] = [
        {
          id: 'voucher',
          name: 'voucher',
          label: 'Quản Lý Voucher',
          icon: 'Ticket',
          features: [],
          status: 'active'
        },
        {
          id: 'customer',
          name: 'customer',
          label: 'Quản Lý Khách Hàng',
          icon: 'Users',
          features: [],
          status: 'active'
        }
      ];
      
      setModules(fallbackModules);
      const initialPermissions: ModulePermissions = {};
      fallbackModules.forEach(module => {
        initialPermissions[module.id] = {
          view: false,
          add: false,
          edit: false,
          delete: false
        };
      });
      setPermissions(initialPermissions);
      
      if (fallbackModules.length > 0) {
        setSelectedModuleId(fallbackModules[0].id);
      }
    } finally {
      setIsLoadingModules(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      const roleData: RoleCreationData = {
        name: data.name,
        description: data.description,
        permissions
      };

      console.log('🔧 [CreateRoleModal] Submitting role data:', roleData);
      const newRole = await RoleService.createRole(roleData);
      onRoleCreated(newRole);
      handleClose();
      
      toast({
        title: "Thành công",
        description: "Tạo vai trò mới thành công"
      });
    } catch (error) {
      console.error('❌ [CreateRoleModal] Error creating role:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể tạo vai trò",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setPermissions({});
    setSelectedModuleId(null);
    setModuleLoadError(null);
    onClose();
  };

  const handlePermissionChange = (moduleId: string, permission: keyof typeof permissions[string], value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permission]: value
      }
    }));
  };

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModuleId(moduleId);
  };

  const getSelectedPermissionsCount = () => {
    return Object.values(permissions).reduce((count, perms) => {
      return count + Object.values(perms).filter(Boolean).length;
    }, 0);
  };

  const getSelectedModulesCount = () => {
    return Object.values(permissions).filter(perms => 
      Object.values(perms).some(Boolean)
    ).length;
  };

  const selectedModule = selectedModuleId ? modules.find(m => m.id === selectedModuleId) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Tạo Vai Trò Mới</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[600px]">
          {/* Left Column 70% - Form + Permission Detail */}
          <div className="flex-[7] space-y-6 overflow-y-auto pr-2">
            {moduleLoadError && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{moduleLoadError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Thông Tin Cơ Bản</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên Vai Trò *</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Tên vai trò là bắt buộc' })}
                      placeholder="Nhập tên vai trò"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô Tả</Label>
                    <Input
                      id="description"
                      {...register('description')}
                      placeholder="Mô tả vai trò"
                    />
                  </div>
                </div>
              </div>

              {/* Permission Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Tổng Quan Quyền</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {getSelectedModulesCount()}
                    </div>
                    <div className="text-sm text-blue-600">Modules được chọn</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {getSelectedPermissionsCount()}
                    </div>
                    <div className="text-sm text-green-600">Tổng số quyền</div>
                  </div>
                </div>

                {getSelectedPermissionsCount() === 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Bạn chưa chọn quyền nào. Vai trò sẽ được tạo với quyền rỗng và có thể cập nhật sau.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Đang tạo...' : 'Tạo Vai Trò'}
                </Button>
              </div>
            </form>

            {/* Permission Detail Area */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Chi Tiết Quyền</h3>
              <div className="min-h-[300px]">
                <PermissionDetailArea
                  selectedModule={selectedModule}
                  permissions={permissions}
                  onPermissionChange={handlePermissionChange}
                />
              </div>
            </div>
          </div>

          {/* Right Column 30% - Modules List */}
          <div className="flex-[3] border-l pl-6 overflow-y-auto">
            {isLoadingModules ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Đang tải modules...</div>
              </div>
            ) : (
              <SimpleModuleList
                modules={modules}
                permissions={permissions}
                selectedModuleId={selectedModuleId}
                onModuleSelect={handleModuleSelect}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
