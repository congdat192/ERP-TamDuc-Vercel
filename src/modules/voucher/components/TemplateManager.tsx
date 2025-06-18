import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2,
  Copy,
  FileText,
  Eye,
  Settings
} from 'lucide-react';
import { templateService } from '../services/templateService';
import type { VoucherTemplate } from '../types';
import { TEMPLATE_VARIABLES } from '../types';

export function TemplateManager() {
  const [templates, setTemplates] = useState<VoucherTemplate[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VoucherTemplate | null>(null);
  const [deleteTemplateId, setDeleteTemplateId] = useState<string>('');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');

  const validateTemplate = (name: string, content: string, excludeId?: string) => {
    if (!name.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên mẫu.",
        variant: "destructive"
      });
      return false;
    }

    if (!content.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập nội dung mẫu.",
        variant: "destructive"
      });
      return false;
    }

    if (templates.some(t => t.name.toLowerCase() === name.trim().toLowerCase() && t.id !== excludeId)) {
      toast({
        title: "Lỗi",
        description: "Tên mẫu đã tồn tại.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleCreateTemplate = () => {
    if (!validateTemplate(newName, newContent)) return;

    const newTemplate: VoucherTemplate = {
      id: Date.now().toString(),
      name: newName.trim(),
      content: newContent.trim(),
      isDefault: templates.length === 0, // First template becomes default
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    templateService.saveTemplates(updatedTemplates);
    
    setNewName('');
    setNewContent('');
    setIsCreateModalOpen(false);
    
    toast({
      title: "Thành công",
      description: "Mẫu đợt phát hành voucher mới đã được tạo thành công."
    });
  };

  const handleEditTemplate = () => {
    if (!editingTemplate) return;
    
    if (!validateTemplate(editingTemplate.name, editingTemplate.content, editingTemplate.id)) return;

    const updatedTemplate = {
      ...editingTemplate,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedTemplates = templates.map(t => 
      t.id === editingTemplate.id ? updatedTemplate : t
    );
    
    setTemplates(updatedTemplates);
    templateService.saveTemplates(updatedTemplates);
    setIsEditModalOpen(false);
    setEditingTemplate(null);
    
    toast({
      title: "Thành công",
      description: "Mẫu đã được cập nhật thành công."
    });
  };

  const handleDeleteTemplate = () => {
    const updatedTemplates = templates.filter(t => t.id !== deleteTemplateId);
    setTemplates(updatedTemplates);
    templateService.saveTemplates(updatedTemplates);
    setIsDeleteDialogOpen(false);
    setDeleteTemplateId('');
    
    toast({
      title: "Thành công",
      description: "Mẫu đã được xóa thành công."
    });
  };

  const handleDuplicateTemplate = (template: VoucherTemplate) => {
    const duplicated: VoucherTemplate = {
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      content: template.content,
      isDefault: false,
      isActive: template.isActive,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    const updatedTemplates = [...templates, duplicated];
    setTemplates(updatedTemplates);
    templateService.saveTemplates(updatedTemplates);
    
    toast({
      title: "Thành công",
      description: "Mẫu đã được sao chép thành công."
    });
  };

  const handleToggleStatus = (id: string) => {
    const updatedTemplates = templates.map(t => 
      t.id === id ? { ...t, isActive: !t.isActive } : t
    );
    setTemplates(updatedTemplates);
    templateService.saveTemplates(updatedTemplates);
    
    toast({
      title: "Thành công",
      description: "Trạng thái đã được cập nhật."
    });
  };

  const handleSetDefault = (id: string) => {
    const updatedTemplates = templates.map(t => ({
      ...t,
      isDefault: t.id === id
    }));
    setTemplates(updatedTemplates);
    templateService.saveTemplates(updatedTemplates);
    
    toast({
      title: "Thành công",
      description: "Mẫu mặc định đã được thay đổi."
    });
  };

  const handlePreview = (template: VoucherTemplate) => {
    // Mock preview data
    const previewData = template.content
      .replace(/\$tenKH/g, 'Nguyễn Văn A')
      .replace(/\$mavoucher/g, 'VCH-2024-001234')
      .replace(/\$sdt/g, '0901234567')
      .replace(/\$hansudung/g, '31/12/2024')
      .replace(/\$nhanvien/g, 'Ngọc Mỹ')
      .replace(/\$giatri/g, '50.000đ');
    
    setPreviewContent(previewData);
    setIsPreviewModalOpen(true);
  };

  const insertVariable = (variable: string, textareaRef: HTMLTextAreaElement | null) => {
    if (!textareaRef) return;
    
    const start = textareaRef.selectionStart;
    const end = textareaRef.selectionEnd;
    const text = textareaRef.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newText = before + variable + after;
    textareaRef.value = newText;
    textareaRef.focus();
    textareaRef.setSelectionRange(start + variable.length, start + variable.length);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Quản lý đợt phát hành Voucher</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Tạo và quản lý các mẫu đợt phát hành voucher. Bắt đầu bằng cách tạo mẫu đầu tiên.
            </p>
          </div>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Mẫu Mới
          </Button>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có mẫu nào</h3>
              <p className="text-gray-600 mb-4">
                Bắt đầu bằng cách tạo mẫu đợt phát hành voucher đầu tiên.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo Mẫu Đầu Tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên Mẫu</TableHead>
                  <TableHead>Mặc Định</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Ngày Tạo</TableHead>
                  <TableHead>Cập Nhật</TableHead>
                  <TableHead className="text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      {template.isDefault ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Mặc định
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(template.id)}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Đặt mặc định
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={template.isActive} 
                        onCheckedChange={() => handleToggleStatus(template.id)}
                      />
                    </TableCell>
                    <TableCell>{template.createdAt}</TableCell>
                    <TableCell>{template.updatedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePreview(template)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingTemplate(template);
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
                            setDeleteTemplateId(template.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo Mẫu Đợt Phát Hành Voucher Mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-name">Tên Mẫu</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nhập tên mẫu..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="new-content">Nội Dung Mẫu</Label>
              <Textarea
                id="new-content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Nhập nội dung mẫu..."
                className="mt-1 min-h-32"
                rows={6}
              />
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Biến có thể sử dụng:</p>
                <div className="flex flex-wrap gap-1">
                  {TEMPLATE_VARIABLES.map((variable) => (
                    <Button
                      key={variable.key}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('new-content') as HTMLTextAreaElement;
                        insertVariable(variable.key, textarea);
                        setNewContent(textarea.value);
                      }}
                      className="text-xs"
                    >
                      {variable.key}
                    </Button>
                  ))}
                </div>
              </div>
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Mẫu</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Tên Mẫu</Label>
                <Input
                  id="edit-name"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    name: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Nội Dung Mẫu</Label>
                <Textarea
                  id="edit-content"
                  value={editingTemplate.content}
                  onChange={(e) => setEditingTemplate({
                    ...editingTemplate,
                    content: e.target.value
                  })}
                  className="mt-1 min-h-32"
                  rows={6}
                />
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Biến có thể sử dụng:</p>
                  <div className="flex flex-wrap gap-1">
                    {TEMPLATE_VARIABLES.map((variable) => (
                      <Button
                        key={variable.key}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById('edit-content') as HTMLTextAreaElement;
                          insertVariable(variable.key, textarea);
                          setEditingTemplate({
                            ...editingTemplate,
                            content: textarea.value
                          });
                        }}
                        className="text-xs"
                      >
                        {variable.key}
                      </Button>
                    ))}
                  </div>
                </div>
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

      {/* Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xem Trước Mẫu</DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="text-sm bg-white p-4 rounded border max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {previewContent}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsPreviewModalOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
    </>
  );
}
