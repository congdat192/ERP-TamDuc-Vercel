
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { RoleCreationData, CustomRole, ModuleInfo, PermissionSelection } from '../../types/role-management';
import { RoleService } from '../../services/roleService';
import { ModuleService } from '../../services/moduleService';
import { CreateRoleModuleSidebar } from './CreateRoleModuleSidebar';
import { CreateRolePermissionDetail } from './CreateRolePermissionDetail';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: CustomRole | null;
  onRoleUpdated: (role: CustomRole) => void;
}

interface FormData {
  name: string;
  description: string;
}

export function EditRoleModal({ isOpen, onClose, role, onRoleUpdated }: EditRoleModalProps) {
  const [modules, setModules] = useState<ModuleInfo[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [permissionSelections, setPermissionSelections] = useState<PermissionSelection>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();

  // Memoize the initialization function để prevent unnecessary re-runs
  const initializePermissions = useCallback((modulesData: ModuleInfo[], roleData: CustomRole) => {
    console.log('🔧 [EditRoleModal] Initializing permissions for role:', roleData.name);
    console.log('🔧 [EditRoleModal] Role permissions (IDs):', roleData.permissions);
    console.log('🔧 [EditRoleModal] Available modules:', modulesData.map(m => ({ id: m.id, name: m.name })));
    
    const initialSelections: PermissionSelection = {};
    modulesData.forEach(module => {
      initialSelections[module.id] = {};
      module.features.forEach(feature => {
        // Check if this feature permission exists in role's permissions (array of IDs)
        const isSelected = Array.isArray(roleData.permissions) && roleData.permissions.includes(feature.id);
        initialSelections[module.id][feature.id] = isSelected;
        
        if (isSelected) {
          console.log(`✅ [EditRoleModal] Feature ${feature.id} (${feature.name}) is selected for module ${module.name}`);
        }
      });
    });
    
    console.log('🔧 [EditRoleModal] Initial permission selections:', initialSelections);
    setPermissionSelections(initialSelections);
    setIsInitialized(true);
  }, []);

  // Load modules only once when modal opens
  const loadModules = useCallback(async () => {
    try {
      setIsLoadingModules(true);
      console.log('🔄 [EditRoleModal] Loading modules...');
      
      const modulesData = await ModuleService.getActiveModules();
      console.log('✅ [EditRoleModal] Modules loaded:', modulesData);
      setModules(modulesData);
      
      // Auto-select first module
      if (modulesData.length > 0) {
        setSelectedModuleId(modulesData[0].id);
      }
      
      return modulesData;
    } catch (error) {
      console.error('❌ [EditRoleModal] Error loading modules:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách modules",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoadingModules(false);
    }
  }, [toast]);

  // Main effect - chỉ chạy khi modal mở và có role
  useEffect(() => {
    console.log('🎯 [EditRoleModal] Main useEffect triggered, isOpen:', isOpen, 'role:', role?.name);
    
    if (isOpen && role) {
      // Reset state
      setIsInitialized(false);
      setPermissionSelections({});
      
      // Set form values
      setValue('name', role.name);
      setValue('description', role.description);
      
      // Load modules and initialize permissions
      loadModules().then((modulesData) => {
        if (modulesData.length > 0) {
          initializePermissions(modulesData, role);
        }
      });
    } else if (!isOpen) {
      // Reset khi modal đóng
      setIsInitialized(false);
      setPermissionSelections({});
      setSelectedModuleId(null);
      setModules([]);
    }
  }, [isOpen, role, setValue, loadModules, initializePermissions]);

  const onSubmit = async (data: FormData) => {
    if (!role) return;

    try {
      setIsLoading(true);
      
      // Validate permissions before submit
      const hasPermissions = Object.values(permissionSelections).some(moduleSelections =>
        Object.values(moduleSelections).some(selected => selected)
      );
      
      if (!hasPermissions) {
        toast({
          title: "Cảnh báo",
          description: "Vui lòng chọn ít nhất một quyền cho vai trò",
          variant: "destructive"
        });
        return;
      }
      
      // Build permissions array từ selections
      const permissions: number[] = [];
      Object.values(permissionSelections).forEach(moduleSelections => {
        Object.entries(moduleSelections).forEach(([featureId, selected]) => {
          if (selected) {
            permissions.push(parseInt(featureId));
          }
        });
      });

      console.log('🔧 [EditRoleModal] Submitting update with permissions:', permissions);
      console.log('🔧 [EditRoleModal] Permission selections state:', permissionSelections);
      console.log('🔧 [EditRoleModal] Form data:', data);

      const roleData: Partial<RoleCreationData> = {
        name: data.name,
        description: data.description,
        permissions
      };
      
      console.log('🔧 [EditRoleModal] Final payload for update:', roleData);
      
      const updatedRole = await RoleService.updateRole(role.id, roleData);
      console.log('✅ [EditRoleModal] Role updated successfully:', updatedRole);
      
      onRoleUpdated(updatedRole);
      
      toast({
        title: "Thành công",
        description: `Cập nhật vai trò "${data.name}" thành công.`,
        variant: "default"
      });
      
      handleClose();
      
    } catch (error: any) {
      console.error('❌ [EditRoleModal] Error updating role:', error);
      
      const errorMessage = error instanceof Error ? error.message : "Không thể cập nhật vai trò";
      
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
    setIsInitialized(false);
    onClose();
  };

  const handlePermissionChange = (moduleId: string, featureId: number, selected: boolean) => {
    console.log('🔧 [EditRoleModal] Permission change:', { moduleId, featureId, selected });
    
    setPermissionSelections(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [featureId]: selected
      }
    }));
  };

  // FIX: Safe module selection handler với preventDefault để tránh form submit
  const handleModuleSelect = (moduleId: string) => {
    console.log('🔄 [EditRoleModal] Module selected:', moduleId);
    setSelectedModuleId(moduleId);
    // KHÔNG reset permissionSelections ở đây
  };

  const getSelectedPermissionsCount = () => {
    let count = 0;
    Object.values(permissionSelections).forEach(moduleSelections => {
      count += Object.values(moduleSelections).filter(Boolean).length;
    });
    return count;
  };

  const selectedModule = modules.find(m => m.id === selectedModuleId) || null;

  if (!role) return null;

  console.log('🎨 [EditRoleModal] Rendering with:', {
    role: role.name,
    modules: modules.length,
    selectedPermissions: getSelectedPermissionsCount(),
    isLoadingModules,
    isInitialized,
    selectedModuleId
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Chỉnh Sửa Vai Trò: {role.name}</DialogTitle>
        </DialogHeader>

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
                  disabled={role.isSystem}
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
                  disabled={role.isSystem}
                />
              </div>
            </div>

            {role.isSystem && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  Vai trò hệ thống không thể chỉnh sửa để đảm bảo tính bảo mật.
                </p>
              </div>
            )}
          </div>

          {/* Permission Selection - Sidebar Layout with scrolling */}
          <div className="flex-1 flex border rounded-lg overflow-hidden min-h-0 my-4">
            {isLoadingModules ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500">Đang tải modules...</div>
              </div>
            ) : !isInitialized ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500">Đang khởi tạo permissions...</div>
              </div>
            ) : (
              <>
                <CreateRoleModuleSidebar
                  modules={modules}
                  selectedModuleId={selectedModuleId}
                  onModuleSelect={handleModuleSelect}
                  permissionSelections={permissionSelections}
                />
                <CreateRolePermissionDetail
                  selectedModule={selectedModule}
                  permissionSelections={permissionSelections}
                  onPermissionChange={handlePermissionChange}
                  disabled={role.isSystem}
                />
              </>
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
              disabled={isLoading || isLoadingModules || role.isSystem || !isInitialized}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập Nhật Vai Trò'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
