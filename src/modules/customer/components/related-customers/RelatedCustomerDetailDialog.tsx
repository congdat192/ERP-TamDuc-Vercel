import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, Calendar, Phone, User, Hash, Loader2 } from 'lucide-react';
import { RelatedCustomer } from '../../types/relatedCustomer.types';
import { RELATIONSHIP_LABELS, RELATIONSHIP_ICONS } from '../../types/relatedCustomer.types';
import { FamilyMemberService, APIResponse } from '../../services/familyMemberService';
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
      `Bạn có chắc chắn muốn xóa người thân "${related.related_name}"?\n\n` +
      `⚠️ Cảnh báo: Tất cả ảnh và hóa đơn của người thân này cũng sẽ bị xóa!`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response: APIResponse = await FamilyMemberService.deleteFamilyMember(customer.phone, related.id);

      if (!response.success) {
        console.error('[RelatedCustomerDetailDialog] Delete failed:', response);
        console.error('[RelatedCustomerDetailDialog] Request ID:', response.meta?.request_id);

        toast({
          title: '❌ Lỗi',
          description: response.error_description,
          variant: 'destructive',
          duration: 5000
        });
        return;
      }

      console.log('[RelatedCustomerDetailDialog] Success:', response);
      console.log('[RelatedCustomerDetailDialog] Request ID:', response.meta?.request_id);

      toast({
        title: '✅ Thành công',
        description: response.message
      });

      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      console.error('[RelatedCustomerDetailDialog] Unexpected error:', error);

      toast({
        title: '❌ Lỗi',
        description: 'Không thể kết nối đến server. Vui lòng thử lại.',
        variant: 'destructive',
        duration: 5000
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Thông tin</TabsTrigger>
              <TabsTrigger value="invoices">Hóa đơn</TabsTrigger>
            </TabsList>

            {/* Tab 1: Thông tin */}
            <TabsContent value="info" className="space-y-6">
              {/* Phần thông tin cơ bản - Card có border */}
              <Card className="border-2">
                <CardContent className="pt-6">
                  <h3 className="text-sm font-semibold mb-4 text-blue-600">📋 PHẦN THÔNG TIN CƠ BẢN (Card)</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="w-4 h-4" />
                        <span>Mã người thân</span>
                      </div>
                      <div className="font-medium">{related.related_code}</div>
                      <div className="text-xs text-muted-foreground">Con cái</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>Tên người thân</span>
                      </div>
                      <div className="font-medium">{related.related_name}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>🔗</span>
                        <span>Mối quan hệ</span>
                      </div>
                      <div className="font-medium">
                        {RELATIONSHIP_ICONS[related.relationship_type]} {RELATIONSHIP_LABELS[related.relationship_type]}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>⚧️</span>
                        <span>Giới tính</span>
                      </div>
                      <div className="font-medium">{related.gender || 'Nữ'}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Ngày sinh</span>
                      </div>
                      <div className="font-medium">{formatDate(related.birth_date)}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>Số điện thoại</span>
                      </div>
                      <div className="font-medium">{related.phone || 'Chưa có'}</div>
                    </div>
                  </div>

                  {/* Border separator */}
                  <div className="my-6 border-t-2 border-gray-200"></div>

                  {/* Thông tin khách hàng chính */}
                  <div>
                    <div className="text-sm font-medium mb-3">Thông tin khách hàng chính</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">Mã KH:</span>
                        <span className="font-medium">{customer?.code || customer?.id} ({customer?.name})</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">SĐT:</span>
                        <span className="font-medium">{customer?.phone}</span>
                      </div>
                      <div className="flex gap-4">
                        <span className="text-muted-foreground">Nhóm:</span>
                        <span className="font-medium">{customer?.group || customer?.groups || 'Khách lẻ'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Border separator */}
              <div className="border-t-2 border-orange-400"></div>

              {/* Phần Hình ảnh */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>📸</span>
                  <span>Hình ảnh</span>
                </h3>
                <RelatedAvatarGallery related={related} onUpdate={onUpdate} readOnly={true} />
              </div>

              {/* Border separator */}
              <div className="border-t-2 border-orange-400"></div>

              {/* Phần Hóa đơn */}
              <div>
                <h3 className="text-lg font-semibold mb-4">📄 Hóa đơn</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-4xl mb-2">📋</div>
                  <div className="text-gray-500">Chưa có hóa đơn nào</div>
                </div>
              </div>

              {/* Nút Xóa và Sửa thông tin */}
              <div className="flex justify-center gap-3 pt-4">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Xóa người thân
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    onOpenChange(false); // Đóng modal READ trước
                    setIsEditOpen(true); // Mở modal EDIT
                  }}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa thông tin
                </Button>
              </div>
            </TabsContent>

            {/* Tab 2: Hóa đơn */}
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
