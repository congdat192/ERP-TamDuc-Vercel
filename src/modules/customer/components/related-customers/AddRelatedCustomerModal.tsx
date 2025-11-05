import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { RelatedCustomerService } from '../../services/relatedCustomerService';
import { extractCustomerInfo, RelationshipType, RELATIONSHIP_LABELS } from '../../types/relatedCustomer.types';
import { Loader2 } from 'lucide-react';

interface AddRelatedCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: any;
  currentUser: any;
  onSuccess: () => void;
}

export function AddRelatedCustomerModal({ 
  open, 
  onOpenChange, 
  customer, 
  currentUser,
  onSuccess 
}: AddRelatedCustomerModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [relatedName, setRelatedName] = useState('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('con_cai');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nam');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!relatedName.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập tên người thân',
        variant: 'destructive'
      });
      return;
    }

    if (!birthDate) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn ngày sinh',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      await RelatedCustomerService.createRelatedFromCustomer(customer, {
        related_name: relatedName.trim(),
        relationship_type: relationshipType,
        gender,
        birth_date: birthDate,
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
        created_by: currentUser?.email || 'system'
      });

      toast({
        title: 'Thành công',
        description: 'Đã thêm người thân thành công'
      });

      // Reset form
      setRelatedName('');
      setRelationshipType('con_cai');
      setGender('Nam');
      setBirthDate('');
      setPhone('');
      setNotes('');

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating related customer:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể thêm người thân',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const customerInfo = extractCustomerInfo(customer);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold theme-text">
            ➕ THÊM NGƯỜI THÂN
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Info (Read-only) */}
          <div className="theme-card rounded-lg border theme-border-primary p-4">
            <h3 className="font-semibold theme-text mb-3">📋 THÔNG TIN KHÁCH HÀNG</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="theme-text-muted">Mã KH:</span>
                <span className="ml-2 theme-text font-medium">{customerInfo.customer_code}</span>
              </div>
              <div>
                <span className="theme-text-muted">Tên:</span>
                <span className="ml-2 theme-text font-medium">{customerInfo.customer_name}</span>
              </div>
              <div>
                <span className="theme-text-muted">SĐT:</span>
                <span className="ml-2 theme-text font-medium">{customerInfo.customer_phone}</span>
              </div>
              <div>
                <span className="theme-text-muted">Nhóm:</span>
                <span className="ml-2 theme-text font-medium">{customerInfo.customer_group}</span>
              </div>
            </div>
          </div>

          {/* Related Customer Info */}
          <div className="space-y-4">
            <h3 className="font-semibold theme-text">👥 THÔNG TIN NGƯỜI THÂN</h3>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="related-name" className="theme-text">
                Tên người thân <span className="text-red-500">*</span>
              </Label>
              <Input
                id="related-name"
                value={relatedName}
                onChange={(e) => setRelatedName(e.target.value)}
                placeholder="Nhập tên người thân"
                className="voucher-input"
                required
              />
            </div>

            {/* Relationship Type */}
            <div className="space-y-2">
              <Label htmlFor="relationship" className="theme-text">
                Mối quan hệ <span className="text-red-500">*</span>
              </Label>
              <Select value={relationshipType} onValueChange={(v) => setRelationshipType(v as RelationshipType)}>
                <SelectTrigger className="voucher-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RELATIONSHIP_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="theme-text">
                Giới tính <span className="text-red-500">*</span>
              </Label>
              <RadioGroup value={gender} onValueChange={(v) => setGender(v as 'Nam' | 'Nữ')}>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Nam" id="gender-male" />
                    <Label htmlFor="gender-male" className="theme-text cursor-pointer">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Nữ" id="gender-female" />
                    <Label htmlFor="gender-female" className="theme-text cursor-pointer">Nữ</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Birth Date */}
            <div className="space-y-2">
              <Label htmlFor="birth-date" className="theme-text">
                Ngày sinh <span className="text-red-500">*</span>
              </Label>
              <Input
                id="birth-date"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="voucher-input"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="theme-text">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Có thể bỏ trống"
                className="voucher-input"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="theme-text">
                Ghi chú
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú (nếu có)"
                rows={3}
                className="voucher-input"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  💾 Lưu thông tin
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
