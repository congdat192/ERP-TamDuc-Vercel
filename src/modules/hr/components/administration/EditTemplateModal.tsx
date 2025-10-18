import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DocumentTemplateService } from '../../services/documentTemplateService';
import { PlaceholderInsertHelper } from './PlaceholderInsertHelper';
import type { DocumentTemplate, DocType } from '../../types/administration';
import { getDocTypeLabel } from '../../types/administration';
import { Eye } from 'lucide-react';

interface EditTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate;
  onSuccess: () => void;
}

export function EditTemplateModal({
  isOpen,
  onClose,
  template,
  onSuccess,
}: EditTemplateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: template.name,
    doc_type: template.doc_type,
    template_content: template.template_content,
    variables: template.variables || {},
  });
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      name: template.name,
      doc_type: template.doc_type,
      template_content: template.template_content,
      variables: template.variables || {},
    });
  }, [template]);

  const handleInsertPlaceholder = (placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.template_content;
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    const newContent = before + placeholder + after;
    setFormData({ ...formData, template_content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + placeholder.length;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên mẫu',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.template_content.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung mẫu',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await DocumentTemplateService.updateTemplate(template.id, formData);
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật mẫu văn bản',
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Mẫu Văn Bản</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="grid grid-cols-3 gap-4 flex-1 overflow-hidden">
            {/* Left: Form */}
            <div className="col-span-2 space-y-4 overflow-y-auto pr-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên Mẫu *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="VD: Mẫu Quyết Định Tuyển Dụng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc_type">Loại Văn Bản *</Label>
                <Select
                  value={formData.doc_type}
                  onValueChange={(value: DocType) =>
                    setFormData({ ...formData, doc_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decision">
                      {getDocTypeLabel('decision')}
                    </SelectItem>
                    <SelectItem value="notice">
                      {getDocTypeLabel('notice')}
                    </SelectItem>
                    <SelectItem value="contract">
                      {getDocTypeLabel('contract')}
                    </SelectItem>
                    <SelectItem value="form">
                      {getDocTypeLabel('form')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Nội Dung Mẫu *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Ẩn' : 'Xem'} Trước
                  </Button>
                </div>
                <Textarea
                  id="content"
                  ref={textareaRef}
                  value={formData.template_content}
                  onChange={(e) =>
                    setFormData({ ...formData, template_content: e.target.value })
                  }
                  placeholder="Nhập nội dung mẫu văn bản"
                  className="min-h-[400px] font-mono text-sm"
                />
                {showPreview && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/20">
                    <h4 className="font-semibold mb-2">Xem Trước:</h4>
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                      {formData.template_content}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Placeholder Helper */}
            <div className="overflow-hidden">
              <PlaceholderInsertHelper
                docType={formData.doc_type}
                onInsert={handleInsertPlaceholder}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
