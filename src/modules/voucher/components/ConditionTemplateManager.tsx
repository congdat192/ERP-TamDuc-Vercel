
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Calendar,
  User,
  Info,
  CheckCircle,
  Play
} from 'lucide-react';
import { ConditionTemplate, MOCK_VALUE_MAPPINGS, MOCK_GROUP_PRIORITIES } from '../types/conditionBuilder';
import { VoucherConditionBuilder } from './VoucherConditionBuilder';
import { CollapsibleMappingSection } from './CollapsibleMappingSection';
import { toast } from '@/hooks/use-toast';

interface ConditionTemplateManagerProps {
  onApplyTemplate?: (template: ConditionTemplate) => void;
  onCreateTemplate?: (name: string, description: string) => void;
}

export function ConditionTemplateManager({ 
  onApplyTemplate,
  onCreateTemplate 
}: ConditionTemplateManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ConditionTemplate | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string>('');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [codeLength, setCodeLength] = useState(8);

  // Mock templates with proper structure
  const [templates, setTemplates] = useState<ConditionTemplate[]>([
    {
      id: 'template-1',
      name: 'Template Khách Hàng VIP',
      description: 'Cấu hình cho khách hàng VIP với ưu tiên cao',
      conditionRows: [],
      valueMappings: MOCK_VALUE_MAPPINGS,
      groupPriorities: MOCK_GROUP_PRIORITIES,
      createdBy: 'Quản trị viên',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'template-2',
      name: 'Template Quy Trình Chuẩn',
      description: 'Quy trình chuẩn cho khách hàng thường',
      conditionRows: [],
      valueMappings: MOCK_VALUE_MAPPINGS,
      groupPriorities: MOCK_GROUP_PRIORITIES,
      createdBy: 'Người quản lý',
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-14T15:20:00Z'
    },
    {
      id: 'template-3',
      name: 'Template Ưu Tiên Nhân Viên',
      description: 'Ưu tiên theo nhân viên phụ trách',
      conditionRows: [],
      valueMappings: MOCK_VALUE_MAPPINGS,
      groupPriorities: MOCK_GROUP_PRIORITIES,
      createdBy: 'Nhóm HR',
      createdAt: '2024-01-13T09:45:00Z',
      updatedAt: '2024-01-13T09:45:00Z'
    }
  ]);

  const handleCreateTemplate = () => {
    if (templateName.trim()) {
      const newTemplate: ConditionTemplate = {
        id: `template-${Date.now()}`,
        name: templateName.trim(),
        description: templateDescription.trim(),
        conditionRows: [],
        valueMappings: MOCK_VALUE_MAPPINGS,
        groupPriorities: MOCK_GROUP_PRIORITIES,
        createdBy: 'Người dùng hiện tại',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTemplates([...templates, newTemplate]);
      setTemplateName('');
      setTemplateDescription('');
      setIsCreateModalOpen(false);
      
      toast({
        title: "Tạo thành công",
        description: `Template "${templateName}" đã được tạo thành công.`
      });

      if (onCreateTemplate) {
        onCreateTemplate(templateName.trim(), templateDescription.trim());
      }
    }
  };

  const handleEditTemplate = () => {
    if (editingTemplate && editingTemplate.name.trim()) {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...editingTemplate, updatedAt: new Date().toISOString() }
          : t
      ));
      setIsEditModalOpen(false);
      setEditingTemplate(null);
      
      toast({
        title: "Cập nhật thành công",
        description: `Template "${editingTemplate.name}" đã được cập nhật.`
      });
    }
  };

  const handleApplyTemplate = (template: ConditionTemplate) => {
    toast({
      title: "Áp dụng template",
      description: `Template "${template.name}" đã được áp dụng thành công.`,
      duration: 3000
    });

    if (onApplyTemplate) {
      onApplyTemplate(template);
    }
  };

  const handleDuplicateTemplate = (template: ConditionTemplate) => {
    const duplicatedTemplate: ConditionTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Bản sao)`,
      createdBy: 'Người dùng hiện tại',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTemplates([...templates, duplicatedTemplate]);
    
    toast({
      title: "Sao chép thành công",
      description: `Template "${template.name}" đã được sao chép.`
    });
  };

  const handleDeleteTemplate = () => {
    const templateToDelete = templates.find(t => t.id === deleteTemplateId);
    setTemplates(templates.filter(t => t.id !== deleteTemplateId));
    setIsDeleteDialogOpen(false);
    setDeleteTemplateId('');
    
    toast({
      title: "Xóa thành công",
      description: `Template "${templateToDelete?.name}" đã được xóa.`
    });
  };

  const openEditModal = (template: ConditionTemplate) => {
    setEditingTemplate({ ...template });
    setIsEditModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Quản Lý Template Điều Kiện</span>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Tạo Template
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Templates List */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Template Đã Lưu</h4>
            
            {templates.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Chưa có template nào được tạo</p>
                <p className="text-xs">Tạo template đầu tiên để lưu cấu hình điều kiện</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {templates.map((template) => (
                  <Card key={template.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h5 className="font-medium text-gray-900">{template.name}</h5>
                            <Badge variant="secondary" className="text-xs">
                              Template
                            </Badge>
                          </div>
                          
                          {template.description && (
                            <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{template.createdBy}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(template.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1 ml-4">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApplyTemplate(template)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Áp Dụng
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditModal(template)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDuplicateTemplate(template)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setDeleteTemplateId(template.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Template Usage Instructions */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="text-sm">
                <div className="font-medium text-gray-900 mb-1">Hướng Dẫn Sử Dụng Template</div>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Tạo template để lưu cấu hình điều kiện phức tạp</li>
                  <li>Áp dụng template để nhanh chóng thiết lập điều kiện tương tự</li>
                  <li>Sửa và nhân bản template để tạo biến thể mới</li>
                  <li>Template bao gồm: điều kiện, mapping giá trị, và thứ tự ưu tiên</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Create Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo Template Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Tên Template *</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Nhập tên template..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="template-description">Mô Tả</Label>
                <Textarea
                  id="template-description"
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="Mô tả về template này..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>

            {/* Condition Builder */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Cấu Hình Điều Kiện</h4>
              <VoucherConditionBuilder
                codeLength={codeLength}
                onCodeLengthChange={setCodeLength}
                onConditionsChange={() => {}}
              />
            </div>

            {/* Mapping Section */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Mapping Điều Kiện</h4>
              <CollapsibleMappingSection
                valueMappings={MOCK_VALUE_MAPPINGS}
                groupPriorities={MOCK_GROUP_PRIORITIES}
                codeLength={codeLength}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!templateName.trim()}>
              Tạo Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Template</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-template-name">Tên Template *</Label>
                  <Input
                    id="edit-template-name"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    placeholder="Nhập tên template..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-template-description">Mô Tả</Label>
                  <Textarea
                    id="edit-template-description"
                    value={editingTemplate.description}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                    placeholder="Mô tả về template này..."
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>

              {/* Condition Builder */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Cấu Hình Điều Kiện</h4>
                <VoucherConditionBuilder
                  codeLength={codeLength}
                  onCodeLengthChange={setCodeLength}
                  onConditionsChange={() => {}}
                />
              </div>

              {/* Mapping Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Mapping Điều Kiện</h4>
                <CollapsibleMappingSection
                  valueMappings={editingTemplate.valueMappings}
                  groupPriorities={editingTemplate.groupPriorities}
                  codeLength={codeLength}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditTemplate}>
              Lưu Thay Đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa template này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTemplate} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
