import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { TrainingQuizService } from '../../services/trainingQuizService';

type CreateQuizData = {
  program_id: string;
  session_id?: string;
  title: string;
  description?: string;
  quiz_type: 'pre_test' | 'mid_test' | 'post_test';
  time_limit_minutes: number;
  passing_score: number;
  total_questions: number;
  questions: any[];
  max_attempts?: number;
  score_policy?: 'best' | 'latest' | 'average';
};

interface CreateQuizModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateQuizModal({ open, onClose, onSuccess }: CreateQuizModalProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<CreateQuizData>>({
    quiz_type: 'mid_test',
    passing_score: 70,
    time_limit_minutes: 60,
    questions: [],
    max_attempts: 3,
    score_policy: 'best',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.program_id || !formData.title || !formData.total_questions) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await TrainingQuizService.createQuiz({
        ...formData,
        questions: formData.questions || [],
      } as CreateQuizData);
      toast({
        title: 'Thành công',
        description: 'Đã tạo bài kiểm tra',
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
          <DialogTitle>Tạo Bài Kiểm Tra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tiêu đề *</Label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Kiểm tra giữa khóa React"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Loại bài kiểm tra *</Label>
              <Select
                value={formData.quiz_type}
                onValueChange={(value) => setFormData({ ...formData, quiz_type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre_test">Trước khóa</SelectItem>
                <SelectItem value="mid_test">Giữa khóa</SelectItem>
                <SelectItem value="post_test">Sau khóa</SelectItem>
              </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Số câu hỏi *</Label>
              <Input
                type="number"
                min="1"
                value={formData.total_questions || ''}
                onChange={(e) => setFormData({ ...formData, total_questions: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Thời gian (phút) *</Label>
              <Input
                type="number"
                min="1"
                value={formData.time_limit_minutes || ''}
                onChange={(e) => setFormData({ ...formData, time_limit_minutes: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label>Điểm đạt (%) *</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.passing_score || ''}
                onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo Bài Kiểm Tra'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
