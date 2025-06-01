
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit, 
  Copy, 
  Calendar,
  User,
  Info
} from 'lucide-react';
import { ConditionTemplate, MOCK_VALUE_MAPPINGS, MOCK_GROUP_PRIORITIES } from '../types/conditionBuilder';

interface ConditionTemplateManagerProps {
  onApplyTemplate?: (template: ConditionTemplate) => void;
  onCreateTemplate?: (name: string, description: string) => void;
}

export function ConditionTemplateManager({ 
  onApplyTemplate,
  onCreateTemplate 
}: ConditionTemplateManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  // Mock templates with proper structure
  const [templates] = useState<ConditionTemplate[]>([
    {
      id: 'template-1',
      name: 'Template VIP Customer',
      description: 'Cấu hình cho khách hàng VIP với ưu tiên cao',
      conditionRows: [],
      valueMappings: MOCK_VALUE_MAPPINGS,
      groupPriorities: MOCK_GROUP_PRIORITIES,
      createdBy: 'Admin User',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'template-2',
      name: 'Template Standard Flow',
      description: 'Quy trình chuẩn cho khách hàng thường',
      conditionRows: [],
      valueMappings: MOCK_VALUE_MAPPINGS,
      groupPriorities: MOCK_GROUP_PRIORITIES,
      createdBy: 'Manager User',
      createdAt: '2024-01-14T15:20:00Z',
      updatedAt: '2024-01-14T15:20:00Z'
    },
    {
      id: 'template-3',
      name: 'Template Employee Priority',
      description: 'Ưu tiên theo nhân viên phụ trách',
      conditionRows: [],
      valueMappings: MOCK_VALUE_MAPPINGS,
      groupPriorities: MOCK_GROUP_PRIORITIES,
      createdBy: 'HR Team',
      createdAt: '2024-01-13T09:45:00Z',
      updatedAt: '2024-01-13T09:45:00Z'
    }
  ]);

  const handleCreateTemplate = () => {
    if (templateName.trim() && onCreateTemplate) {
      onCreateTemplate(templateName.trim(), templateDescription.trim());
      setTemplateName('');
      setTemplateDescription('');
      setShowCreateForm(false);
    }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Quản Lý Template Điều Kiện</span>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-1" />
            Tạo Template
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Template Form */}
        {showCreateForm && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3 mt-2">
                <div>
                  <Label htmlFor="template-name">Tên Template</Label>
                  <Input
                    id="template-name"
                    placeholder="Nhập tên template..."
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="template-description">Mô Tả (tùy chọn)</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Mô tả về template này..."
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleCreateTemplate} disabled={!templateName.trim()}>
                    Tạo Template
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setTemplateName('');
                      setTemplateDescription('');
                    }}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Templates List */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Templates Đã Lưu</h4>
          
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có template nào được tạo</p>
              <p className="text-sm">Tạo template đầu tiên để lưu cấu hình điều kiện</p>
            </div>
          ) : (
            <div className="grid gap-4">
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
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
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
                          variant="outline"
                          size="sm"
                          onClick={() => onApplyTemplate?.(template)}
                        >
                          Áp Dụng
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
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
  );
}
