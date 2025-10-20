import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrainingSessionService, CreateSessionData } from '../../services/trainingSessionService';
import { TrainingProgramService, TrainingProgram } from '../../services/trainingProgramService';
import { useToast } from '@/hooks/use-toast';

interface CreateSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateSessionModal({ open, onOpenChange, onSuccess }: CreateSessionModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [formData, setFormData] = useState<CreateSessionData>({
    program_id: '',
    session_name: '',
    start_date: '',
    end_date: '',
    location_type: 'offline',
    location: '',
    meeting_url: '',
    max_participants: 20
  });

  useEffect(() => {
    if (open) {
      loadPrograms();
    }
  }, [open]);

  const loadPrograms = async () => {
    try {
      const data = await TrainingProgramService.getPrograms();
      setPrograms(data.filter(p => p.status !== 'cancelled'));
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.program_id || !formData.session_name || !formData.start_date || !formData.end_date) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);
      await TrainingSessionService.createSession(formData);
      
      toast({
        title: 'Thành công',
        description: 'Đã tạo lớp học'
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        program_id: '',
        session_name: '',
        start_date: '',
        end_date: '',
        location_type: 'offline',
        location: '',
        meeting_url: '',
        max_participants: 20
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo Lớp Học</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="program_id">Chương Trình *</Label>
              <Select
                value={formData.program_id}
                onValueChange={(value) => setFormData({ ...formData, program_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chương trình..." />
                </SelectTrigger>
                <SelectContent>
                  {programs.map(program => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="session_name">Tên Lớp Học *</Label>
              <Input
                id="session_name"
                value={formData.session_name}
                onChange={(e) => setFormData({ ...formData, session_name: e.target.value })}
                placeholder="VD: Khóa K01 - Tháng 1/2025"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start_date">Ngày Bắt Đầu *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Ngày Kết Thúc *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_type">Hình Thức *</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value: any) => setFormData({ ...formData, location_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_participants">Số Học Viên Tối Đa</Label>
              <Input
                id="max_participants"
                type="number"
                min="1"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
              />
            </div>

            {(formData.location_type === 'offline' || formData.location_type === 'hybrid') && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="location">Địa Điểm</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="VD: Phòng họp A, Tầng 3"
                />
              </div>
            )}

            {(formData.location_type === 'online' || formData.location_type === 'hybrid') && (
              <div className="space-y-2 col-span-2">
                <Label htmlFor="meeting_url">Link Meeting</Label>
                <Input
                  id="meeting_url"
                  value={formData.meeting_url}
                  onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                  placeholder="https://meet.google.com/..."
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo Lớp Học'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
