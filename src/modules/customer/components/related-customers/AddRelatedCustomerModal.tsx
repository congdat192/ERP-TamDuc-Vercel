import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FamilyMemberService, APIResponse } from '../../services/familyMemberService';
import { extractCustomerInfo, RelationshipType, RELATIONSHIP_LABELS } from '../../types/relatedCustomer.types';
import { Loader2, Upload, Trash2, Star, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { externalStorageClient } from '@/integrations/supabase/externalStorageClient';
import { buildFamilyAvatarFilePath } from '../../utils/avatarUpload';

interface AddRelatedCustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: any;
  currentUser: any;
  onSuccess: () => void;
}

// Validate dd/mm/yyyy format
const isValidDate = (dateStr: string): boolean => {
  if (!dateStr.trim()) return true; // Empty is valid (optional field)
  
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return false;
  
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  
  if (day < 1 || day > 31 || month < 1 || month > 12 || 
      year < 1900 || year > new Date().getFullYear()) return false;
  
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1;
};

// Convert dd/mm/yyyy -> yyyy-mm-dd for API
const convertToAPIFormat = (dateStr: string): string => {
  if (!dateStr.trim()) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Auto-format as user types: 15111970 -> 15/11/1970
const formatDateInput = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length <= 2) return digitsOnly;
  if (digitsOnly.length <= 4) return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`;
};

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
  
  // Image upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const validFiles: File[] = [];
    const validUrls: string[] = [];
    
    Array.from(files).forEach(file => {
      // Validate
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: '❌ File không hợp lệ',
          description: `${file.name}: Chỉ chấp nhận JPG, PNG, WEBP`,
          variant: 'destructive'
        });
        return;
      }
      
      if (file.size > maxSize) {
        toast({
          title: '❌ File quá lớn',
          description: `${file.name}: Vượt quá 5MB`,
          variant: 'destructive'
        });
        return;
      }
      
      validFiles.push(file);
      validUrls.push(URL.createObjectURL(file));
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...validUrls]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]); // Cleanup
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    setRelatedName('');
    setRelationshipType('con_cai');
    setGender('Nam');
    setBirthDate('');
    setPhone('');
    setNotes('');
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!relatedName.trim()) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập tên người thân', variant: 'destructive' });
      return;
    }
    
    if (!birthDate) {
      toast({ 
        title: 'Lỗi', 
        description: 'Vui lòng nhập ngày sinh đúng định dạng dd/mm/yyyy', 
        variant: 'destructive' 
      });
      return;
    }

    setIsLoading(true);

    try {
      // 🔐 Phase 4: Get auth token from Lovable Cloud and set to External Storage
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        await externalStorageClient.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token || ''
        });
        console.log('[AddRelatedCustomerModal] ✅ Auth token set for External Storage');
      }

      // 1. Upload avatars to Storage FIRST (if any)
      const uploadedUrls: string[] = [];
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          // ✅ Build safe filePath (no Unicode, correct extension)
          const filePath = buildFamilyAvatarFilePath(customer.phone, relatedName.trim(), file);

          // ✅ Upload to External Supabase Storage
          const { data: uploadData, error: uploadError } = await externalStorageClient.storage
            .from('avatar_customers')
            .upload(filePath, file);

          if (uploadError) {
            console.error('[AddRelatedCustomerModal] Upload error:', uploadError);
            throw new Error(`Upload failed: ${uploadError.message}`);
          }

          // ✅ Get public URL from External Supabase
          const { data: { publicUrl } } = externalStorageClient.storage
            .from('avatar_customers')
            .getPublicUrl(filePath);
          
          console.log('[AddRelatedCustomerModal] Uploaded to External Storage:', publicUrl);
          
          uploadedUrls.push(publicUrl);
        }
      }

      // 2. Call External API to add family member (with images)
      const response: APIResponse = await FamilyMemberService.addFamilyMember(customer.phone, {
        ten: relatedName.trim(),
        moi_quan_he: relationshipType,
        gioi_tinh: gender === 'Nam' ? 'nam' : 'nu',
        ngay_sinh: convertToAPIFormat(birthDate),
        sdt: phone.trim() || undefined,
        ghi_chu: notes.trim() || undefined,
        hinh_anh: uploadedUrls
      });

      // ✅ CHECK response.success FIELD FIRST
      if (!response.success) {
        // ❌ ERROR: Display error_description NGUYÊN VĂN
        console.error('[AddRelatedCustomerModal] API Error:', response);
        console.error('[AddRelatedCustomerModal] Request ID:', response.meta?.request_id);

        toast({
          title: '❌ Lỗi',
          description: response.error_description, // ✅ NGUYÊN VĂN từ API
          variant: 'destructive',
          duration: 5000
        });
        return; // ✅ STOP here, không reset form
      }

      // ✅ SUCCESS: Display message NGUYÊN VĂN
      console.log('[AddRelatedCustomerModal] Success:', response);
      console.log('[AddRelatedCustomerModal] Request ID:', response.meta?.request_id);

      toast({
        title: '✅ Thành công',
        description: response.message // ✅ NGUYÊN VĂN từ API
      });

      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      // Network error hoặc unexpected error
      console.error('[AddRelatedCustomerModal] Unexpected error:', error);

      toast({
        title: '❌ Lỗi',
        description: 'Không thể kết nối đến server. Vui lòng thử lại.',
        variant: 'destructive',
        duration: 5000
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
                type="text"
                placeholder="dd/mm/yyyy (ví dụ: 15/11/1970)"
                value={birthDate}
                onChange={(e) => {
                  const formatted = formatDateInput(e.target.value);
                  setBirthDate(formatted);
                }}
                className="voucher-input"
                maxLength={10}
                required
              />
              {birthDate && !isValidDate(birthDate) && (
                <p className="text-sm text-red-500">
                  Định dạng không hợp lệ. Vui lòng nhập dd/mm/yyyy
                </p>
              )}
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

          {/* Upload Avatar Section */}
          <div className="space-y-4">
            <h3 className="font-semibold theme-text">📸 HÌNH ẢNH</h3>
            
            {/* Upload Area */}
            <div className="grid grid-cols-2 gap-3">
              {/* Upload từ thư viện */}
              <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
                <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <div className="text-center text-sm theme-text font-medium">
                    📁 Chọn từ thư viện
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, WEBP
                  </div>
                </label>
              </Card>

              {/* Chụp bằng camera */}
              <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
                <label className="flex flex-col items-center justify-center p-4 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                  <div className="text-center text-sm theme-text font-medium">
                    📸 Chụp ảnh
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Mở camera
                  </div>
                </label>
              </Card>
            </div>

            {/* Hướng dẫn */}
            <div className="text-xs text-muted-foreground text-center">
              Ảnh đầu tiên sẽ là ảnh đại diện • Max 5MB/ảnh
            </div>
            
            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className={`aspect-square rounded-lg overflow-hidden border-2 ${index === 0 ? 'border-primary' : 'border-border'}`}>
                      <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                    {index === 0 && (
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
