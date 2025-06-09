
import { useState } from 'react';
import { ThemedCustomerStats } from '../components/ThemedCustomerStats';
import { CustomerSearchActions } from '../components/CustomerSearchActions';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerTable } from '../components/CustomerTable';
import { ColumnConfig } from '../components/ColumnVisibilityFilter';

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Đầy đủ 27 cột khách hàng
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'customerCode', label: 'Mã khách hàng', visible: true },
    { key: 'customerName', label: 'Tên khách hàng', visible: true },
    { key: 'customerType', label: 'Loại khách hàng', visible: true },
    { key: 'phone', label: 'Điện thoại', visible: true },
    { key: 'customerGroup', label: 'Nhóm khách hàng', visible: true },
    { key: 'gender', label: 'Giới tính', visible: false },
    { key: 'birthDate', label: 'Ngày sinh', visible: false },
    { key: 'email', label: 'Email', visible: true },
    { key: 'facebook', label: 'Facebook', visible: false },
    { key: 'company', label: 'Công ty', visible: false },
    { key: 'taxCode', label: 'Mã số thuế', visible: false },
    { key: 'idNumber', label: 'Số CCCD/CMND', visible: false },
    { key: 'address', label: 'Địa chỉ', visible: false },
    { key: 'deliveryArea', label: 'Khu vực giao hàng', visible: false },
    { key: 'ward', label: 'Phường/Xã', visible: false },
    { key: 'creator', label: 'Người tạo', visible: false },
    { key: 'createDate', label: 'Ngày tạo', visible: true },
    { key: 'notes', label: 'Ghi chú', visible: false },
    { key: 'lastTransactionDate', label: 'Ngày giao dịch cuối', visible: true },
    { key: 'createBranch', label: 'Chi nhánh tạo', visible: false },
    { key: 'currentDebt', label: 'Nợ hiện tại', visible: false },
    { key: 'debtDays', label: 'Số ngày nợ', visible: false },
    { key: 'totalSales', label: 'Tổng bán', visible: true },
    { key: 'currentPoints', label: 'Điểm hiện tại', visible: false },
    { key: 'totalPoints', label: 'Tổng điểm', visible: false },
    { key: 'totalSalesMinusReturns', label: 'Tổng bán trừ trả hàng', visible: false },
    { key: 'status', label: 'Trạng thái', visible: true }
  ]);

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    setColumns(prev => 
      prev.map(col => 
        col.key === columnKey ? { ...col, visible } : col
      )
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold theme-text">Quản Lý Khách Hàng</h1>
          <p className="theme-text-muted mt-1">Theo dõi và quản lý thông tin khách hàng</p>
        </div>
      </div>

      <ThemedCustomerStats />
      
      <CustomerSearchActions 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        columns={columns}
        handleColumnToggle={handleColumnToggle}
      />
      
      <CustomerFilters />
      
      <CustomerTable 
        searchTerm={searchTerm}
        visibleColumns={columns.filter(col => col.visible)}
      />
    </div>
  );
}
