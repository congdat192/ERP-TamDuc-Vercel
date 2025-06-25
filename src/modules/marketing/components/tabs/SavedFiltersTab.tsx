import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Play, Edit, Trash2, Copy, Download, Upload, Archive, Share, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BulkOperationsBar, BulkSelectCheckbox, BulkSelectHeader } from '@/components/ui/bulk-operations';

interface SavedFilter {
  id: string;
  name: string;
  description: string;
  creator: string;
  createdDate: string;
  currentCustomerCount: number;
  lastUpdated: string;
  isActive: boolean;
}

const mockSavedFilters: SavedFilter[] = [
  {
    id: '1',
    name: 'Khách hàng VIP có voucher chưa sử dụng',
    description: 'Lọc khách hàng thuộc nhóm VIP và có ít nhất 1 voucher chưa sử dụng',
    creator: 'Nguyễn Văn Admin',
    createdDate: '2024-06-15',
    currentCustomerCount: 127,
    lastUpdated: '2024-06-24',
    isActive: true
  },
  {
    id: '2',
    name: 'Khách hàng mới trong 30 ngày',
    description: 'Tất cả khách hàng được tạo trong vòng 30 ngày qua',
    creator: 'Trần Thị Marketing',
    createdDate: '2024-06-10',
    currentCustomerCount: 89,
    lastUpdated: '2024-06-24',
    isActive: true
  },
  {
    id: '3',
    name: 'Khách hàng không hoạt động > 90 ngày',
    description: 'Khách hàng không có giao dịch nào trong 90 ngày gần đây',
    creator: 'Lê Văn Sales',
    createdDate: '2024-05-20',
    currentCustomerCount: 45,
    lastUpdated: '2024-06-20',
    isActive: false
  }
];

