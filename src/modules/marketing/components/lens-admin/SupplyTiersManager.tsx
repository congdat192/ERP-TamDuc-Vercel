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

  const getLeadTimeBadge = (days: number) => {
    if (days === 0) return { color: 'bg-green-100 text-green-700 border-green-200', label: '🟢 Lấy ngay', icon: '⚡' };
    if (days <= 2) return { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: '🟡 1-2 ngày', icon: '🚚' };
    if (days <= 7) return { color: 'bg-orange-100 text-orange-700 border-orange-200', label: '🟠 3-7 ngày', icon: '📦' };
    return { color: 'bg-red-100 text-red-700 border-red-200', label: `🔴 ${days} ngày`, icon: '🏭' };
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
        {tiers?.map((tier) => {
          const badge = getLeadTimeBadge(tier.lead_time_days);
          const sphRange = Math.abs(tier.sph_max - tier.sph_min);
          const cylRange = Math.abs(tier.cyl_max - tier.cyl_min);
          
          return (
            <div key={tier.id} className="border rounded-lg p-4 hover:border-primary transition-colors hover:shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {tier.tier_name || getTierTypeName(tier.tier_type)}
                    </div>
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full border mt-1 ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-1">
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

              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>SPH: {tier.sph_min} → {tier.sph_max}</span>
                    <span>Phạm vi: {sphRange.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((sphRange / 35) * 100, 100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>CYL: {tier.cyl_min} → {tier.cyl_max}</span>
                    <span>Phạm vi: {cylRange.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((cylRange / 10) * 100, 100)}%` }}></div>
                  </div>
                </div>
              </div>

              {(tier.stock_quantity !== null || tier.price_adjustment !== 0) && (
                <div className="flex gap-4 mt-3 pt-3 border-t text-sm">
                  {tier.stock_quantity !== null && (
                    <div className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Tồn:</span>
                      <span className="font-medium">{tier.stock_quantity}</span>
                    </div>
                  )}
                  {tier.price_adjustment !== 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Giá:</span>
                      <span className="font-medium">
                        {tier.price_adjustment > 0 ? '+' : ''}{tier.price_adjustment.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

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
