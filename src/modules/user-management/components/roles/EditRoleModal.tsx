
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
  const { toast } = useToast();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (isOpen && role) {
      loadModules();
      // Set form values
      setValue('name', role.name);
      setValue('description', role.description);
    }
  }, [isOpen, role, setValue]);

  const loadModules = async () => {
    try {
      setIsLoadingModules(true);
      
      const modulesData = await ModuleService.getActiveModules();
      setModules(modulesData);
      
      // Auto-select first module
      if (modulesData.length > 0) {
        setSelectedModuleId(modulesData[0].id);
      }
      
      // Initialize permission selections based on existing role permissions
      const initialSelections: PermissionSelection = {};
      modulesData.forEach(module => {
        initialSelections[module.id] = {};
        module.features.forEach(feature => {
          // Check if this feature permission exists in role's permissions
          initialSelections[module.id][feature.id] = role?.permissions.includes(feature.id) || false;
        });
      });
      setPermissionSelections(initialSelections);
      
    } catch (error) {
      console.error('Error loading modules:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách modules",
        variant: "destructive"
      });
    } finally {
      setIsLoadingModules(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!role) return;

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

      const roleData: Partial<RoleCreationData> = {
        name: data.name,
        description: data.description,
        permissions
      };
      
      const updatedRole = await RoleService.updateRole(role.id, roleData);
      
      onRoleUpdated(updatedRole);
      
      toast({
        title: "Thành công",
        description: `Cập nhật vai trò "${data.name}" thành công.`,
        variant: "default"
      });
      
      handleClose();
      
    } catch (error: any) {
      console.error('Error updating role:', error);
      
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
    onClose();
  };

  const handlePermissionChange = (moduleId: string, featureId: number, selected: boolean) => {
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

  if (!role) return null;

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
              disabled={isLoading || isLoadingModules || role.isSystem}
            >
              {isLoading ? 'Đang cập nhật...' : 'Cập Nhật Vai Trò'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