export function SavedFiltersTab() {
  const [savedFilters, setSavedFilters] = useState(mockSavedFilters);
  const [refreshingIds, setRefreshingIds] = useState<string[]>([]);
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>([]);

  const handleRefresh = async (filterId: string) => {
    setRefreshingIds(prev => [...prev, filterId]);
    try {
      // Simulate API call to refresh filter results
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSavedFilters(prev => prev.map(filter => 
        filter.id === filterId 
          ? { 
              ...filter, 
              currentCustomerCount: Math.floor(Math.random() * 200) + 50,
              lastUpdated: new Date().toISOString().split('T')[0]
            }
          : filter
      ));
      
      toast({
        title: "Đồng bộ thành công",
        description: "Đã cập nhật số lượng khách hàng mới nhất",
      });
    } catch (error) {
      toast({
        title: "Đồng bộ thất bại",
        description: "Có lỗi xảy ra khi cập nhật dữ liệu",
        variant: "destructive",
      });
    } finally {
      setRefreshingIds(prev => prev.filter(id => id !== filterId));
    }
  };

  const handleApply = (filter: SavedFilter) => {
    toast({
      title: "Áp dụng bộ lọc",
      description: `Đang áp dụng bộ lọc "${filter.name}"`,
    });
    // In real implementation, this would navigate to filter tab with applied filter
  };

  const handleEdit = (filter: SavedFilter) => {
    toast({
      title: "Chỉnh sửa bộ lọc",
      description: `Mở trình chỉnh sửa cho "${filter.name}"`,
    });
  };

  const handleDuplicate = (filter: SavedFilter) => {
    const duplicatedFilter: SavedFilter = {
      ...filter,
      id: Date.now().toString(),
      name: `${filter.name} (Copy)`,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setSavedFilters(prev => [...prev, duplicatedFilter]);
    toast({
      title: "Sao chép thành công",
      description: `Đã tạo bản sao của "${filter.name}"`,
    });
  };

  const handleDelete = (filterId: string) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== filterId));
    toast({
      title: "Xóa thành công",
      description: "Đã xóa bộ lọc khỏi danh sách",
    });
  };

  const handleExport = (filter: SavedFilter) => {
    // Mock export functionality
    const exportData = {
      filterName: filter.name,
      customerCount: filter.currentCustomerCount,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filter.name}.json`;
    a.click();
    
    toast({
      title: "Xuất dữ liệu",
      description: `Đã xuất dữ liệu bộ lọc "${filter.name}"`,
    });
  };

  const handleImportFilters = () => {
    toast({
      title: "Nhập bộ lọc",
      description: "Chọn file để nhập các bộ lọc đã lưu",
    });
  };

  const handleExportAll = () => {
    const exportData = savedFilters.map(filter => ({
      name: filter.name,
      description: filter.description,
      customerCount: filter.currentCustomerCount,
      isActive: filter.isActive
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-saved-filters.json';
    a.click();
    
    toast({
      title: "Xuất tất cả bộ lọc",
      description: `Đã xuất ${savedFilters.length} bộ lọc`,
    });
  };

  const handleShareFilters = () => {
    toast({
      title: "Chia sẻ bộ lọc",
      description: "Tạo liên kết chia sẻ cho các bộ lọc đã chọn",
    });
  };

  const handleArchive = (filterId: string) => {
    setSavedFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, isActive: false }
        : filter
    ));
    toast({
      title: "Lưu trữ bộ lọc",
      description: "Bộ lọc đã được chuyển vào lưu trữ",
    });
  };

  const handleFavorite = (filterId: string) => {
    toast({
      title: "Thêm vào yêu thích",
      description: "Bộ lọc đã được đánh dấu yêu thích",
    });
  };

  const handleSelectFilter = (filterId: string, selected: boolean) => {
    if (selected) {
      setSelectedFilterIds(prev => [...prev, filterId]);
    } else {
      setSelectedFilterIds(prev => prev.filter(id => id !== filterId));
    }
  };

  const handleSelectAll = () => {
    setSelectedFilterIds(savedFilters.map(filter => filter.id));
  };

  const handleDeselectAll = () => {
    setSelectedFilterIds([]);
  };

  const handleBulkDelete = () => {
    setSavedFilters(prev => prev.filter(filter => !selectedFilterIds.includes(filter.id)));
    setSelectedFilterIds([]);
    toast({
      title: "Xóa thành công",
      description: `Đã xóa ${selectedFilterIds.length} bộ lọc`,
    });
  };

  const handleBulkArchive = () => {
    setSavedFilters(prev => prev.map(filter => 
      selectedFilterIds.includes(filter.id) 
        ? { ...filter, isActive: false }
        : filter
    ));
    setSelectedFilterIds([]);
    toast({
      title: "Lưu trữ thành công",
      description: `Đã lưu trữ ${selectedFilterIds.length} bộ lọc`,
    });
  };

  const handleBulkExport = () => {
    const selectedFilters = savedFilters.filter(filter => 
      selectedFilterIds.includes(filter.id)
    );
    
    const exportData = selectedFilters.map(filter => ({
      name: filter.name,
      description: filter.description,
      customerCount: filter.currentCustomerCount
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-filters.json';
    a.click();
    
    toast({
      title: "Xuất bộ lọc đã chọn",
      description: `Đã xuất ${selectedFilters.length} bộ lọc`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold theme-text">Bộ lọc đã lưu</h2>
          <Badge variant="outline" className="theme-text">
            Tổng: {savedFilters.length} bộ lọc
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleImportFilters} variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Nhập
          </Button>
          <Button onClick={handleExportAll} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất tất cả
          </Button>
          <Button onClick={handleShareFilters} variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Chia sẻ
          </Button>
        </div>
      </div>

      <BulkOperationsBar
        selectedCount={selectedFilterIds.length}
        totalCount={savedFilters.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onBulkArchive={handleBulkArchive}
        entityName="bộ lọc"
      />

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <BulkSelectHeader
                  selectedCount={selectedFilterIds.length}
                  totalCount={savedFilters.length}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                />
              </TableHead>
              <TableHead className="font-medium">Tên bộ lọc</TableHead>
              <TableHead className="font-medium">Mô tả</TableHead>
              <TableHead className="font-medium">Người tạo</TableHead>
              <TableHead className="font-medium">Ngày tạo</TableHead>
              <TableHead className="font-medium">Số KH hiện tại</TableHead>
              <TableHead className="font-medium">Cập nhật cuối</TableHead>
              <TableHead className="font-medium">Trạng thái</TableHead>
              <TableHead className="font-medium">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedFilters.map((filter) => (
              <TableRow key={filter.id} className="hover:bg-gray-50">
                <TableCell>
                  <BulkSelectCheckbox
                    checked={selectedFilterIds.includes(filter.id)}
                    onChange={(checked) => handleSelectFilter(filter.id, checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">{filter.name}</TableCell>
                <TableCell className="max-w-xs truncate" title={filter.description}>
                  {filter.description}
                </TableCell>
                <TableCell>{filter.creator}</TableCell>
                <TableCell>{new Date(filter.createdDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold theme-text-primary">
                      {filter.currentCustomerCount.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRefresh(filter.id)}
                      disabled={refreshingIds.includes(filter.id)}
                      className="h-6 w-6 p-0"
                    >
                      <RefreshCw className={`w-3 h-3 ${refreshingIds.includes(filter.id) ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{new Date(filter.lastUpdated).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Badge 
                    className={filter.isActive 
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                    }
                  >
                    {filter.isActive ? 'Hoạt động' : 'Tạm dừng'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApply(filter)}
                      className="h-8 px-2"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleFavorite(filter.id)}
                      className="h-8 px-2"
                    >
                      <Star className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(filter)}
                      className="h-8 px-2"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(filter)}
                      className="h-8 px-2"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleArchive(filter.id)}
                      className="h-8 px-2"
                    >
                      <Archive className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleExport(filter)}
                      className="h-8 px-2"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(filter.id)}
                      className="h-8 px-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
