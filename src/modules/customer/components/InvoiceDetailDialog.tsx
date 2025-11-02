import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceDetail {
  productcode: string;
  productname: string;
  quantity: number;
  price: number;
  discount: number;
  discountratio: number;
  subtotal: number;
  final_price: number;
  total_price: number;
}

interface Invoice {
  code: string;
  createddate: string;
  soldbyname: string;
  branchname: string;
  total: number;
  totalpayment: number;
  status: number;
  statusvalue: string;
  description?: string;
  eye_prescription?: string;
  details: InvoiceDetail[];
}

interface Customer {
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

interface InvoiceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  customer: Customer | null;
}

export function InvoiceDetailDialog({ open, onOpenChange, invoice, customer }: InvoiceDetailDialogProps) {
  const [isEyePrescriptionZoomOpen, setIsEyePrescriptionZoomOpen] = useState(false);

  if (!invoice || !customer) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (statusvalue: string) => {
    switch (statusvalue) {
      case 'Completed':
      case 'Hoàn thành':
        return <Badge className="theme-badge-success">{statusvalue}</Badge>;
      case 'Đang xử lý':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">{statusvalue}</Badge>;
      case 'Đã hủy':
        return <Badge className="berry-error-light">{statusvalue}</Badge>;
      default:
        return <Badge variant="secondary">{statusvalue}</Badge>;
    }
  };

  const calculateItemTotal = (item: InvoiceDetail) => {
    return item.quantity * item.price - item.discount;
  };

  const totalDiscount = invoice.total - invoice.totalpayment;
  const totalQuantity = invoice.details.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <DialogTitle className="text-2xl font-bold">Hóa đơn</DialogTitle>
              </div>
            </div>
          </DialogHeader>

          {/* Header Info */}
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="theme-text font-medium">{customer.name}</span>
                <ExternalLink className="w-4 h-4 theme-text-primary cursor-pointer" />
              </div>
              <span className="theme-text-primary font-semibold">{invoice.code}</span>
              {getStatusBadge(invoice.statusvalue)}
            </div>
            <div className="text-right">
              <div className="theme-text font-medium">{invoice.branchname}</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-4 py-4 text-sm">
            <div>
              <span className="theme-text-muted">Người tạo:</span>
              <span className="ml-2 theme-text">{invoice.soldbyname}</span>
            </div>
            <div>
              <span className="theme-text-muted">Người bán:</span>
              <span className="ml-2 theme-text">{invoice.soldbyname}</span>
            </div>
            <div>
              <span className="theme-text-muted">Ngày bán:</span>
              <span className="ml-2 theme-text">{formatDate(invoice.createddate || (invoice as any).created_at_vn)}</span>
            </div>
            <div>
              <span className="theme-text-muted">Kênh bán:</span>
              <span className="ml-2 theme-text">Bán trực tiếp</span>
            </div>
            <div>
              <span className="theme-text-muted">Bảng giá:</span>
              <span className="ml-2 theme-text">Bảng giá chung</span>
            </div>
          </div>

          {/* Products Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left theme-text font-medium">Mã hàng</th>
                  <th className="px-3 py-2 text-left theme-text font-medium">Tên hàng</th>
                  <th className="px-3 py-2 text-center theme-text font-medium">Số lượng</th>
                  <th className="px-3 py-2 text-right theme-text font-medium">Đơn giá</th>
                  <th className="px-3 py-2 text-right theme-text font-medium">Giảm giá</th>
                  <th className="px-3 py-2 text-right theme-text font-medium">Giá bán</th>
                  <th className="px-3 py-2 text-right theme-text font-medium">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoice.details.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <span className="theme-text-primary font-medium">{item.productcode}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="theme-text">{item.productname}</div>
                      {item.productname.includes('kính nhìn') && (
                        <div className="text-xs theme-text-muted italic mt-1">kính nhìn gần</div>
                      )}
                      {item.productname.includes('kính nhìn xa') && (
                        <div className="text-xs theme-text-muted italic mt-1">kính nhìn xa</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center theme-text">{item.quantity}</td>
                    <td className="px-3 py-3 text-right theme-text">{formatCurrency(item.price)}</td>
                    <td className="px-3 py-3 text-right">
                      <div className="theme-text">{formatCurrency(item.discount)}</div>
                      {item.discountratio > 0 && (
                        <div className="text-xs theme-text-muted">{item.discountratio}%</div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right theme-text">
                      {formatCurrency(item.price - (item.discount / item.quantity))}
                    </td>
                    <td className="px-3 py-3 text-right theme-text font-medium">
                      {formatCurrency(calculateItemTotal(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Eye Prescription Thumbnail */}
          {invoice.eye_prescription && (
            <div className="border rounded-lg p-4 mt-4 bg-gray-50">
              <h4 className="text-sm font-semibold theme-text mb-3">📋 Đơn thuốc kính</h4>
              <div 
                className="relative w-32 h-32 mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setIsEyePrescriptionZoomOpen(true)}
                title="Click để phóng to"
              >
                <img 
                  src={invoice.eye_prescription} 
                  alt="Đơn thuốc kính thumbnail"
                  className="w-full h-full object-cover rounded border border-gray-200 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x128?text=No+Image';
                  }}
                />
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="flex justify-between items-start pt-4 border-t">
            {invoice.description && (
              <div className="flex items-start space-x-2">
                <Edit className="w-4 h-4 theme-text-muted mt-1" />
                <div className="text-sm theme-text-muted italic">
                  Ghi chú: {invoice.description}
                </div>
              </div>
            )}
            
            <div className="space-y-2 min-w-[300px]">
              <div className="flex justify-between text-sm">
                <span className="theme-text-muted">Tổng tiền hàng ({totalQuantity})</span>
                <span className="theme-text font-medium">{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="theme-text-muted">Giảm giá hóa đơn</span>
                <span className="theme-text font-medium">{formatCurrency(totalDiscount)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 border-t">
                <span className="theme-text">Khách cần trả</span>
                <span className="theme-text-primary">{formatCurrency(invoice.totalpayment)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span className="theme-text">Khách đã trả</span>
                <span className="theme-text-primary">{formatCurrency(invoice.totalpayment)}</span>
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button className="voucher-button-primary">
              <ExternalLink className="w-4 h-4 mr-2" />
              Mở phiếu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Eye Prescription Zoom Dialog */}
      <Dialog open={isEyePrescriptionZoomOpen} onOpenChange={setIsEyePrescriptionZoomOpen}>
        <DialogContent className="max-w-3xl">
          <div className="flex flex-col items-center space-y-4 p-4">
            {invoice?.eye_prescription ? (
              <div className="relative overflow-hidden rounded-xl shadow-2xl border-4 border-white">
                <img
                  src={invoice.eye_prescription}
                  alt="Đơn thuốc kính"
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Error+Loading+Image';
                  }}
                />
              </div>
            ) : (
              <div className="w-64 h-64 rounded-xl shadow-2xl border-4 border-white bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Không có ảnh</span>
              </div>
            )}
            
            <div className="text-center">
              <h3 className="text-lg font-semibold theme-text">Đơn thuốc kính</h3>
              <p className="text-sm theme-text-muted">Hóa đơn: {invoice?.code}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
