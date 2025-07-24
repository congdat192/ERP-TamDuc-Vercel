
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Building2, Plus, Search, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { CreateStoreModal } from '../../components/CreateStoreModal';
import { EditStoreModal } from '../../components/EditStoreModal';
import { StoreDetailModal } from '../../components/StoreDetailModal';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { StoreEntity } from '@/types/store';
import { toast } from '@/hooks/use-toast';

export function StoreManagement() {
  const { 
    stores, 
    isLoading, 
    fetchStores, 
    deleteStore, 
    updateStore,
    getActiveStores 
  } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreEntity | null>(null);
  const [viewingStore, setViewingStore] = useState<StoreEntity | null>(null);
  const [deletingStore, setDeletingStore] = useState<StoreEntity | null>(null);

  // Load stores on component mount
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const filteredStores = stores.filter(store => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      store.name.toLowerCase().includes(search) ||
      store.code.toLowerCase().includes(search) ||
      store.address?.toLowerCase().includes(search) ||
      store.manager_name?.toLowerCase().includes(search)
    );
  });

  const handleDeleteStore = async () => {
    if (!deletingStore) return;
    
    try {
      await deleteStore(deletingStore.id);
      setDeletingStore(null);
    } catch (error) {
      // Error handled by context
    }
  };

  const handleToggleStatus = async (store: StoreEntity) => {
    try {
      const newStatus = store.status === 'active' ? 'inactive' : 'active';
      await updateStore(store.id, { status: newStatus });
      
      toast({
        title: "Thành công",
        description: `Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm dừng'} cửa hàng "${store.name}"`,
      });
    } catch (error) {
      // Error handled by context
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
    ) : (
      <Badge variant="secondary">Tạm dừng</Badge>
    );
  };

  const getStoreIcon = (store: StoreEntity) => {
    if (store.is_main_store) {
      return <Store className="w-4 h-4 text-yellow-500" />;
    }
    return <Building2 className="w-4 h-4 text-gray-500" />;
  };

  const activeStoresCount = getActiveStores().length;
  const totalStoresCount = stores.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold theme-text">Quản lý cửa hàng</h1>
          <p className="theme-text-muted">
            Quản lý thông tin các cửa hàng và chi nhánh
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="voucher-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm cửa hàng
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng số cửa hàng</CardDescription>
            <CardTitle className="text-2xl">{totalStoresCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs theme-text-muted">
              Bao gồm tất cả cửa hàng và chi nhánh
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Đang hoạt động</CardDescription>
            <CardTitle className="text-2xl text-green-600">{activeStoresCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs theme-text-muted">
              Cửa hàng đang kinh doanh
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tạm dừng</CardDescription>
            <CardTitle className="text-2xl text-gray-500">{totalStoresCount - activeStoresCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs theme-text-muted">
              Cửa hàng ngừng hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted h-4 w-4" />
              <Input
                placeholder="Tìm kiếm cửa hàng theo tên, mã, địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stores Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-medium">Cửa hàng</TableHead>
                  <TableHead className="font-medium">Mã</TableHead>
                  <TableHead className="font-medium">Địa chỉ</TableHead>
                  <TableHead className="font-medium">Quản lý</TableHead>
                  <TableHead className="font-medium">Số điện thoại</TableHead>
                  <TableHead className="font-medium">Trạng thái</TableHead>
                  <TableHead className="font-medium">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang tải...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredStores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <Building2 className="w-8 h-8 theme-text-muted" />
                        <span className="theme-text-muted">
                          {searchTerm ? 'Không tìm thấy cửa hàng nào' : 'Chưa có cửa hàng nào'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStores.map((store) => (
                    <TableRow key={store.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getStoreIcon(store)}
                          <div>
                            <div className="font-medium">{store.name}</div>
                            {store.is_main_store && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Cửa hàng chính
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{store.code}</TableCell>
                      <TableCell>
                        <div className="max-w-48 truncate" title={store.address}>
                          {store.address || '-'}
                        </div>
                      </TableCell>
                      <TableCell>{store.manager_name || '-'}</TableCell>
                      <TableCell>{store.manager_phone || store.phone || '-'}</TableCell>
                      <TableCell>{getStatusBadge(store.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setViewingStore(store)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setEditingStore(store)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(store)}
                            >
                              {store.status === 'active' ? 'Tạm dừng' : 'Kích hoạt'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingStore(store)}
                              className="text-red-600"
                              disabled={store.is_main_store}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateStoreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditStoreModal
        store={editingStore}
        isOpen={!!editingStore}
        onClose={() => setEditingStore(null)}
      />

      <StoreDetailModal
        store={viewingStore}
        isOpen={!!viewingStore}
        onClose={() => setViewingStore(null)}
      />

      <ConfirmationDialog
        isOpen={!!deletingStore}
        onClose={() => setDeletingStore(null)}
        onConfirm={handleDeleteStore}
        title="Xóa cửa hàng"
        message={`Bạn có chắc chắn muốn xóa cửa hàng "${deletingStore?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        confirmVariant="destructive"
      />
    </div>
  );
}
