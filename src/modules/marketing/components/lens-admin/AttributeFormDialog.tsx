import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { toast } from '@/hooks/use-toast';
import { lensApi } from '@/modules/marketing/services/lensApi';
import { LensProductAttribute, AttributeOption } from '@/modules/marketing/types/lens';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, X, Pencil, Upload, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().min(1, 'Tên thuộc tính là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  type: z.enum(['select', 'multiselect']),
  display_order: z.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

interface AttributeFormDialogProps {
  open: boolean;
  attribute: LensProductAttribute | null;
  onClose: (success?: boolean) => void;
}

function SortableOptionItem({
  option,
  onEdit,
  onRemove,
}: {
  option: AttributeOption;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: option.value,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 px-3 py-3 bg-secondary rounded-lg group hover:bg-accent/50">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>

      {option.image_url && (
        <img src={option.image_url} alt={option.label} className="w-10 h-10 rounded object-cover border" />
      )}

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{option.label}</div>
        {option.short_description && (
          <div className="text-xs text-muted-foreground line-clamp-1">{option.short_description}</div>
        )}
      </div>

      <Button type="button" size="sm" variant="ghost" onClick={onEdit} className="h-8 w-8 p-0">
        <Pencil className="w-3 h-3" />
      </Button>
      <Button size="sm" variant="ghost" onClick={onRemove} className="h-8 w-8 p-0">
        <X className="w-3 h-3 text-destructive" />
      </Button>
    </div>
  );
}

export function AttributeFormDialog({ open, attribute, onClose }: AttributeFormDialogProps) {
  const [options, setOptions] = useState<AttributeOption[]>([]);
  const [editingOption, setEditingOption] = useState<AttributeOption | null>(null);
  const [showOptionForm, setShowOptionForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingOption, setSavingOption] = useState(false);

  const [optionFormData, setOptionFormData] = useState<AttributeOption>({
    value: '',
    label: '',
    image_url: null,
    short_description: null,
    content: null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      type: 'select',
      display_order: 0,
    },
  });

  useEffect(() => {
    if (attribute) {
      form.reset({
        name: attribute.name,
        slug: attribute.slug,
        type: attribute.type,
        display_order: attribute.display_order,
      });
      // Normalize options to new format
      const normalizedOptions = attribute.options.map(opt => 
        typeof opt === 'string' ? { value: opt, label: opt, image_url: null, short_description: null, content: null } : opt
      );
      setOptions(normalizedOptions);
    } else {
      form.reset({
        name: '',
        slug: '',
        type: 'select',
        display_order: 0,
      });
      setOptions([]);
    }
  }, [attribute, form]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOptions((items) => {
        const oldIndex = items.findIndex((item) => item.value === active.id);
        const newIndex = items.findIndex((item) => item.value === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleOpenOptionForm = (option?: AttributeOption) => {
    if (option) {
      setEditingOption(option);
      setOptionFormData(option);
    } else {
      setEditingOption(null);
      setOptionFormData({
        value: '',
        label: '',
        image_url: null,
        short_description: null,
        content: null,
      });
    }
    setShowOptionForm(true);
  };

  const handleSaveOption = async () => {
    if (!optionFormData.value || !optionFormData.label) {
      toast({ title: 'Lỗi', description: 'Giá trị và nhãn là bắt buộc', variant: 'destructive' });
      return;
    }

    // Update local state
    let updatedOptions: AttributeOption[];
    if (editingOption) {
      updatedOptions = options.map(opt => opt.value === editingOption.value ? optionFormData : opt);
    } else {
      if (options.some(opt => opt.value === optionFormData.value)) {
        toast({ title: 'Lỗi', description: 'Giá trị đã tồn tại', variant: 'destructive' });
        return;
      }
      updatedOptions = [...options, optionFormData];
    }
    
    setOptions(updatedOptions);

    // Auto-save if editing existing attribute
    if (attribute && attribute.id) {
      try {
        setSavingOption(true);
        await lensApi.updateAttribute(attribute.id, {
          options: updatedOptions,
        });
        toast({ title: 'Thành công', description: 'Đã lưu thay đổi giá trị' });
        onClose(true); // Trigger refetch in parent
      } catch (error: any) {
        toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
        return; // Don't close modal on error
      } finally {
        setSavingOption(false);
      }
    } else {
      // For new attributes, just show local save message
      toast({ 
        title: 'Đã áp dụng', 
        description: 'Nhớ click "Tạo mới" để lưu vào database' 
      });
    }

    setShowOptionForm(false);
    setEditingOption(null);
  };

  const handleRemoveOption = (value: string) => {
    setOptions(prev => prev.filter(opt => opt.value !== value));
  };

  const handleUploadImage = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `attribute-options/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('lens-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('lens-images')
        .getPublicUrl(fileName);

      setOptionFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: 'Thành công', description: 'Upload ảnh thành công' });
    } catch (error: any) {
      toast({ title: 'Lỗi', description: 'Lỗi upload: ' + error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log('🔥 onSubmit called at:', new Date().toISOString());
    console.log('📋 Call stack:', new Error().stack);
    
    if (options.length === 0) {
      toast({ title: 'Lỗi', description: 'Vui lòng thêm ít nhất 1 giá trị', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);

      if (attribute) {
        // Update - can use partial
        await lensApi.updateAttribute(attribute.id, {
          name: data.name,
          slug: data.slug,
          type: data.type,
          display_order: data.display_order,
          options,
        });
        toast({ title: 'Thành công', description: 'Cập nhật thuộc tính thành công' });
      } else {
        // Create - must have all required fields
        await lensApi.createAttribute({
          name: data.name,
          slug: data.slug,
          type: data.type,
          display_order: data.display_order,
          options,
          icon: null,
          is_active: true,
        });
        toast({ title: 'Thành công', description: 'Tạo thuộc tính thành công' });
      }

      onClose(true);
    } catch (error: any) {
      toast({ title: 'Lỗi', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{attribute ? 'Chỉnh sửa thuộc tính' : 'Thêm thuộc tính mới'}</DialogTitle>
            <DialogDescription>
              Thuộc tính sẽ được dùng làm dropdown khi tạo sản phẩm
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên thuộc tính *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Chất liệu"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (key) *</Label>
                <Input
                  id="slug"
                  {...form.register('slug')}
                  placeholder="chat_lieu"
                />
                {form.formState.errors.slug && (
                  <p className="text-xs text-destructive">{form.formState.errors.slug.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại</Label>
                <Select
                  value={form.watch('type')}
                  onValueChange={(value) => form.setValue('type', value as 'select' | 'multiselect')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="select">Chọn 1</SelectItem>
                    <SelectItem value="multiselect">Chọn nhiều</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Thứ tự hiển thị</Label>
                <Input
                  id="display_order"
                  type="number"
                  {...form.register('display_order', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Các giá trị ({options.length})</Label>
                <Button type="button" size="sm" onClick={() => handleOpenOptionForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm giá trị
                </Button>
              </div>

              {options.length > 0 && (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={options.map(opt => opt.value)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {options.map((option) => (
                        <SortableOptionItem
                          key={option.value}
                          option={option}
                          onEdit={() => handleOpenOptionForm(option)}
                          onRemove={() => handleRemoveOption(option.value)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Đang lưu...' : attribute ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Option Form Dialog */}
      <Dialog open={showOptionForm} onOpenChange={setShowOptionForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingOption ? 'Chỉnh sửa giá trị' : 'Thêm giá trị mới'}</DialogTitle>
            <DialogDescription>
              Cấu hình chi tiết cho giá trị thuộc tính
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="option-value">Giá trị (key) *</Label>
                <Input
                  id="option-value"
                  placeholder="plastic"
                  value={optionFormData.value}
                  onChange={(e) => setOptionFormData(prev => ({ ...prev, value: e.target.value }))}
                  disabled={!!editingOption}
                />
                <p className="text-xs text-muted-foreground">
                  Dùng để lưu vào database (không dấu, lowercase)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="option-label">Nhãn hiển thị *</Label>
                <Input
                  id="option-label"
                  placeholder="Plastic"
                  value={optionFormData.label}
                  onChange={(e) => setOptionFormData(prev => ({ ...prev, label: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="option-image">URL ảnh</Label>
              <div className="flex gap-2">
                <Input
                  id="option-image"
                  placeholder="https://..."
                  value={optionFormData.image_url || ''}
                  onChange={(e) => setOptionFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleUploadImage(file);
                    };
                    input.click();
                  }}
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
              {optionFormData.image_url && (
                <img src={optionFormData.image_url} className="w-20 h-20 mt-2 rounded object-cover border" alt="Preview" />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="option-desc">Mô tả ngắn (tooltip)</Label>
              <Textarea
                id="option-desc"
                rows={2}
                placeholder="Hiển thị khi hover vào option"
                value={optionFormData.short_description || ''}
                onChange={(e) => setOptionFormData(prev => ({ ...prev, short_description: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Tối đa 100 ký tự</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="option-content">Nội dung chi tiết</Label>
              <Textarea
                id="option-content"
                rows={5}
                placeholder="Nội dung HTML hiển thị trong dialog"
                value={optionFormData.content || ''}
                onChange={(e) => setOptionFormData(prev => ({ ...prev, content: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Hỗ trợ HTML cơ bản: &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;, ...
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowOptionForm(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveOption} disabled={savingOption}>
              {savingOption ? 'Đang lưu...' : editingOption ? 'Lưu lại' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
