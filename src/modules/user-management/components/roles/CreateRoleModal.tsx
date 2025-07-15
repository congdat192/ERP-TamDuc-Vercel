
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
import { AlertTriangle, Info, XCircle, CheckCircle } from 'lucide-react';

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
  const [createError, setCreateError] = useState<string | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    console.log('🎯 [CreateRoleModal] useEffect triggered, isOpen:', isOpen);
    
    if (isOpen) {
      console.log('🎯 [CreateRoleModal] Modal is open, calling loadModules');
      loadModules();
      setCreateError(null); // Clear previous errors
    } else {
      console.log('🎯 [CreateRoleModal] Modal is closed, skipping loadModules');
    }
  }, [isOpen]);

  const loadModules = async () => {
    console.log('🔄 [CreateRoleModal] loadModules() called');
    
    try {
      setIsLoadingModules(true);
      setModuleLoadError(null);
      console.log('🔄 [CreateRoleModal] Starting to load modules...');
      
      const modulesData = await ModuleService.getActiveModules();
      console.log('✅ [CreateRoleModal] Received modules data:', modulesData);
      console.log('✅ [CreateRoleModal] Modules count:', modulesData.length);
      
      setModules(modulesData);
      console.log('✅ [CreateRoleModal] Modules state updated');
      
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
      console.log('✅ [CreateRoleModal] Permissions initialized:', initialPermissions);
      
      // Select first module by default if available
      if (modulesData.length > 0 && !selectedModuleId) {
        setSelectedModuleId(modulesData[0].id);
        console.log('✅ [CreateRoleModal] Selected first module:', modulesData[0].id);
      }
      
      // Show success message
      if (modulesData.length > 0) {
        console.log('🎉 [CreateRoleModal] Successfully loaded', modulesData.length, 'modules');
      } else {
        console.warn('⚠️ [CreateRoleModal] No modules loaded - this might be expected if none are configured');
        setModuleLoadError('Không tìm thấy modules nào. Hệ thống sẽ tạo vai trò với quyền cơ bản.');
      }
      
    } catch (error) {
      console.error('💥 [CreateRoleModal] Error in loadModules:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      setModuleLoadError(`Không thể tải danh sách modules: ${errorMessage}. Vai trò sẽ được tạo với quyền cơ bản.`);
      
    } finally {
      setIsLoadingModules(false);
      console.log('✅ [CreateRoleModal] loadModules() completed');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setCreateError(null);
      
      // For now, create role with basic info only (permissions will be empty array)
      const roleData: RoleCreationData = {
        name: data.name,
        description: data.description,
        permissions // This will be sent as empty array to match API
      };

      console.log('🔧 [CreateRoleModal] Submitting role data:', roleData);
      console.log('🔧 [CreateRoleModal] API will receive permissions as: []');
      
      const newRole = await RoleService.createRole(roleData);
      console.log('✅ [CreateRoleModal] Role created successfully:', newRole);
      
      onRoleCreated(newRole);
      handleClose();
      
      toast({
        title: "Thành công",
        description: `Tạo vai trò "${data.name}" thành công. Quyền chi tiết có thể được cập nhật sau.`,
        variant: "default"
      });
    } catch (error: any) {
      console.error('❌ [CreateRoleModal] Error creating role:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Không thể tạo vai trò";
      console.error('❌ [CreateRoleModal] Error message:', errorMessage);
      
      setCreateError(errorMessage);
      
      toast({
        title: "Lỗi",
        description: errorMessage,
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
    setCreateError(null);
    onClose();
  };

  const handlePermissionChange = (moduleId: string, permission: keyof typeof permissions[string], value: boolean) => {
    console.log('🔧 [CreateRoleModal] Permission change:', { moduleId, permission, value });
    
    setPermissions(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permission]: value
      }
    }));
  };

  const handleModuleSelect = (moduleId: string) => {
    console.log('🔧 [CreateRoleModal] Module selected:', moduleId);
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

  console.log('🎨 [CreateRoleModal] Rendering with:', {
    isOpen,
    modules: modules.length,
    isLoadingModules,
    moduleLoadError,
    createError,
    selectedModuleId,
    hasModules: modules.length > 0
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Tạo Vai Trò Mới</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 h-[600px]">
          {/* Left Column 70% - Form + Permission Detail */}
          <div className="flex-[7] space-y-6 overflow-y-auto pr-2">
            {/* API Info Alert */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Thông báo về API</div>
                  <div className="text-sm">
                    Vai trò sẽ được tạo với cấu trúc cơ bản theo API backend. 
                    Quyền chi tiết có thể được cập nhật trong phiên bản tương lai khi API hỗ trợ đầy đủ.
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Module Loading Error */}
            {moduleLoadError && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Thông báo về Modules</div>
                    <div className="text-sm">{moduleLoadError}</div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Role Creation Error */}
            {createError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="font-medium">Lỗi tạo vai trò</div>
                    <div className="text-sm">{createError}</div>
                    <div className="text-xs mt-2 opacity-75">
                      Kiểm tra console để xem chi tiết lỗi từ backend
                    </div>
                  </div>
                </AlertDescription>
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
                      {...register('name', { 
                        required: 'Tên vai trò là bắt buộc',
                        minLength: { value: 2, message: 'Tên vai trò phải có ít nhất 2 ký tự' }
                      })}
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
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div className="font-medium text-blue-800">Trạng thái API</div>
                  </div>
                  <div className="text-sm text-blue-700">
                    Vai trò sẽ được tạo với cấu trúc cơ bản. Quyền chi tiết sẽ được triển khai trong phiên bản tương lai.
                  </div>
                </div>
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

            {/* Permission Detail Area - For future use */}
            {modules.length > 0 && (
              <div className="border-t pt-6 opacity-50">
                <h3 className="text-lg font-medium mb-4">Chi Tiết Quyền (Sẽ có trong tương lai)</h3>
                <div className="min-h-[300px] bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Info className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">Tính năng đang phát triển</div>
                    <div className="text-sm">Quyền chi tiết sẽ có sẵn khi API backend hỗ trợ đầy đủ</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column 30% - Modules List */}
          <div className="flex-[3] border-l pl-6 overflow-y-auto">
            {isLoadingModules ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Đang tải modules...</div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium">Modules Hệ Thống</h3>
                {modules.length > 0 ? (
                  <SimpleModuleList
                    modules={modules}
                    permissions={permissions}
                    selectedModuleId={selectedModuleId}
                    onModuleSelect={handleModuleSelect}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Info className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-sm">Không có modules để hiển thị</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
