import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainingProgramService, CreateProgramData } from '../../services/trainingProgramService';
import { useToast } from '@/hooks/use-toast';

interface CreateProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateProgramModal({ open, onOpenChange, onSuccess }: CreateProgramModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProgramData>({
    title: '',
    description: '',
    program_type: 'internal',
    course_category: '',
    duration_hours: 8,
    competency_name: '',
    target_competency_level: 1,
    min_score_for_competency_up: 85,
    cost_per_participant: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.duration_hours) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await TrainingProgramService.createProgram(formData);
      
      toast({
        title: 'Thành công',
        description: 'Đã tạo chương trình đào tạo'
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        program_type: 'internal',
        course_category: '',
        duration_hours: 8,
        competency_name: '',
        target_competency_level: 1,
        min_score_for_competency_up: 85,
        cost_per_participant: 0
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Chương Trình Đào Tạo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="title">Tên Chương Trình *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Kỹ Năng Bán Hàng Chuyên Nghiệp"
                required
              />
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết về chương trình..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program_type">Loại Chương Trình *</Label>
              <Select
                value={formData.program_type}
                onValueChange={(value: any) => setFormData({ ...formData, program_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="external">External</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_hours">Thời Lượng (giờ) *</Label>
              <Input
                id="duration_hours"
                type="number"
                min="1"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course_category">Danh Mục</Label>
              <Input
                id="course_category"
                value={formData.course_category}
                onChange={(e) => setFormData({ ...formData, course_category: e.target.value })}
                placeholder="VD: Sales, Leadership, Technical"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost_per_participant">Chi Phí/Học Viên (VNĐ)</Label>
              <Input
                id="cost_per_participant"
                type="number"
                min="0"
                value={formData.cost_per_participant}
                onChange={(e) => setFormData({ ...formData, cost_per_participant: parseFloat(e.target.value) })}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Năng Lực Mục Tiêu (Tùy chọn)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="competency_name">Tên Năng Lực</Label>
                <Input
                  id="competency_name"
                  value={formData.competency_name}
                  onChange={(e) => setFormData({ ...formData, competency_name: e.target.value })}
                  placeholder="VD: Sales, Communication"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_level">Level Mục Tiêu</Label>
                <Select
                  value={formData.target_competency_level?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, target_competency_level: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(level => (
                      <SelectItem key={level} value={level.toString()}>
                        Level {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_score">Điểm Tối Thiểu Tăng Level</Label>
                <Input
                  id="min_score"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.min_score_for_competency_up}
                  onChange={(e) => setFormData({ ...formData, min_score_for_competency_up: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo Chương Trình'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
