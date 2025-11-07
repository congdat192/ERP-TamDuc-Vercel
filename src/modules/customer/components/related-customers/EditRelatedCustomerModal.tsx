import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { RelatedCustomer, UpdateRelatedCustomerData, RELATIONSHIP_LABELS, RelationshipType } from '../../types/relatedCustomer.types';
import { FamilyMemberService } from '../../services/familyMemberService';
import { RelatedAvatarGallery } from './RelatedAvatarGallery';
import { toast } from '@/components/ui/use-toast';

interface EditRelatedCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  related: RelatedCustomer;
  onSuccess: () => void;
}

export function EditRelatedCustomerModal({ 
  open, 
  onOpenChange, 
  related,
  onSuccess 
}: EditRelatedCustomerModalProps) {
  const [formData, setFormData] = useState<UpdateRelatedCustomerData>({
    related_name: related.related_name,
    relationship_type: related.relationship_type,
    gender: related.gender || 'Nam',
    birth_date: related.birth_date || '',
    phone: related.phone || '',
    notes: related.notes || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [originalName] = useState(related.related_name);

  // Reset form when related changes
  useEffect(() => {
    setFormData({
      related_name: related.related_name,
      relationship_type: related.relationship_type,
      gender: related.gender || 'Nam',
      birth_date: related.birth_date || '',
      phone: related.phone || '',
      notes: related.notes || ''
    });
  }, [related]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.related_name?.trim()) {
      toast({
        title: '⚠️ Thiếu thông tin',
        description: 'Vui lòng nhập tên người thân',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const customerPhone = related.customer_phone;
      const newName = formData.related_name.trim();

      // Step 1: Nếu đổi tên → Call RENAME trước
      if (newName !== originalName) {
        await FamilyMemberService.renameFamilyMember(customerPhone, originalName, newName);
      }

      // Step 2: Cập nhật các field khác (chỉ gửi field đã thay đổi)
      const updates: any = {};
      
      if (formData.relationship_type !== related.relationship_type) {
        updates.moi_quan_he = formData.relationship_type;
      }
      
      const apiGender = formData.gender === 'Nam' ? 'nam' : 'nu';
      const currentGender = related.gender === 'Nam' ? 'nam' : 'nu';
      if (apiGender !== currentGender) {
        updates.gioi_tinh = apiGender;
      }
      
      if (formData.birth_date !== related.birth_date) {
        updates.ngay_sinh = formData.birth_date || '';
      }
      
      if (formData.phone !== related.phone) {
        updates.sdt = formData.phone || '';
      }
      
      if (formData.notes !== related.notes) {
        updates.ghi_chu = formData.notes || '';
      }

      // Chỉ call UPDATE nếu có thay đổi
      if (Object.keys(updates).length > 0) {
        await FamilyMemberService.updateFamilyMember(customerPhone, newName, updates);
      }

      toast({
        title: '✅ Thành công',
        description: 'Đã cập nhật thông tin người thân'
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating family member:', error);
      toast({
        title: '❌ Lỗi',
        description: error.message || 'Không thể cập nhật thông tin',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>✏️ Sửa thông tin: {related.related_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên người thân */}
          <div className="space-y-2">
            <Label htmlFor="related_name">
              Tên người thân <span className="text-destructive">*</span>
            </Label>
            <Input
              id="related_name"
              value={formData.related_name}
              onChange={(e) => setFormData({ ...formData, related_name: e.target.value })}
              placeholder="VD: Nguyễn Văn An"
              required
            />
          </div>

          {/* Mối quan hệ */}
          <div className="space-y-2">
            <Label>
              Mối quan hệ <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.relationship_type}
              onValueChange={(value) => setFormData({ ...formData, relationship_type: value as RelationshipType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RELATIONSHIP_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Giới tính */}
          <div className="space-y-2">
            <Label>Giới tính</Label>
            <RadioGroup
              value={formData.gender || 'Nam'}
              onValueChange={(value) => setFormData({ ...formData, gender: value as 'Nam' | 'Nữ' })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nam" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Nam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nữ" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Nữ</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Ngày sinh */}
          <div className="space-y-2">
            <Label htmlFor="birth_date">Ngày sinh</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date || ''}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="VD: 0912345678"
            />
          </div>

          {/* Ghi chú */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú về người thân..."
              rows={3}
            />
          </div>

          {/* Separator */}
          <Separator className="my-6" />

          {/* Avatar Management Section */}
          <div className="space-y-4">
            <h3 className="font-semibold theme-text">📸 QUẢN LÝ HÌNH ẢNH</h3>
            <RelatedAvatarGallery related={related} />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
