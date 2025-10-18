import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { DocumentTemplateService } from '../../services/documentTemplateService';
import type { DocumentTemplate } from '../../types/administration';
import { Loader2 } from 'lucide-react';

interface PreviewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate;
}

export function PreviewTemplateModal({
  isOpen,
  onClose,
  template,
}: PreviewTemplateModalProps) {
  const [previewContent, setPreviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generatePreview();
  }, [template]);

  const generatePreview = async () => {
    try {
      setIsLoading(true);
      // Generate with mock employee data (no employee_id = use mock data)
      const content = await DocumentTemplateService.generateDocument(template.id);
      setPreviewContent(content);
    } catch (error: any) {
      console.error('Error generating preview:', error);
      setPreviewContent('Không thể tạo xem trước. Vui lòng kiểm tra mẫu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Xem Trước Mẫu: {template.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Mẫu được hiển thị với dữ liệu mẫu
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto border rounded-md p-6 bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">
              {previewContent}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
