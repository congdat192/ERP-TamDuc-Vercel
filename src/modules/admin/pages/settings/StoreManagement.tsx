
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, CheckCircle, Ban, Store as StoreIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/contexts/StoreContext';
import { StoreEntity } from '@/types/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/ui/loading';
import { ConfirmationDialog } from '../../components/ConfirmationDialog';

// Define the schema for creating/updating a store
const storeSchema = z.object({
  name: z.string().min(2, {
    message: "Tên cửa hàng phải có ít nhất 2 ký tự.",
  }),
  code: z.string().min(1, {
    message: "Mã cửa hàng là bắt buộc.",
  }),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email không đúng định dạng").optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  is_main_store: z.boolean().default(false),
  description: z.string().optional(),
});

type StoreSchemaType = z.infer<typeof storeSchema>;

export function StoreManagement() {
  const { toast } = useToast();
  const { 
    stores, 
    currentStore,
    isLoading, 
    error, 
    fetchStores, 
    createStore, 
    updateStore, 
    deleteStore,
    setCurrentStore
  } = useStore();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editStore, setEditStore] = useState<StoreEntity | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingStoreId, setDeletingStoreId] = useState<number | null>(null);

  // Initialize form for creating/editing stores
  const form = useForm<StoreSchemaType>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      code: "",
      address: "",
      phone: "",
      email: "",
      status: 'active',
      is_main_store: false,
      description: ""
    },
  });

  // Load stores on component mount
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Handle store creation
  const handleCreate = async (values: StoreSchemaType) => {
    try {
      await createStore(values);
      toast({
        title: "Thành công",
        description: "Đã tạo cửa hàng mới.",
      });
      setShowCreateDialog(false);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo cửa hàng.",
        variant: "destructive",
      });
    }
  };

  // Handle store update
  const handleUpdate = async (values: StoreSchemaType) => {
    if (!editStore) return;
    try {
      await updateStore(editStore.id, values);
      toast({
        title: "Thành công",
        description: "Đã cập nhật cửa hàng.",
      });
      setEditStore(null);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật cửa hàng.",
        variant: "destructive",
      });
    }
  };

  // Handle store deletion
  const handleDeleteConfirm = async () => {
    if (!deletingStoreId) return;
    try {
      await deleteStore(deletingStoreId);
      toast({
        title: "Thành công",
        description: "Đã xóa cửa hàng.",
      });
      setShowDeleteDialog(false);
      setDeletingStoreId(null);
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa cửa hàng.",
        variant: "destructive",
      });
    }
  };

  // Prepare form for editing a store
  const onEdit = (store: StoreEntity) => {
    setEditStore(store);
    form.reset({
      name: store.name,
      code: store.code,
      address: store.address || "",
      phone: store.phone || "",
      email: store.email || "",
      status: store.status,
      is_main_store: store.is_main_store,
      description: store.description || ""
    });
  };

  // Prepare deletion and show confirmation dialog
  const onDelete = (storeId: number) => {
    setDeletingStoreId(storeId);
    setShowDeleteDialog(true);
  };

  const handleSelectStore = (store: StoreEntity) => {
    setCurrentStore(store);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
        <span className="ml-2 theme-text">Đang tải danh sách cửa hàng...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold theme-text">Quản Lý Cửa Hàng</h3>
          <p className="theme-text-muted">Thêm, chỉnh sửa và quản lý các cửa hàng của bạn</p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="theme-bg-primary text-white hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm Cửa Hàng
        </Button>
      </div>

      {/* Store List */}
      <Card className="theme-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <StoreIcon className="w-5 h-5 theme-text-primary" />
            <span className="theme-text">Danh Sách Cửa Hàng</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stores.length === 0 ? (
            <div className="text-center theme-text-muted">
              Không có cửa hàng nào. Hãy tạo một cửa hàng mới!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <Card key={store.id} className="theme-card hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium theme-text truncate">
                        {store.name}
                      </CardTitle>
                      {currentStore?.id === store.id && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {store.address || 'Không có địa chỉ'}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm theme-text">
                      {store.description || 'Không có mô tả'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs theme-text-muted">
                        Trạng thái:
                      </span>
                      {store.status === 'active' ? (
                        <span className="text-xs text-green-500">
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="text-xs text-red-500">
                          Ngừng hoạt động
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs theme-text-muted">
                        Cửa hàng chính:
                      </span>
                      {store.is_main_store ? (
                        <span className="text-xs text-blue-500">
                          Có
                        </span>
                      ) : (
                        <span className="text-xs">
                          Không
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectStore(store)}
                      >
                        Chọn
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(store)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(store.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Store Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          {/* This trigger is hidden */}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo Cửa Hàng Mới</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Cửa Hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên cửa hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã Cửa Hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã cửa hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa Chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số Điện Thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô Tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Trạng Thái</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Chọn trạng thái hoạt động cho cửa hàng
                      </p>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_main_store"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Cửa Hàng Chính</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Đặt làm cửa hàng chính
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Tạo</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Store Dialog */}
      <Dialog open={!!editStore} onOpenChange={() => setEditStore(null)}>
        <DialogTrigger asChild>
          {/* This trigger is hidden */}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Cửa Hàng</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Cửa Hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên cửa hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã Cửa Hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã cửa hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa Chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số Điện Thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô Tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Trạng Thái</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Chọn trạng thái hoạt động cho cửa hàng
                      </p>
                    </div>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_main_store"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Cửa Hàng Chính</FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Đặt làm cửa hàng chính
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Cập Nhật</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa cửa hàng"
        message="Bạn có chắc chắn muốn xóa cửa hàng này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="destructive"
      />
    </div>
  );
}
