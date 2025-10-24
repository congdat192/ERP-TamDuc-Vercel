import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, GripVertical } from 'lucide-react';
import { lensApi } from '../../services/lensApi';
import { LensProductAttribute } from '../../types/lens';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

function SortableOptionItem({ option, onRemove }: { option: string; onRemove: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: option });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg group"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <span className="flex-1 text-sm">{option}</span>
      <X
        className="w-4 h-4 text-muted-foreground hover:text-destructive cursor-pointer"
        onClick={onRemove}
      />
    </div>
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOptions((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
    if (options.length === 0) {
      toast.error('Vui lòng thêm ít nhất 1 giá trị');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        slug: data.slug,
        type: data.type,
        display_order: data.display_order,
        options: options,
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

          <div>
            <Label>
              {selectedType === 'select' ? 'Giá trị (chọn 1) *' : 'Giá trị (chọn nhiều) *'}
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder={selectedType === 'select' ? 'VD: Plastic' : 'VD: Chống UV'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddOption();
                  }
                }}
              />
              <Button type="button" onClick={handleAddOption}>Thêm</Button>
            </div>
            <div className="space-y-2">
              {options.length === 0 ? (
                <div className="flex items-center justify-center min-h-[80px] border rounded-md bg-muted/30">
                  <p className="text-sm text-muted-foreground">
                    {selectedType === 'select' 
                      ? 'Chưa có giá trị nào (VD: Plastic, Hi-Index, CR-39)' 
                      : 'Chưa có giá trị nào (VD: Chống UV, Chống xước, Đổi màu)'}
                  </p>
                </div>
              ) : (
                <>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={options}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-md p-2">
                        {options.map((opt) => (
                          <SortableOptionItem
                            key={opt}
                            option={opt}
                            onRemove={() => handleRemoveOption(opt)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <GripVertical className="w-3 h-3" />
                    Kéo thả để sắp xếp thứ tự hiển thị
                  </p>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedType === 'select' 
                ? '💡 Thứ tự bên trên sẽ là thứ tự hiển thị khi thêm sản phẩm (chọn 1 giá trị)'
                : '💡 Thứ tự bên trên sẽ là thứ tự hiển thị khi thêm sản phẩm (chọn nhiều giá trị)'}
            </p>
          </div>

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
