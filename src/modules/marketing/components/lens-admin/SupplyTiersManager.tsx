import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { lensSupplyTiersApi } from '../../services/lensSupplyTiersApi';
import { SupplyTierFormDialog } from './SupplyTierFormDialog';
import { LensSupplyTier } from '../../types/lens-extended';
import { toast } from 'sonner';

interface SupplyTiersManagerProps {
  productId: string;
}

export function SupplyTiersManager({ productId }: SupplyTiersManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingTier, setEditingTier] = useState<LensSupplyTier | null>(null);
  const queryClient = useQueryClient();

  const { data: tiers, isLoading } = useQuery({
    queryKey: ['supply-tiers', productId],
    queryFn: () => lensSupplyTiersApi.getByProductId(productId)
  });

  const deleteMutation = useMutation({
    mutationFn: lensSupplyTiersApi.delete,
    onSuccess: () => {
      toast.success('Đã xóa tầng cung ứng');
      queryClient.invalidateQueries({ queryKey: ['supply-tiers', productId] });
    },
    onError: () => {
      toast.error('Lỗi khi xóa tầng cung ứng');
    }
  });

  const handleEdit = (tier: LensSupplyTier) => {
    setEditingTier(tier);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingTier(null);
    setShowForm(true);
  };

  const handleFormClose = (success?: boolean) => {
    setShowForm(false);
    setEditingTier(null);
    if (success) {
      queryClient.invalidateQueries({ queryKey: ['supply-tiers', productId] });
    }
  };

  const getTierTypeName = (type: string) => {
    const names: Record<string, string> = {
      'IN_STORE': 'Có sẵn tại CH',
      'NEXT_DAY': 'Giao ngày mai',
      'CUSTOM_ORDER': 'Đặt hàng theo yêu cầu',
      'FACTORY_ORDER': 'Đặt hàng từ nhà máy'
    };
    return names[type] || type;
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Đang tải...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Tầng cung ứng (Supply Tiers)</h3>
        </div>
        <Button onClick={handleCreate} size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm tier
        </Button>
      </div>

      <div className="space-y-3">
        {tiers?.map((tier) => (
          <div key={tier.id} className="border rounded-lg p-4 space-y-2 hover:border-primary transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-lg">
                    {tier.tier_name || getTierTypeName(tier.tier_type)}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {tier.lead_time_days === 0 ? 'Lấy ngay' : `${tier.lead_time_days} ngày`}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">SPH: </span>
                    <span className="font-medium">{tier.sph_min} → {tier.sph_max}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CYL: </span>
                    <span className="font-medium">{tier.cyl_min} → {tier.cyl_max}</span>
                  </div>
                  {tier.stock_quantity !== null && (
                    <div>
                      <span className="text-muted-foreground">Tồn kho: </span>
                      <span className="font-medium">{tier.stock_quantity}</span>
                    </div>
                  )}
                  {tier.price_adjustment !== 0 && (
                    <div>
                      <span className="text-muted-foreground">Chênh lệch giá: </span>
                      <span className="font-medium">
                        {tier.price_adjustment > 0 ? '+' : ''}{tier.price_adjustment.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(tier)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteMutation.mutate(tier.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {(!tiers || tiers.length === 0) && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              Chưa có tầng cung ứng nào. Thêm tier để quản lý phạm vi độ và thời gian giao hàng.
            </p>
            <Button onClick={handleCreate} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Thêm tier đầu tiên
            </Button>
          </div>
        )}
      </div>

      {showForm && (
        <SupplyTierFormDialog
          productId={productId}
          tier={editingTier}
          open={showForm}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
