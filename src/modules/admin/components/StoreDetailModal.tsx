
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Building2, MapPin, Phone, Mail, User, Calendar } from 'lucide-react';
import { StoreEntity } from '@/types/store';

interface StoreDetailModalProps {
  store: StoreEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StoreDetailModal({ store, isOpen, onClose }: StoreDetailModalProps) {
  if (!store) return null;

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge variant="secondary">Tạm dừng</Badge>
    );
  };

  const getStoreIcon = () => {
    if (store.is_main_store) {
      return <Store className="w-5 h-5 text-yellow-500" />;
    }
    return <Building2 className="w-5 h-5 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getStoreIcon()}
            <span>Chi tiết cửa hàng</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {store.name}
                <div className="flex items-center space-x-2">
                  {store.is_main_store && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Cửa hàng chính
                    </Badge>
                  )}
                  {getStatusBadge(store.status)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Mã cửa hàng</div>
                  <div className="font-mono">{store.code}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">ID</div>
                  <div className="font-mono">#{store.id}</div>
                </div>
              </div>

              {store.description && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Mô tả</div>
                  <div>{store.description}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {store.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 mt-1 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">Địa chỉ</div>
                    <div>{store.address}</div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {store.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Điện thoại</div>
                      <div>{store.phone}</div>
                    </div>
                  </div>
                )}

                {store.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <div>{store.email}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manager Info */}
          {(store.manager_name || store.manager_phone) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Thông tin quản lý</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {store.manager_name && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Tên quản lý</div>
                      <div>{store.manager_name}</div>
                    </div>
                  )}

                  {store.manager_phone && (
                    <div>
                      <div className="text-sm font-medium text-gray-500">Số điện thoại</div>
                      <div>{store.manager_phone}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Thông tin hệ thống</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Ngày tạo</div>
                  <div>{new Date(store.created_at).toLocaleDateString('vi-VN')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Cập nhật lần cuối</div>
                  <div>{new Date(store.updated_at).toLocaleDateString('vi-VN')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
