import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Filter } from 'lucide-react';

interface CustomerFiltersProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function CustomerFilters({ sidebarOpen, setSidebarOpen }: CustomerFiltersProps) {
  const [filters, setFilters] = useState({
    customerGroup: '',
    customerType: '',
    status: '',
    creator: '',
    branch: '',
    dateFrom: '',
    dateTo: '',
    debtFrom: '',
    debtTo: '',
    area: ''
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      customerGroup: '',
      customerType: '',
      status: '',
      creator: '',
      branch: '',
      dateFrom: '',
      dateTo: '',
      debtFrom: '',
      debtTo: '',
      area: ''
    });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 theme-card border-r theme-border-primary">
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold theme-text flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs voucher-text-primary hover:voucher-bg-primary/10"
            >
              Xóa bộ lọc
            </Button>
          </div>

          <div className="space-y-4">
            {/* Customer Group Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Nhóm khách hàng</Label>
              <select
                value={filters.customerGroup}
                onChange={(e) => handleFilterChange('customerGroup', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả nhóm</option>
                <option value="vip">VIP</option>
                <option value="gioi-thieu">Giới thiệu</option>
                <option value="moi">Khách hàng mới</option>
                <option value="thuong-xuyen">Thường xuyên</option>
              </select>
            </div>

            {/* Customer Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Loại khách hàng</Label>
              <select
                value={filters.customerType}
                onChange={(e) => handleFilterChange('customerType', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả loại</option>
                <option value="ca-nhan">Cá nhân</option>
                <option value="doanh-nghiep">Doanh nghiệp</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Trạng thái</Label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </div>

            {/* Creator Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Người tạo</Label>
              <select
                value={filters.creator}
                onChange={(e) => handleFilterChange('creator', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả người tạo</option>
                <option value="admin">Admin</option>
                <option value="staff">Nhân viên</option>
                <option value="manager">Quản lý</option>
              </select>
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Chi nhánh</Label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả chi nhánh</option>
                <option value="hcm">Chi nhánh HCM</option>
                <option value="hanoi">Chi nhánh Hà Nội</option>
                <option value="danang">Chi nhánh Đà Nẵng</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Ngày tạo</Label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="voucher-input border-voucher-primary focus:ring-voucher-primary focus:border-voucher-primary"
                  placeholder="Từ ngày"
                />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="voucher-input border-voucher-primary focus:ring-voucher-primary focus:border-voucher-primary"
                  placeholder="Đến ngày"
                />
              </div>
            </div>

            {/* Debt Range */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Công nợ (VNĐ)</Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={filters.debtFrom}
                  onChange={(e) => handleFilterChange('debtFrom', e.target.value)}
                  className="voucher-input border-voucher-primary focus:ring-voucher-primary focus:border-voucher-primary"
                  placeholder="Từ"
                />
                <Input
                  type="number"
                  value={filters.debtTo}
                  onChange={(e) => handleFilterChange('debtTo', e.target.value)}
                  className="voucher-input border-voucher-primary focus:ring-voucher-primary focus:border-voucher-primary"
                  placeholder="Đến"
                />
              </div>
            </div>

            {/* Area Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Khu vực</Label>
              <select
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả khu vực</option>
                <option value="quan-1">Quận 1</option>
                <option value="quan-2">Quận 2</option>
                <option value="quan-3">Quận 3</option>
                <option value="tan-binh">Tân Bình</option>
                <option value="binh-thanh">Bình Thạnh</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 theme-card transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
        <div className="flex items-center justify-between p-4 border-b theme-border-primary">
          <h3 className="font-semibold theme-text flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Bộ lọc
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="hover:voucher-bg-primary/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4 h-full overflow-y-auto">
          {/* Same filter content as desktop */}
          <div className="space-y-4">
            {/* Customer Group Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Nhóm khách hàng</Label>
              <select
                value={filters.customerGroup}
                onChange={(e) => handleFilterChange('customerGroup', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả nhóm</option>
                <option value="vip">VIP</option>
                <option value="gioi-thieu">Giới thiệu</option>
                <option value="moi">Khách hàng mới</option>
                <option value="thuong-xuyen">Thường xuyên</option>
              </select>
            </div>

            {/* Customer Type Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Loại khách hàng</Label>
              <select
                value={filters.customerType}
                onChange={(e) => handleFilterChange('customerType', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả loại</option>
                <option value="ca-nhan">Cá nhân</option>
                <option value="doanh-nghiep">Doanh nghiệp</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Trạng thái</Label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </div>

            {/* Creator Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Người tạo</Label>
              <select
                value={filters.creator}
                onChange={(e) => handleFilterChange('creator', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả người tạo</option>
                <option value="admin">Admin</option>
                <option value="staff">Nhân viên</option>
                <option value="manager">Quản lý</option>
              </select>
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Chi nhánh</Label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả chi nhánh</option>
                <option value="hcm">Chi nhánh HCM</option>
                <option value="hanoi">Chi nhánh Hà Nội</option>
                <option value="danang">Chi nhánh Đà Nẵng</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Ngày tạo</Label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="voucher-input border-voucher-primary focus:ring-voucher-primary focus:border-voucher-primary"
                  placeholder="Từ ngày"
                />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="voucher-input border-voucher-primary focus:ring-voucher-primary focus:border-voucher-primary"
                  placeholder="Đến ngày"
                />
              </div>
            </div>

            {/* Debt Range */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Công nợ (VNĐ)</Label>
              <div className="space-y-2">
                <Input
                  type="number"
                  value={filters.debtFrom}
                  onChange={(e) => handleFilterChange('debtFrom', e.target.value)}
                  className="voucher-input border-voucher-primary focus:ring-voucher-primary focus:border-voucher-primary"
                  placeholder="Từ"
                />
                <Input
                  type="number"
                  value={filters.debtTo}
                  onChange={(e) => handleFilterChange('debtTo', e.target.value)}
                  className="voucher-input border-voucher-primary focus:ring-voucher-primary focus:border-voucher-primary"
                  placeholder="Đến"
                />
              </div>
            </div>

            {/* Area Filter */}
            <div className="space-y-2">
              <Label className="text-sm theme-text-muted">Khu vực</Label>
              <select
                value={filters.area}
                onChange={(e) => handleFilterChange('area', e.target.value)}
                className="w-full px-3 py-2 text-sm border voucher-border-primary rounded-md bg-white theme-text focus:outline-none focus:ring-2 focus:ring-voucher-primary focus:border-voucher-primary hover:border-voucher-primary/60 transition-colors"
              >
                <option value="">Tất cả khu vực</option>
                <option value="quan-1">Quận 1</option>
                <option value="quan-2">Quận 2</option>
                <option value="quan-3">Quận 3</option>
                <option value="tan-binh">Tân Bình</option>
                <option value="binh-thanh">Bình Thạnh</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
