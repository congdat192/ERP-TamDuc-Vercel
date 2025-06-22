import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  HelpCircle,
  Star
} from 'lucide-react';
import type { VoucherTemplate, TemplateVariable } from '../types';
import { TEMPLATE_VARIABLES } from '../types';
import { templateService } from '../services/templateService';

// Mock data - in real app this would come from API
const initialTemplates: VoucherTemplate[] = [
  {
    id: '1',
    name: 'Mẫu Mặc Định',
    content: 'Xin chào $tenKH,\n\nBạn đã nhận được voucher $mavoucher trị giá $giatri.\nSố điện thoại: $sdt\nHạn sử dụng: $hansudung\nNhân viên phát hành: $nhanvien\n\nCảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Mẫu VIP',
    content: 'Kính chào Quý khách $tenKH,\n\nChúng tôi xin gửi tặng Quý khách voucher $mavoucher với giá trị $giatri.\nThông tin liên hệ: $sdt\nVoucher có hiệu lực đến: $hansudung\nĐược xử lý bởi: $nhanvien\n\nChân thành cảm ơn sự tin tưởng của Quý khách!',
    isDefault: false,
    isActive: true,
    createdAt: '2024-01-16',
    updatedAt: '2024-01-16'
  }
];

export function TemplateManager() {
  const [templates, setTemplates] = useState<VoucherTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VoucherTemplate | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string>('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  // Load templates from localStorage on component mount
  useEffect(() => {
    const loadedTemplates = templateService.getTemplates();
    setTemplates(loadedTemplates);
    if (loadedTemplates.length > 0) {
      setSelectedTemplateId(loadedTemplates[0].id);
    }
  }, []);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const insertVariable = (variable: TemplateVariable) => {
    const textarea = document.getElementById('template-content') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentContent = isEditModalOpen ? (editingTemplate?.content || '') : newTemplateContent;
      const newContent = currentContent.substring(0, start) + variable.key + currentContent.substring(end);
      
      if (isEditModalOpen && editingTemplate) {
        setEditingTemplate({ ...editingTemplate, content: newContent });
      } else {
        setNewTemplateContent(newContent);
      }
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.key.length, start + variable.key.length);
      }, 0);
    }
  };

  const previewTemplate = (content: string) => {
    return content
      .replace(/\$tenKH/g, 'Nguyễn Văn An')
      .replace(/\$mavoucher/g, 'VCH-2024-001234')
      .replace(/\$sdt/g, '0901234567')
      .replace(/\$hansudung/g, '31/12/2024')
      .replace(/\$nhanvien/g, 'Trần Thị Lan')
      .replace(/\$giatri/g, '50.000đ');
  };

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateContent.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ tên và nội dung mẫu.",
        variant: "destructive"
      });
      return;
    }

    if (templates.some(t => t.name === newTemplateName.trim())) {
      toast({
        title: "Lỗi",
        description: "Tên mẫu đã tồn tại. Vui lòng chọn tên khác.",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: VoucherTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      content: newTemplateContent,
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTemplates = templateService.addTemplate(newTemplate);
    setTemplates(updatedTemplates);
    setSelectedTemplateId(newTemplate.id);
    setNewTemplateName('');
    setNewTemplateContent('');
    setIsCreateModalOpen(false);
    
    toast({
      title: "Thành công",
      description: "Mẫu mới đã được tạo thành công."
    });
  };

  const handleEditTemplate = () => {
    if (!editingTemplate?.name.trim() || !editingTemplate?.content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ tên và nội dung mẫu.",
        variant: "destructive"
      });
      return;
    }

    if (templates.some(t => t.name === editingTemplate.name.trim() && t.id !== editingTemplate.id)) {
      toast({
        title: "Lỗi",
        description: "Tên mẫu đã tồn tại. Vui lòng chọn tên khác.",
        variant: "destructive"
      });
      return;
    }

    const updatedTemplate = { ...editingTemplate, updatedAt: new Date().toISOString() };
    const updatedTemplates = templateService.updateTemplate(editingTemplate.id, updatedTemplate);
    setTemplates(updatedTemplates);
    setIsEditModalOpen(false);
    setEditingTemplate(null);
    
    toast({
      title: "Thành công",
      description: "Mẫu đã được cập nhật thành công."
    });
  };

  const handleDeleteTemplate = () => {
    const templateToDelete = templates.find(t => t.id === deleteTemplateId);
    
    if (templateToDelete?.isDefault) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa mẫu mặc định.",
        variant: "destructive"
      });
      return;
    }

    const updatedTemplates = templateService.deleteTemplate(deleteTemplateId);
    setTemplates(updatedTemplates);
    
    // If deleted template was selected, select first available
    if (selectedTemplateId === deleteTemplateId) {
      setSelectedTemplateId(updatedTemplates[0]?.id || '');
    }
    
    setIsDeleteDialogOpen(false);
    setDeleteTemplateId('');
    
    toast({
      title: "Thành công",
      description: "Mẫu đã được xóa thành công."
    });
  };

  const handleDuplicateTemplate = (template: VoucherTemplate) => {
    const duplicatedTemplate: VoucherTemplate = {
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      content: template.content,
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTemplates = templateService.addTemplate(duplicatedTemplate);
    setTemplates(updatedTemplates);
    setSelectedTemplateId(duplicatedTemplate.id);
    
    toast({
      title: "Thành công",
      description: "Mẫu đã được sao chép thành công."
    });
  };

  const handleSetAsDefault = (templateId: string) => {
    const updatedTemplates = templates.map(t => ({
      ...t,
      isDefault: t.id === templateId
    }));
    
    setTemplates(updatedTemplates);
    
    // Update in localStorage
    updatedTemplates.forEach(template => {
      templateService.updateTemplate(template.id, template);
    });
    
    toast({
      title: "Thành công",
      description: "Đã đặt làm mẫu mặc định."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quản Lý Mẫu Nội Dung Voucher</span>
            <Button onClick={() => setIsCreateModalOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Thêm Mẫu
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selector */}
          <div className="flex items-center space-x-4">
            <Label htmlFor="template-select" className="text-sm font-medium">
              Chọn Mẫu:
            </Label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Chọn mẫu để chỉnh sửa" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex items-center space-x-2">
                      <span>{template.name}</span>
                      {template.isDefault && (
                        <Badge variant="secondary" className="text-xs">Mặc Định</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Template Display */}
          {selectedTemplate && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{selectedTemplate.name}</h4>
                  {selectedTemplate.isDefault && (
                    <Badge variant="default" className="text-xs">Mặc Định</Badge>
                  )}
                  <Badge variant={selectedTemplate.isActive ? 'default' : 'secondary'} className="text-xs">
                    {selectedTemplate.isActive ? 'Hoạt Động' : 'Tạm Dừng'}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSetAsDefault(selectedTemplate.id)}
                    disabled={selectedTemplate.isDefault}
                    title="Đặt làm mặc định"
                  >
                    <Star className={`w-4 h-4 ${selectedTemplate.isDefault ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsPreviewModalOpen(true)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDuplicateTemplate(selectedTemplate)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setEditingTemplate(selectedTemplate);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600"
                    onClick={() => {
                      setDeleteTemplateId(selectedTemplate.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    disabled={selectedTemplate.isDefault}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-white p-3 rounded border max-h-40 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-xs">
                  {selectedTemplate.content}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variables Helper */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Biến Có Thể Sử Dụng</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATE_VARIABLES.map((variable) => (
              <div key={variable.key} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {variable.key}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => insertVariable(variable)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{variable.label}</div>
                  <div className="text-gray-600 text-xs">{variable.description}</div>
                  <div className="text-gray-500 text-xs italic">VD: {variable.placeholder}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo Mẫu Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-template-name">Tên Mẫu</Label>
              <Input
                id="new-template-name"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Nhập tên mẫu..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-template-content">Nội Dung</Label>
              <Textarea
                id="new-template-content"
                value={newTemplateContent}
                onChange={(e) => setNewTemplateContent(e.target.value)}
                placeholder="Nhập nội dung mẫu..."
                className="mt-1 min-h-32"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateTemplate}>
              Tạo Mẫu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Mẫu</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-template-name">Tên Mẫu</Label>
                <Input
                  id="edit-template-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  placeholder="Nhập tên mẫu..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-template-content">Nội Dung</Label>
                <Textarea
                  id="edit-template-content"
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                  placeholder="Nhập nội dung mẫu..."
                  className="mt-1 min-h-32"
                  rows={8}
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
              Bạn có chắc chắn muốn xóa mẫu này? Hành động này không thể hoàn tác.
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

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xem Trước Mẫu Voucher</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Nội Dung Voucher (Với Dữ Liệu Mẫu)</h4>
              <div className="text-sm bg-white p-3 rounded border">
                <pre className="whitespace-pre-wrap">
                  {selectedTemplate ? previewTemplate(selectedTemplate.content) : ''}
                </pre>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
