
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Filter, RotateCcw, Plus } from 'lucide-react';
import { User } from '@/types/auth';

interface VoucherListProps {
  currentUser: User;
}

export function VoucherList({ currentUser }: VoucherListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isReissueDialogOpen, setIsReissueDialogOpen] = useState(false);
  const [reissuePhone, setReissuePhone] = useState('');
  const [reissueReason, setReissueReason] = useState('');

  // Mock empty voucher list - no sample data as requested
  const vouchers: any[] = [];

  const canViewAllVouchers = currentUser.permissions.canViewAllVouchers || 
    currentUser.role === 'erp-admin' || 
    currentUser.role === 'voucher-admin';

  const handleReissueVoucher = () => {
    if (!reissuePhone.trim()) {
      alert('Vui lòng nhập số điện thoại khách hàng');
      return;
    }
    
    console.log('Re-issuing voucher for phone:', reissuePhone);
    console.log('Reason:', reissueReason);
    console.log('Re-issued by:', currentUser.fullName);
    
    // Reset form
    setReissuePhone('');
    setReissueReason('');
    setIsReissueDialogOpen(false);
    
    alert('Voucher đã được cấp lại thành công!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold theme-text">Danh Sách Voucher</h2>
          <p className="theme-text-muted">
            {canViewAllVouchers 
              ? 'Quản lý tất cả voucher trong hệ thống' 
              : 'Voucher do bạn phát hành'}
          </p>
        </div>
        <Dialog open={isReissueDialogOpen} onOpenChange={setIsReissueDialogOpen}>
          <DialogTrigger asChild>
            <Button className="voucher-button-primary">
              <RotateCcw className="w-4 h-4 mr-2" />
              Cấp Lại Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md voucher-card">
            <DialogHeader>
              <DialogTitle className="theme-text">Cấp Lại Voucher Cho Khách Hàng</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reissue-phone" className="theme-text">Số Điện Thoại Khách Hàng *</Label>
                <Input
                  id="reissue-phone"
                  placeholder="Nhập số điện thoại"
                  value={reissuePhone}
                  onChange={(e) => setReissuePhone(e.target.value)}
                  className="theme-border-primary/20"
                />
              </div>
              <div>
                <Label htmlFor="reissue-reason" className="theme-text">Lý Do Cấp Lại</Label>
                <Textarea
                  id="reissue-reason"
                  placeholder="Ví dụ: Khách hàng mất voucher gốc"
                  value={reissueReason}
                  onChange={(e) => setReissueReason(e.target.value)}
                  className="theme-border-primary/20"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsReissueDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleReissueVoucher} className="voucher-button-primary">
                  Cấp Lại Voucher
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card className="voucher-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo mã voucher, tên khách hàng, số điện thoại..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 theme-border-primary/20"
                />
              </div>
            </div>
            <Button variant="outline" className="whitespace-nowrap theme-border-primary/20">
              <Filter className="w-4 h-4 mr-2" />
              Bộ Lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <Card className="voucher-card">
        <CardContent className="py-12">
          <div className="text-center">
            <div className="w-16 h-16 theme-bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 theme-text-primary" />
            </div>
            <h3 className="text-lg font-medium theme-text mb-2">
              Chưa Có Voucher Nào
            </h3>
            <p className="theme-text-muted mb-4">
              {canViewAllVouchers 
                ? 'Hệ thống chưa có voucher nào được phát hành.' 
                : 'Bạn chưa phát hành voucher nào.'}
            </p>
            <Badge className="theme-badge-secondary text-sm">
              Vai trò: {currentUser.role === 'erp-admin' ? 'Quản Trị ERP' :
                       currentUser.role === 'voucher-admin' ? 'Quản Lý Voucher' :
                       currentUser.role === 'telesales' ? 'Nhân Viên Telesales' : 'Tùy Chỉnh'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
