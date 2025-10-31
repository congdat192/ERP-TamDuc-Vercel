
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { RoleCreationData, CustomRole, ModuleInfo, PermissionSelection } from '../../types/role-management';
import { RoleService } from '../../services/roleService';
import { ModuleService } from '../../services/moduleService';
import { PermissionMatrixV2 } from './PermissionMatrixV2';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [permissionSelections, setPermissionSelections] = useState<PermissionSelection>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    console.log('🎯 [CreateRoleModal] useEffect triggered, isOpen:', isOpen);
    
    if (isOpen) {
      console.log('🎯 [CreateRoleModal] Modal is open, calling loadModules');
      setError('');
      loadModules();
    }
  }, [isOpen]);

  const loadModules = async () => {
    console.log('🔄 [CreateRoleModal] loadModules() called');
    
    try {
      setIsLoadingModules(true);
      setError('');
      console.log('🔄 [CreateRoleModal] Starting to load modules...');
      
      const modulesData = await ModuleService.getActiveModules();
      console.log('✅ [CreateRoleModal] Received modules data:', modulesData);
      console.log('✅ [CreateRoleModal] Modules count:', modulesData.length);
      
      setModules(modulesData);
      console.log('✅ [CreateRoleModal] Modules state updated');
      
      // Auto-select first module
      if (modulesData.length > 0) {
        setSelectedModuleId(modulesData[0].id);
      }
      
      // Initialize permission selections - track by feature codes
      const initialSelections: PermissionSelection = {};
      modulesData.forEach(module => {
        initialSelections[module.id] = {};
        module.features.forEach(feature => {
          initialSelections[module.id][feature.code] = false;
        });
      });
      setPermissionSelections(initialSelections);
      console.log('✅ [CreateRoleModal] Permission selections initialized:', initialSelections);
      
    } catch (error) {
      console.error('💥 [CreateRoleModal] Error in loadModules:', error);
      const errorMessage = error instanceof Error ? error.message : "Không thể tải danh sách modules";
      setError(errorMessage);
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoadingModules(false);
      console.log('✅ [CreateRoleModal] loadModules() completed');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Validate form data
      if (!data.name.trim()) {
        setError('Tên vai trò không được để trống');
        return;
      }
      
      if (data.name.trim().length < 2) {
        setError('Tên vai trò phải có ít nhất 2 ký tự');
        return;
      }
      
      // Build permissions array từ selections - sử dụng feature codes
      const permissions: string[] = [];
      Object.values(permissionSelections).forEach(moduleSelections => {
        Object.entries(moduleSelections).forEach(([featureCode, selected]) => {
          if (selected) {
            permissions.push(featureCode);
          }
        });
      });

      if (permissions.length === 0) {
        setError('Vui lòng chọn ít nhất một quyền cho vai trò');
        return;
      }

      const roleData: RoleCreationData = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        permissions // Array of permission codes
      };

      console.log('🔧 [CreateRoleModal] Submitting role data:', roleData);
      console.log('🔧 [CreateRoleModal] Selected permissions:', permissions);
      
      const newRole = await RoleService.createRole(roleData);
      console.log('✅ [CreateRoleModal] Role created successfully:', newRole);
      
      // Call callback TRƯỚC khi đóng modal
      onRoleCreated(newRole);
      
      // Show success toast
      toast({
        title: "Thành công",
        description: `Tạo vai trò "${data.name}" thành công với ${permissions.length} quyền được cấp.`,
        variant: "default"
      });
      
      // Close modal và reset form
      handleClose();
      
    } catch (error: any) {
      console.error('❌ [CreateRoleModal] Error creating role:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Không thể tạo vai trò";
      console.error('❌ [CreateRoleModal] Error message:', errorMessage);
      
      setError(errorMessage);
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
    setPermissionSelections({});
    setSelectedModuleId(null);
    setError('');
    onClose();
  };

  const handlePermissionChange = (moduleId: string, featureCode: string, selected: boolean) => {
    console.log('🔧 [CreateRoleModal] Permission change:', { moduleId, featureCode, selected });
    
    setPermissionSelections(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [featureCode]: selected
      }
    }));
  };

  const getSelectedPermissionsCount = () => {
    let count = 0;
    Object.values(permissionSelections).forEach(moduleSelections => {
      count += Object.values(moduleSelections).filter(Boolean).length;
    });
    return count;
  };

  const selectedModule = modules.find(m => m.id === selectedModuleId) || null;

  console.log('🎨 [CreateRoleModal] Rendering with:', {
    isOpen,
    modules: modules.length,
    isLoadingModules,
    hasModules: modules.length > 0,
    selectedPermissions: getSelectedPermissionsCount(),
    selectedModuleId,
    error
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Tạo Vai Trò Mới</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="flex-shrink-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          {/* Basic Information */}
          <div className="flex-shrink-0 space-y-4 pb-4 border-b">
            <h3 className="text-lg font-medium">Thông Tin Cơ Bản</h3>
            
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

          {/* Permission Selection - Sidebar Layout with scrolling */}
          <div className="flex-1 flex border rounded-lg overflow-hidden min-h-0 my-4">
            {isLoadingModules ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500">Đang tải modules...</div>
              </div>
            ) : modules.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500">Không có modules nào được tìm thấy</div>
              </div>
            ) : (
              <PermissionMatrixV2
                modules={modules}
                selections={permissionSelections}
                onSelectionChange={handlePermissionChange}
              />
            )}
          </div>

          {/* Summary */}
          <div className="flex-shrink-0 bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-700">
              <div className="font-medium">Tổng quan:</div>
              <div>Đã chọn {getSelectedPermissionsCount()} quyền từ {modules.length} modules</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center justify-end space-x-3 pt-4 border-t mt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isLoadingModules || modules.length === 0}
            >
              {isLoading ? 'Đang tạo...' : 'Tạo Vai Trò'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
