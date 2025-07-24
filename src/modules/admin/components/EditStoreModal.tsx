
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/contexts/StoreContext';
import { StoreEntity, UpdateStoreRequest } from '@/types/store';

interface EditStoreModalProps {
  store: StoreEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditStoreModal({ store, isOpen, onClose }: EditStoreModalProps) {
  const { updateStore, isLoading } = useStore();
  const [formData, setFormData] = useState<UpdateStoreRequest>({});

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        code: store.code,
        description: store.description || '',
        address: store.address || '',
        phone: store.phone || '',
        email: store.email || '',
        manager_name: store.manager_name || '',
        manager_phone: store.manager_phone || '',
        is_main_store: store.is_main_store
      });
    }
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!store) return;
    
    try {
      await updateStore(store.id, formData);
      onClose();
    } catch (error) {
      // Error handled by context
    }
  };

  const handleChange = (field: keyof UpdateStoreRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!store) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa cửa hàng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cửa hàng "{store.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên cửa hàng *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nhập tên cửa hàng"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Mã cửa hàng *</Label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="Nhập mã cửa hàng"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Mô tả về cửa hàng"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Địa chỉ cửa hàng"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Số điện thoại cửa hàng"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="Email cửa hàng"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manager_name">Tên quản lý</Label>
              <Input
                id="manager_name"
                value={formData.manager_name || ''}
                onChange={(e) => handleChange('manager_name', e.target.value)}
                placeholder="Tên người quản lý"
              />
            </div>
            <div>
              <Label htmlFor="manager_phone">SĐT quản lý</Label>
              <Input
                id="manager_phone"
                value={formData.manager_phone || ''}
                onChange={(e) => handleChange('manager_phone', e.target.value)}
                placeholder="Số điện thoại quản lý"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_main_store"
              checked={formData.is_main_store || false}
              onCheckedChange={(checked) => handleChange('is_main_store', checked)}
            />
            <Label htmlFor="is_main_store">Đây là cửa hàng chính</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
