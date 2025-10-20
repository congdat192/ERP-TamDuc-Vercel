import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TrainingDocumentService, type CreateDocumentData } from '../../services/trainingDocumentService';

interface CreateMaterialModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateMaterialModal({ open, onClose, onSuccess }: CreateMaterialModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<CreateDocumentData>>({
    document_type: 'reading',
    is_required: true,
    display_order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.program_id || !formData.title) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await TrainingDocumentService.createDocument(formData as CreateDocumentData);
      toast({
        title: 'Thành công',
        description: 'Đã thêm tài liệu',
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Thêm Tài Liệu Học Tập</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tiêu đề *</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Slide bài giảng - Module 1"
            />
          </div>

          <div>
            <Label>Mô tả</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả ngắn về tài liệu..."
              rows={3}
            />
          </div>

          <div>
            <Label>Loại tài liệu *</Label>
            <Select
              value={formData.document_type}
              onValueChange={(value) => setFormData({ ...formData, document_type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="reading">Tài liệu đọc</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="exercise">Bài tập</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>File URL</Label>
            <Input
              value={formData.file_url || ''}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
              placeholder="VD: https://drive.google.com/... hoặc /storage/..."
            />
          </div>

          <div>
            <Label>Embed URL (cho video/slide)</Label>
            <Input
              value={formData.embed_url || ''}
              onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
              placeholder="VD: https://youtube.com/embed/..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang thêm...' : 'Thêm Tài Liệu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
