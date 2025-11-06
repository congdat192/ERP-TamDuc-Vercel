import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, Calendar, Phone, User, Hash } from 'lucide-react';
import { RelatedCustomer } from '../../types/relatedCustomer.types';
import { RELATIONSHIP_LABELS, RELATIONSHIP_ICONS } from '../../types/relatedCustomer.types';
import { RelatedCustomerService } from '../../services/relatedCustomerService';
import { RelatedAvatarGallery } from './RelatedAvatarGallery';
import { EditRelatedCustomerModal } from './EditRelatedCustomerModal';
import { AssignInvoiceModal } from './AssignInvoiceModal';
import { RelatedInvoicesList } from './RelatedInvoicesList';
import { toast } from '@/components/ui/use-toast';

interface RelatedCustomerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  related: RelatedCustomer | null;
  customer: any;
  currentUser: any;
  onUpdate: () => void;
}

export function RelatedCustomerDetailDialog({
  open,
  onOpenChange,
  related,
  customer,
  currentUser,
  onUpdate
}: RelatedCustomerDetailDialogProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAssignInvoiceOpen, setIsAssignInvoiceOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!related) return null;

  const formatDate = (date: string | null) => {
    if (!date) return 'Chưa có';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa người thân "${related.related_name}"?\n\nHành động này không thể hoàn tác.`
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      await RelatedCustomerService.deleteRelated(related.id);
      toast({ 
        title: '✅ Thành công', 
        description: 'Đã xóa người thân' 
      });
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({ 
        title: '❌ Lỗi', 
        description: error.message, 
        variant: 'destructive' 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    onUpdate();
  };

  const handleAssignSuccess = () => {
    setIsAssignInvoiceOpen(false);
    onUpdate();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <span>{RELATIONSHIP_ICONS[related.relationship_type]}</span>
              <span>Chi tiết: {related.related_name}</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="avatars">Hình ảnh</TabsTrigger>
              <TabsTrigger value="invoices">Hóa đơn</TabsTrigger>
            </TabsList>

            {/* Tab 1: Thông tin */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="w-4 h-4" />
                        <span>Mã người thân</span>
                      </div>
                      <div className="font-medium">{related.related_code}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Tên người thân</span>
                      </div>
                      <div className="font-medium">{related.related_name}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>🔗</span>
                        <span>Mối quan hệ</span>
                      </div>
                      <div className="font-medium">
                        {RELATIONSHIP_ICONS[related.relationship_type]} {RELATIONSHIP_LABELS[related.relationship_type]}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>⚧️</span>
                        <span>Giới tính</span>
                      </div>
                      <div className="font-medium">{related.gender || 'Chưa xác định'}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Ngày sinh</span>
                      </div>
                      <div className="font-medium">{formatDate(related.birth_date)}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>Số điện thoại</span>
                      </div>
                      <div className="font-medium">{related.phone || 'Chưa có'}</div>
                    </div>
                  </div>

                  {related.notes && (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Ghi chú</div>
                      <div className="p-3 bg-muted/50 rounded-md text-sm">{related.notes}</div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Thông tin khách hàng chính</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Mã KH: <span className="font-medium">{related.customer_code}</span></div>
                      <div>Tên KH: <span className="font-medium">{related.customer_name}</span></div>
                      <div>SĐT: <span className="font-medium">{related.customer_phone}</span></div>
                      <div>Nhóm: <span className="font-medium">{related.customer_group}</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditOpen(true)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa thông tin
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Đang xóa...' : 'Xóa người thân'}
                </Button>
              </div>
            </TabsContent>

            {/* Tab 2: Hình ảnh */}
            <TabsContent value="avatars">
              <RelatedAvatarGallery related={related} onUpdate={onUpdate} />
            </TabsContent>

            {/* Tab 3: Hóa đơn */}
            <TabsContent value="invoices" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setIsAssignInvoiceOpen(true)} className="gap-2">
                  ➕ Gán hóa đơn mới
                </Button>
              </div>
              <RelatedInvoicesList 
                relatedCustomer={related}
                customer={customer}
                onUpdate={onUpdate} 
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <EditRelatedCustomerModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        related={related}
        onSuccess={handleEditSuccess}
      />

      <AssignInvoiceModal
        open={isAssignInvoiceOpen}
        onOpenChange={setIsAssignInvoiceOpen}
        related={related}
        customer={customer}
        currentUser={currentUser}
        onSuccess={handleAssignSuccess}
      />
    </>
  );
}
