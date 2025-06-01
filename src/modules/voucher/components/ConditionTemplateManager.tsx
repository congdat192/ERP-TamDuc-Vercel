
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  Play, 
  Edit, 
  Copy, 
  Trash2,
  Plus,
  Clock,
  User
} from 'lucide-react';
import { ConditionTemplate, ConditionRow } from '../types/conditionBuilder';
import { format } from 'date-fns';

interface ConditionTemplateManagerProps {
  onApplyTemplate?: (template: ConditionTemplate) => void;
  onCreateTemplate?: (name: string, description: string) => void;
}

export function ConditionTemplateManager({ 
  onApplyTemplate, 
  onCreateTemplate 
}: ConditionTemplateManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');

  // Mock templates data
  const [templates] = useState<ConditionTemplate[]>([
    {
      id: '1',
      name: 'VIP Customer Template',
      description: 'Template dành cho khách hàng VIP với mã ưu tiên',
      conditionRows: [],
      createdBy: 'John Doe',
      createdAt: '2025-06-02T10:30:00Z',
      updatedAt: '2025-06-02T10:30:00Z'
    },
    {
      id: '2', 
      name: 'Telesale Campaign Template',
      description: 'Template cho chiến dịch telesale',
      conditionRows: [],
      createdBy: 'Jane Doe',
      createdAt: '2025-06-01T14:20:00Z',
      updatedAt: '2025-06-01T14:20:00Z'
    },
    {
      id: '3',
      name: 'Website Customer Template',
      description: 'Template cho khách hàng đăng ký từ website',
      conditionRows: [],
      createdBy: 'Admin User',
      createdAt: '2025-05-30T09:15:00Z',
      updatedAt: '2025-05-30T09:15:00Z'
    }
  ]);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyTemplate = (template: ConditionTemplate) => {
    setSelectedTemplate(template.id);
    onApplyTemplate?.(template);
  };

  const handleCreateTemplate = () => {
    if (newTemplateName.trim()) {
      onCreateTemplate?.(newTemplateName.trim(), newTemplateDescription.trim());
      setNewTemplateName('');
      setNewTemplateDescription('');
      setShowCreateDialog(false);
    }
  };

  const handleDuplicateTemplate = (template: ConditionTemplate) => {
    const duplicatedTemplate = {
      ...template,
      id: `${template.id}_copy_${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    // In a real app, this would save to backend
    console.log('Duplicating template:', duplicatedTemplate);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Quản Lý Template Điều Kiện</span>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Tạo Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo Template Mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tên template</Label>
                  <Input
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="VD: Customer VIP Template"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả (tùy chọn)</Label>
                  <Input
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    placeholder="Mô tả chi tiết template"
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleCreateTemplate} disabled={!newTemplateName.trim()}>
                    Tạo Template
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Hủy
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Apply Dropdown */}
        <div className="space-y-2">
          <Label>Áp dụng nhanh template có sẵn</Label>
          <div className="flex space-x-2">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Chọn template để áp dụng..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => {
                const template = templates.find(t => t.id === selectedTemplate);
                if (template) handleApplyTemplate(template);
              }}
              disabled={!selectedTemplate}
            >
              <Play className="w-4 h-4 mr-1" />
              Áp dụng
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label>Tìm kiếm template</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hoặc mô tả..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Templates Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên Template</TableHead>
                <TableHead>Mô Tả</TableHead>
                <TableHead>Thông Tin</TableHead>
                <TableHead className="text-right">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'Không tìm thấy template nào' : 'Chưa có template nào'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell>
                      <div className="font-medium">{template.name}</div>
                      <Badge variant="secondary" className="mt-1">
                        ID: {template.id}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600 max-w-xs">
                        {template.description || 'Không có mô tả'}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {template.createdBy}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {format(new Date(template.createdAt), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApplyTemplate(template)}
                          title="Áp dụng template"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Chỉnh sửa template"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                          title="Nhân bản template"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          title="Xóa template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
