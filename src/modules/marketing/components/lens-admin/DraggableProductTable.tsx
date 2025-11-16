import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Copy, Trash2, Settings } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LensProduct } from '../../types/lens';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';

interface DraggableProductTableProps {
  products: LensProduct[];
  onEdit: (product: LensProduct) => void;
  onClone: (product: LensProduct) => void;
  onRefetch: () => void;
  onSelect?: (productId: string) => void;
  columnVisibility: Record<string, boolean>;
}

interface SortableRowProps {
  product: LensProduct;
  onEdit: (p: LensProduct) => void;
  onClone: (p: LensProduct) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  columnVisibility: Record<string, boolean>;
}

function SortableRow({ 
  product, 
  onEdit, 
  onClone,
  onDelete,
  onSelect,
  columnVisibility
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-12">
        <button
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-mono text-sm text-center">
        {product.display_order || 0}
      </TableCell>
      {columnVisibility.image && (
        <TableCell>
          {product.image_urls?.[0] && (
            <img
              src={product.image_urls[0]}
              alt={product.name}
              className="w-12 h-12 object-cover rounded"
            />
          )}
        </TableCell>
      )}
      {columnVisibility.sku && (
        <TableCell className="font-mono text-sm">{product.sku || '-'}</TableCell>
      )}
      {columnVisibility.name && (
        <TableCell className="font-medium min-w-[200px]">{product.name}</TableCell>
      )}
      {columnVisibility.description && (
        <TableCell className="max-w-xs">
          {truncateText(product.description, 100)}
        </TableCell>
      )}
      {columnVisibility.price && (
        <TableCell className="text-right">
          {product.price.toLocaleString('vi-VN')} đ
        </TableCell>
      )}
      {columnVisibility.sale_price && (
        <TableCell className="text-right">
          {product.sale_price ? `${product.sale_price.toLocaleString('vi-VN')} đ` : '-'}
        </TableCell>
      )}
      {columnVisibility.discount_percent && (
        <TableCell className="text-right">
          {product.discount_percent ? `${product.discount_percent}%` : '-'}
        </TableCell>
      )}
      {columnVisibility.brand && (
        <TableCell>{product.attributes?.lens_brand?.[0] || '-'}</TableCell>
      )}
      {columnVisibility.material && (
        <TableCell>{product.attributes?.lens_material?.[0] || '-'}</TableCell>
      )}
      {columnVisibility.refractive_index && (
        <TableCell>{product.attributes?.refractive_index?.[0] || '-'}</TableCell>
      )}
      {columnVisibility.is_promotion && (
        <TableCell>
          {product.is_promotion ? (
            <Badge variant="default">Có</Badge>
          ) : (
            <Badge variant="outline">Không</Badge>
          )}
        </TableCell>
      )}
      {columnVisibility.promotion_text && (
        <TableCell>{truncateText(product.promotion_text)}</TableCell>
      )}
      {columnVisibility.view_count && (
        <TableCell className="text-right">{product.view_count || 0}</TableCell>
      )}
      {columnVisibility.is_active && (
        <TableCell>
          {product.is_active ? (
            <Badge variant="default">Hoạt động</Badge>
          ) : (
            <Badge variant="secondary">Tạm dừng</Badge>
          )}
        </TableCell>
      )}
      {columnVisibility.created_at && (
        <TableCell>{formatDate(product.created_at)}</TableCell>
      )}
      {columnVisibility.updated_at && (
        <TableCell>{formatDate(product.updated_at)}</TableCell>
      )}
      {columnVisibility.actions && (
        <TableCell>
          <div className="flex items-center gap-2">
            {onSelect && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelect(product.id)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onClone(product)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export function DraggableProductTable({
  products,
  onEdit,
  onClone,
  onRefetch,
  onSelect,
  columnVisibility,
}: DraggableProductTableProps) {
  const [items, setItems] = useState(products);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateOrderMutation = useMutation({
    mutationFn: async (updates: Array<{ id: string; display_order: number }>) => {
      await lensApi.batchUpdateDisplayOrder(updates);
    },
    onSuccess: () => {
      toast.success('Đã cập nhật thứ tự hiển thị');
      onRefetch();
    },
    onError: (error: any) => {
      toast.error('Lỗi cập nhật: ' + error.message);
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Update display_order: new position + 1
    const updates = newItems.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }));

    updateOrderMutation.mutate(updates);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await lensApi.deleteProduct(deleteId);
      toast.success('Xóa sản phẩm thành công');
      onRefetch();
    } catch (error: any) {
      toast.error('Lỗi xóa sản phẩm: ' + error.message);
    } finally {
      setDeleteId(null);
    }
  };

  // Update items when products change
  useEffect(() => {
    // Sort by display_order as fallback (defensive programming)
    const sorted = [...products].sort((a, b) => 
      (a.display_order || 999999) - (b.display_order || 999999)
    );
    setItems(sorted);
  }, [products]);

  const visibleColumnsCount = Object.values(columnVisibility).filter(Boolean).length;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="border rounded-lg overflow-x-auto">
          <Table className="min-w-max">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Kéo</TableHead>
                <TableHead className="w-20 text-center">Thứ tự</TableHead>
                {columnVisibility.image && <TableHead className="min-w-[80px]">Ảnh</TableHead>}
                {columnVisibility.sku && <TableHead className="min-w-[120px]">Mã SKU</TableHead>}
                {columnVisibility.name && <TableHead className="min-w-[200px]">Tên sản phẩm</TableHead>}
                {columnVisibility.description && <TableHead className="min-w-[200px]">Mô tả</TableHead>}
                {columnVisibility.price && <TableHead className="text-right">Giá gốc</TableHead>}
                {columnVisibility.sale_price && <TableHead className="text-right">Giá khuyến mãi</TableHead>}
                {columnVisibility.discount_percent && <TableHead className="text-right">Chiết khấu %</TableHead>}
                {columnVisibility.brand && <TableHead>Thương hiệu</TableHead>}
                {columnVisibility.material && <TableHead>Chất liệu</TableHead>}
                {columnVisibility.refractive_index && <TableHead>Chiết suất</TableHead>}
                {columnVisibility.is_promotion && <TableHead>Khuyến mãi</TableHead>}
                {columnVisibility.promotion_text && <TableHead className="min-w-[150px]">Text KM</TableHead>}
                {columnVisibility.view_count && <TableHead className="text-right">Lượt xem</TableHead>}
                {columnVisibility.is_active && <TableHead>Trạng thái</TableHead>}
                {columnVisibility.created_at && <TableHead>Ngày tạo</TableHead>}
                {columnVisibility.updated_at && <TableHead>Ngày cập nhật</TableHead>}
                {columnVisibility.actions && <TableHead className="min-w-[180px]">Thao tác</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnsCount + 2} className="text-center py-8 text-muted-foreground">
                    Không có sản phẩm nào
                  </TableCell>
                </TableRow>
              ) : (
                <SortableContext
                  items={items.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((product) => (
                    <SortableRow
                      key={product.id}
                      product={product}
                      onEdit={onEdit}
                      onClone={onClone}
                      onDelete={setDeleteId}
                      onSelect={onSelect}
                      columnVisibility={columnVisibility}
                    />
                  ))}
                </SortableContext>
              )}
            </TableBody>
          </Table>
        </div>
      </DndContext>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
