import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { lensApi } from '../../services/lensApi';
import { LensProductAttribute } from '../../types/lens';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(1, 'Vui lòng nhập tên thuộc tính'),
  slug: z.string().min(1, 'Vui lòng nhập slug').regex(/^[a-z_]+$/, 'Slug chỉ chứa chữ thường và _'),
  type: z.enum(['select', 'multiselect']),
  display_order: z.number().min(0),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  attribute: LensProductAttribute | null;
  onClose: (success?: boolean) => void;
}

export function AttributeFormDialog({ open, attribute, onClose }: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'select',
      display_order: 0,
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (attribute) {
      reset({
        name: attribute.name,
        slug: attribute.slug,
        type: attribute.type,
        display_order: attribute.display_order,
      });
      setOptions(attribute.options);
    } else {
      reset({ type: 'select', display_order: 0 });
      setOptions([]);
      setNewOption('');
    }
  }, [attribute, reset]);

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    if (options.includes(newOption.trim())) {
      toast.error('Giá trị đã tồn tại');
      return;
    }
    setOptions(prev => [...prev, newOption.trim()]);
    setNewOption('');
  };

  const handleRemoveOption = (option: string) => {
    setOptions(prev => prev.filter(o => o !== option));
  };

  const onSubmit = async (data: FormData) => {
    if (data.type === 'select' && options.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 giá trị cho type Select');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        type: data.type,
        display_order: data.display_order,
        options: data.type === 'select' ? options : [],
        icon: (data as any).icon || null,
        is_active: true
      };

      if (attribute) {
        await lensApi.updateAttribute(attribute.id, payload);
        toast.success('Cập nhật thuộc tính thành công');
      } else {
        await lensApi.createAttribute(payload);
        toast.success('Tạo thuộc tính thành công');
      }

      onClose(true);
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{attribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Tên thuộc tính *</Label>
            <Input {...register('name')} placeholder="Chất liệu" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Slug (dùng trong code) *</Label>
            <Input {...register('slug')} placeholder="material" />
            {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              Ví dụ: material, refractive_index, origin, warranty_months
            </p>
          </div>

          <div>
            <Label>Icon (emoji)</Label>
            <Input {...register('icon' as any)} placeholder="🧪" maxLength={3} defaultValue={attribute?.icon || ''} />
            <p className="text-xs text-muted-foreground mt-1">
              Emoji để hiển thị (VD: 🧪 🔍 🌍 ⏱️ ☀️ 🛡️)
            </p>
          </div>

          <div>
            <Label>Loại</Label>
            <Select 
              onValueChange={(v: any) => setValue('type', v)} 
              defaultValue={attribute?.type || 'select'}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">Select (chọn 1)</SelectItem>
                <SelectItem value="multiselect">Multiselect (chọn nhiều)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Thứ tự hiển thị</Label>
            <Input type="number" {...register('display_order', { valueAsNumber: true })} />
          </div>

          {selectedType === 'select' && (
            <div>
              <Label>Giá trị *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Nhập giá trị (VD: Plastic)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddOption}>Thêm</Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2">
                {options.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Chưa có giá trị nào</p>
                ) : (
                  options.map(opt => (
                    <Badge key={opt} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground">
                      {opt}
                      <X className="w-3 h-3 ml-1" onClick={() => handleRemoveOption(opt)} />
                    </Badge>
                  ))
                )}
              </div>
            </div>
          )}

          {selectedType === 'multiselect' && (
            <div className="p-3 border rounded-md bg-muted/50">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Multiselect</strong> dùng để chọn nhiều tính năng (checkbox).
                <br />
                Ví dụ: Chống UV, Chống xước, Đổi màu, v.v.
                <br />
                Không cần nhập giá trị cố định.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onClose()}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? 'Đang lưu...' : attribute ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
