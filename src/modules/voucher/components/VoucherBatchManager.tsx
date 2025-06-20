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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Play,
  Eye,
  Save,
  Settings
} from 'lucide-react';
import { ConditionTemplate, MOCK_VALUE_MAPPINGS, MOCK_GROUP_PRIORITIES } from '../types/conditionBuilder';
import { VoucherBatchSelector } from './VoucherBatchSelector';
import { CollapsibleMappingSection } from './CollapsibleMappingSection';
import { toast } from '@/hooks/use-toast';

interface VoucherBatchManagerProps {
  onApplyTemplate?: (template: ConditionTemplate) => void;
  onCreateTemplate?: (name: string, description: string) => void;
}

type CodeGenerationMethod = 'manual' | 'mapping' | 'hybrid';

export function VoucherBatchManager({ 
  onApplyTemplate,
  onCreateTemplate 
}: VoucherBatchManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ConditionTemplate | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string>('');
  
  // Template basic info
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  
  // Voucher code configuration state
  const [selectedBatch, setSelectedBatch] = useState('');
  const [generationMethod, setGenerationMethod] = useState<CodeGenerationMethod>('manual');
  const [codeLength, setCodeLength] = useState(8);
  const [manualPrefix, setManualPrefix] = useState('');
  const [manualSuffix, setManualSuffix] = useState('');
  const [autoIssue, setAutoIssue] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Empty templates array - no mock data
  const [templates, setTemplates] = useState<ConditionTemplate[]>([]);

  const generateCodePreview = () => {
    let prefix = '';
    let suffix = manualSuffix;
    
    if (generationMethod === 'manual') {
      prefix = manualPrefix;
    } else if (generationMethod === 'mapping') {
      const activePriorities = MOCK_GROUP_PRIORITIES.filter(p => p.active).sort((a, b) => a.priority - b.priority);
      const prefixParts: string[] = [];
      
      activePriorities.forEach(priority => {
        const mapping = MOCK_VALUE_MAPPINGS.find(m => 
          m.conditionType === priority.type && m.active
        );
        if (mapping) {
          prefixParts.push(mapping.code);
        }
      });
      
      prefix = prefixParts.join('');
    } else if (generationMethod === 'hybrid') {
      const activePriorities = MOCK_GROUP_PRIORITIES.filter(p => p.active).sort((a, b) => a.priority - b.priority);
      const mappingParts: string[] = [];
      
      activePriorities.forEach(priority => {
        const mapping = MOCK_VALUE_MAPPINGS.find(m => 
          m.conditionType === priority.type && m.active
        );
        if (mapping) {
          mappingParts.push(mapping.code);
        }
      });
      
      prefix = manualPrefix + mappingParts.join('');
    }
    
    const remainingLength = Math.max(1, codeLength - prefix.length - suffix.length);
    const randomPart = 'X'.repeat(remainingLength);
    
    return `${prefix}${randomPart}${suffix}`;
  };

  const resetTemplateForm = () => {
    setTemplateName('');
    setTemplateDescription('');
    setSelectedBatch('');
    setGenerationMethod('manual');
    setCodeLength(8);
    setManualPrefix('');
    setManualSuffix('');
    setAutoIssue(false);
    setShowPreview(true);
  };

  const handleCreateTemplate = () => {
    if (templateName.trim() && selectedBatch) {
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
      resetTemplateForm();
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

  const isFormValid = () => {
    if (!templateName.trim() || !selectedBatch || codeLength < 4) return false;
    
    if (generationMethod === 'manual') {
      return manualPrefix.length > 0;
    } else if (generationMethod === 'mapping') {
      return MOCK_VALUE_MAPPINGS.some(m => m.active) && MOCK_GROUP_PRIORITIES.some(p => p.active);
    } else if (generationMethod === 'hybrid') {
      return manualPrefix.length > 0 && MOCK_VALUE_MAPPINGS.some(m => m.active) && MOCK_GROUP_PRIORITIES.some(p => p.active);
    }
    
    return false;
  };

  const renderVoucherCodeConfiguration = () => (
    <div className="space-y-6">
      {/* Bước 1: Chọn Đợt Phát Hành */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Bước 1
          </Badge>
          <h3 className="font-medium">Chọn Đợt Phát Hành</h3>
        </div>
        <VoucherBatchSelector
          selectedBatch={selectedBatch}
          onBatchChange={setSelectedBatch}
        />
      </div>

      {/* Tự động phát hành */}
      {selectedBatch && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-issue" className="font-medium">Tự động phát hành voucher khi khởi tạo</Label>
              <p className="text-sm text-gray-600 mt-1">
                Tự động phát hành voucher ngay khi tạo mới, không cần duyệt thủ công.
              </p>
            </div>
            <Switch 
              id="auto-issue" 
              checked={autoIssue}
              onCheckedChange={setAutoIssue}
            />
          </div>
        </div>
      )}

      {/* Bước 2: Chọn Phương Thức Tạo Mã */}
      {selectedBatch && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Bước 2
            </Badge>
            <h3 className="font-medium">Cách Tạo Mã Voucher</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                value: 'manual' as const,
                title: 'Thủ Công',
                description: 'Nhập ký tự đầu và cuối thủ công'
              },
              {
                value: 'mapping' as const,
                title: 'Theo Mapping',
                description: 'Sử dụng quy tắc mapping điều kiện'
              },
              {
                value: 'hybrid' as const,
                title: 'Kết Hợp',
                description: 'Kết hợp cả thủ công và mapping'
              }
            ].map((method) => (
              <Card 
                key={method.value}
                className={`cursor-pointer transition-all ${
                  generationMethod === method.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setGenerationMethod(method.value)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      generationMethod === method.value 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {generationMethod === method.value && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <h4 className="font-medium text-sm">{method.title}</h4>
                  </div>
                  <p className="text-xs text-gray-600">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bước 3: Cấu Hình Chi Tiết */}
      {selectedBatch && generationMethod && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Bước 3
            </Badge>
            <h3 className="font-medium">Cấu Hình Chi Tiết</h3>
          </div>

          {/* Độ dài mã */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="code-length">Độ dài mã voucher</Label>
              <Input
                id="code-length"
                type="number"
                min="4"
                max="20"
                value={codeLength}
                onChange={(e) => setCodeLength(Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Từ 4-20 ký tự</p>
            </div>
          </div>

          {/* Cấu hình thủ công */}
          {(generationMethod === 'manual' || generationMethod === 'hybrid') && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="pb-3">
                <h4 className="font-medium text-orange-800 text-sm">Cấu Hình Thủ Công</h4>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="manual-prefix">Ký tự đầu (Prefix)</Label>
                    <Input
                      id="manual-prefix"
                      value={manualPrefix}
                      onChange={(e) => setManualPrefix(e.target.value.toUpperCase())}
                      placeholder="VD: VCH, GIFT"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manual-suffix">Ký tự cuối (Suffix)</Label>
                    <Input
                      id="manual-suffix"
                      value={manualSuffix}
                      onChange={(e) => setManualSuffix(e.target.value.toUpperCase())}
                      placeholder="VD: X, END"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cấu hình mapping */}
          {(generationMethod === 'mapping' || generationMethod === 'hybrid') && (
            <div className="space-y-3">
              <CollapsibleMappingSection
                valueMappings={MOCK_VALUE_MAPPINGS}
                groupPriorities={MOCK_GROUP_PRIORITIES}
                codeLength={codeLength}
              />
            </div>
          )}
        </div>
      )}

      {/* Xem trước */}
      {showPreview && selectedBatch && generationMethod && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-green-800">Xem Trước Mã Voucher</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showPreview ? 'Ẩn' : 'Hiện'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Đợt phát hành:</span>
                  <Badge variant="secondary" className="ml-2">{selectedBatch}</Badge>
                </div>
                <div>
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="ml-2 font-medium">
                    {generationMethod === 'manual' && 'Thủ công'}
                    {generationMethod === 'mapping' && 'Theo Mapping'}
                    {generationMethod === 'hybrid' && 'Kết hợp'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Mã voucher mẫu:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded font-mono text-green-600 font-bold">
                    {generateCodePreview()}
                  </code>
                </div>
                <div>
                  <span className="text-gray-600">Tự động phát hành:</span>
                  <span className="ml-2 font-medium">
                    {autoIssue ? 'Có' : 'Không'}
                  </span>
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Form Validation Notice */}
      {!isFormValid() && selectedBatch && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Info className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="text-sm">
              <div className="font-medium mb-1">Vui lòng hoàn thành các thông tin bắt buộc:</div>
              <ul className="list-disc list-inside space-y-1">
                {!templateName.trim() && <li>Nhập tên template</li>}
                {!selectedBatch && <li>Chọn mã đợt phát hành</li>}
                {codeLength < 4 && <li>Độ dài mã tối thiểu 4 ký tự</li>}
                {generationMethod === 'manual' && !manualPrefix && <li>Nhập ký tự đầu (prefix)</li>}
                {(generationMethod === 'mapping' || generationMethod === 'hybrid') && !MOCK_VALUE_MAPPINGS.some(m => m.active) && <li>Thiết lập ít nhất 1 mapping hoạt động</li>}
                {(generationMethod === 'mapping' || generationMethod === 'hybrid') && !MOCK_GROUP_PRIORITIES.some(p => p.active) && <li>Kích hoạt ít nhất 1 nhóm ưu tiên</li>}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Quản Lý Template Điều Kiện</span>
            </div>
            <Button onClick={() => {
              resetTemplateForm();
              setIsCreateModalOpen(true);
            }} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Tạo mới
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
                <p className="text-sm">Chưa có đợt phát hành nào được tạo</p>
                <p className="text-xs">Tạo đợt phát hành đầu tiên để lưu cấu hình điều kiện</p>
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
                  <li>Tạo template để lưu cấu hình điều kiện và mã voucher</li>
                  <li>Áp dụng template để nhanh chóng thiết lập cấu hình tương tự</li>
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Tạo Template Mới</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Thông Tin Template</h3>
              <div className="grid grid-cols-1 gap-4">
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
            </div>

            {/* Voucher Code Configuration */}
            {renderVoucherCodeConfiguration()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!isFormValid()}>
              <Save className="w-4 h-4 mr-2" />
              Tạo Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Chỉnh Sửa Template</span>
            </DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">Thông Tin Template</h3>
                <div className="grid grid-cols-1 gap-4">
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
              </div>

              {/* Voucher Code Configuration */}
              {renderVoucherCodeConfiguration()}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditTemplate}>
              <Save className="w-4 h-4 mr-2" />
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
