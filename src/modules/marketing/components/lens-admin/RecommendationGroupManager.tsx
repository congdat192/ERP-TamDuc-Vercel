import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { lensApi } from '../../services/lensApi';
import { LensRecommendationGroup, LensProductWithDetails, CreateRecommendationGroupInput } from '../../types/lens';
import { toast } from 'sonner';

interface SortableProductItemProps {
  product: LensProductWithDetails & { display_order: number };
  onRemove: () => void;
}

function SortableProductItem({ product, onRemove }: SortableProductItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>
      <img src={product.image_urls[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
      <div className="flex-1">
        <p className="font-medium text-sm">{product.name}</p>
        <p className="text-xs text-muted-foreground">{product.price?.toLocaleString()}₫</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onRemove}>
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
}

export function RecommendationGroupManager() {
  const queryClient = useQueryClient();
  const [selectedGroup, setSelectedGroup] = useState<LensRecommendationGroup | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddingProducts, setIsAddingProducts] = useState(false);
  const [editingGroup, setEditingGroup] = useState<LensRecommendationGroup | null>(null);
  const [formData, setFormData] = useState<CreateRecommendationGroupInput>({
    name: '',
    slug: '',
    description: '',
    icon: '⚡',
    color: '#3B82F6',
    display_order: 0,
  });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { data: groups, isLoading } = useQuery({
    queryKey: ['recommendation-groups'],
    queryFn: () => lensApi.getRecommendationGroups(),
  });

  const { data: groupProducts, refetch: refetchGroupProducts } = useQuery({
    queryKey: ['group-products', selectedGroup?.id],
    queryFn: () => selectedGroup ? lensApi.getGroupProducts(selectedGroup.id) : Promise.resolve([]),
    enabled: !!selectedGroup,
  });

  const { data: allProducts } = useQuery({
    queryKey: ['all-products-for-recommendations'],
    queryFn: () => lensApi.getProducts({}, 1, 200),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRecommendationGroupInput) => lensApi.createRecommendationGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendation-groups'] });
      toast.success('Tạo nhóm thành công');
      setIsFormOpen(false);
      resetForm();
    },
    onError: () => toast.error('Không thể tạo nhóm'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => lensApi.updateRecommendationGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendation-groups'] });
      toast.success('Cập nhật nhóm thành công');
      setIsFormOpen(false);
      resetForm();
    },
    onError: () => toast.error('Không thể cập nhật nhóm'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lensApi.deleteRecommendationGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendation-groups'] });
      toast.success('Xóa nhóm thành công');
      if (selectedGroup?.id === deleteMutation.variables) {
        setSelectedGroup(null);
      }
    },
    onError: () => toast.error('Không thể xóa nhóm'),
  });

  const addProductsMutation = useMutation({
    mutationFn: async ({ groupId, productIds }: { groupId: string; productIds: string[] }) => {
      const existingCount = groupProducts?.length || 0;
      for (let i = 0; i < productIds.length; i++) {
        await lensApi.addProductToGroup(groupId, productIds[i], existingCount + i);
      }
    },
    onSuccess: () => {
      refetchGroupProducts();
      toast.success('Thêm sản phẩm thành công');
      setIsAddingProducts(false);
      setSelectedProductIds([]);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể thêm sản phẩm');
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: ({ groupId, productId }: { groupId: string; productId: string }) =>
      lensApi.removeProductFromGroup(groupId, productId),
    onSuccess: () => {
      refetchGroupProducts();
      toast.success('Xóa sản phẩm thành công');
    },
    onError: () => toast.error('Không thể xóa sản phẩm'),
  });

  const reorderMutation = useMutation({
    mutationFn: ({ groupId, orders }: { groupId: string; orders: { productId: string; order: number }[] }) =>
      lensApi.reorderGroupProducts(groupId, orders),
    onSuccess: () => {
      refetchGroupProducts();
      toast.success('Cập nhật thứ tự thành công');
    },
  });

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', icon: '⚡', color: '#3B82F6', display_order: 0 });
    setEditingGroup(null);
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditGroup = (group: LensRecommendationGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      slug: group.slug,
      description: group.description || '',
      icon: group.icon || '⚡',
      color: group.color,
      display_order: group.display_order,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (editingGroup) {
      updateMutation.mutate({ id: editingGroup.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !selectedGroup || !groupProducts) return;

    if (active.id !== over.id) {
      const oldIndex = groupProducts.findIndex((p) => p.id === active.id);
      const newIndex = groupProducts.findIndex((p) => p.id === over.id);
      const reordered = arrayMove(groupProducts, oldIndex, newIndex);
      
      const orders = reordered.map((p, idx) => ({ productId: p.id, order: idx }));
      reorderMutation.mutate({ groupId: selectedGroup.id, orders });
    }
  };

  const handleAddProducts = () => {
    if (selectedGroup && selectedProductIds.length > 0) {
      addProductsMutation.mutate({ groupId: selectedGroup.id, productIds: selectedProductIds });
    }
  };

  const availableProducts = (allProducts?.products || []).filter(
    (p) => !groupProducts?.some((gp) => gp.id === p.id)
  );

  const ICON_OPTIONS = ['⚡', '🏪', '💡', '🌈', '🚗', '💼', '👓', '⭐', '🎯', '🔥'];
  const COLOR_OPTIONS = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Pink', value: '#EC4899' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Group List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Nhóm tư vấn</CardTitle>
            <Button size="sm" onClick={handleCreateGroup}>
              <Plus className="w-4 h-4 mr-1" />
              Tạo mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          ) : groups && groups.length > 0 ? (
            groups.map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedGroup?.id === group.id ? 'border-primary bg-accent' : 'hover:bg-accent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{group.icon}</span>
                    <span className="font-medium text-sm">{group.name}</span>
                  </div>
                  <Badge style={{ backgroundColor: group.color }} className="text-white">
                    {group.product_count || 0}
                  </Badge>
                </div>
                <div className="flex gap-1 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditGroup(group);
                    }}
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Xóa nhóm này?')) {
                        deleteMutation.mutate(group.id);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có nhóm nào</p>
          )}
        </CardContent>
      </Card>

      {/* Right: Product Management */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedGroup ? selectedGroup.name : 'Chọn nhóm'}</CardTitle>
              {selectedGroup && <p className="text-sm text-muted-foreground mt-1">{selectedGroup.description}</p>}
            </div>
            {selectedGroup && (
              <Button size="sm" onClick={() => setIsAddingProducts(true)}>
                <Plus className="w-4 h-4 mr-1" />
                Thêm sản phẩm
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedGroup ? (
            groupProducts && groupProducts.length > 0 ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={groupProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {groupProducts.map((product) => (
                      <SortableProductItem
                        key={product.id}
                        product={product}
                        onRemove={() => removeProductMutation.mutate({ groupId: selectedGroup.id, productId: product.id })}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Chưa có sản phẩm nào trong nhóm</p>
                <Button size="sm" className="mt-4" onClick={() => setIsAddingProducts(true)}>
                  Thêm sản phẩm đầu tiên
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Chọn một nhóm để quản lý sản phẩm</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Chỉnh sửa nhóm' : 'Tạo nhóm mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên nhóm *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label>Slug (URL) *</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="co-san"
              />
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
            <div>
              <Label>Icon</Label>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Paste icon here (e.g., ⚡ 🏪 💡)"
                className="text-xl"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste bất kỳ emoji hoặc icon nào bạn muốn
              </p>
            </div>
            <div>
              <Label>Màu badge</Label>
              <div className="flex gap-2 mt-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-8 h-8 rounded-full border-2 ${formData.color === color.value ? 'border-foreground' : 'border-transparent'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            <div>
              <Label>Thứ tự hiển thị</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name || !formData.slug}>
              {editingGroup ? 'Cập nhật' : 'Tạo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Products Dialog */}
      <Dialog open={isAddingProducts} onOpenChange={setIsAddingProducts}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm vào {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {availableProducts.length > 0 ? (
              availableProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-2 border rounded-lg">
                  <Checkbox
                    checked={selectedProductIds.includes(product.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedProductIds([...selectedProductIds, product.id]);
                      } else {
                        setSelectedProductIds(selectedProductIds.filter((id) => id !== product.id));
                      }
                    }}
                  />
                  <img src={product.image_urls[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.price?.toLocaleString()}₫</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">Không còn sản phẩm để thêm</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingProducts(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddProducts} disabled={selectedProductIds.length === 0}>
              Thêm ({selectedProductIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
