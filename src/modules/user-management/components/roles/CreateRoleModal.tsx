
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
import { CreateRoleModuleSidebar } from './CreateRoleModuleSidebar';
import { CreateRolePermissionDetail } from './CreateRolePermissionDetail';

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
  const { toast } = useToast();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    console.log('🎯 [CreateRoleModal] useEffect triggered, isOpen:', isOpen);
    
    if (isOpen) {
      console.log('🎯 [CreateRoleModal] Modal is open, calling loadModules');
      loadModules();
    }
  }, [isOpen]);

  const loadModules = async () => {
    console.log('🔄 [CreateRoleModal] loadModules() called');
    
    try {
      setIsLoadingModules(true);
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
      
      // Initialize permission selections
      const initialSelections: PermissionSelection = {};
      modulesData.forEach(module => {
        initialSelections[module.id] = {};
        module.features.forEach(feature => {
          initialSelections[module.id][feature.id] = false;
        });
      });
      setPermissionSelections(initialSelections);
      console.log('✅ [CreateRoleModal] Permission selections initialized:', initialSelections);
      
    } catch (error) {
      console.error('💥 [CreateRoleModal] Error in loadModules:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách modules",
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
      
      // Build permissions array từ selections
      const permissions: number[] = [];
      Object.values(permissionSelections).forEach(moduleSelections => {
        Object.entries(moduleSelections).forEach(([featureId, selected]) => {
          if (selected) {
            permissions.push(parseInt(featureId));
          }
        });
      });

      const roleData: RoleCreationData = {
        name: data.name,
        description: data.description,
        permissions
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
    onClose();
  };

  const handlePermissionChange = (moduleId: string, featureId: number, selected: boolean) => {
    console.log('🔧 [CreateRoleModal] Permission change:', { moduleId, featureId, selected });
    
    setPermissionSelections(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [featureId]: selected
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
    selectedModuleId
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Tạo Vai Trò Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 h-[700px] flex flex-col">
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

          {/* Permission Selection - Sidebar Layout */}
          <div className="flex-1 flex border rounded-lg overflow-hidden">
            {isLoadingModules ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500">Đang tải modules...</div>
              </div>
            ) : (
              <>
                <CreateRoleModuleSidebar
                  modules={modules}
                  selectedModuleId={selectedModuleId}
                  onModuleSelect={setSelectedModuleId}
                  permissionSelections={permissionSelections}
                />
                <CreateRolePermissionDetail
                  selectedModule={selectedModule}
                  permissionSelections={permissionSelections}
                  onPermissionChange={handlePermissionChange}
                />
              </>
            )}
          </div>

          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-700">
              <div className="font-medium">Tổng quan:</div>
              <div>Đã chọn {getSelectedPermissionsCount()} quyền từ {modules.length} modules</div>
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
            <Button type="submit" disabled={isLoading || isLoadingModules}>
              {isLoading ? 'Đang tạo...' : 'Tạo Vai Trò'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
