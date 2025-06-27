
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, Eye, Edit, Trash2, Copy, Star, Archive, 
  Download, Upload, Share, History, Filter, Calendar 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BulkOperationsBar, BulkSelectCheckbox, BulkSelectHeader } from '@/components/ui/bulk-operations';

interface SavedFilter {
  id: string;
  name: string;
  description: string;
  conditions: string;
  customerCount: number;
  createdBy: string;
  createdDate: string;
  lastUsed: string;
  usageCount: number;
  isStarred: boolean;
  isArchived: boolean;
  tags: string[];
}

const mockSavedFilters: SavedFilter[] = [
  {
    id: '1',
    name: 'Khách hàng VIP chưa sử dụng voucher',
    description: 'Khách hàng VIP có voucher chưa sử dụng trong 30 ngày qua',
    conditions: 'Nhóm KH = VIP AND Voucher chưa sử dụng > 0 AND Tạo voucher >= 30 ngày',
    customerCount: 156,
    createdBy: 'Nguyễn Văn A',
    createdDate: '2024-06-15',
    lastUsed: '2024-06-20',
    usageCount: 12,
    isStarred: true,
    isArchived: false,
    tags: ['vip', 'voucher', 'chưa sử dụng']
  },
  {
    id: '2',
    name: 'Khách hàng mới trong tháng',
    description: 'Tất cả khách hàng đăng ký trong 30 ngày gần đây',
    conditions: 'Ngày tạo >= 30 ngày AND Trạng thái = Hoạt động',
    customerCount: 89,
    createdBy: 'Trần Thị B',
    createdDate: '2024-06-10',
    lastUsed: '2024-06-19',
    usageCount: 8,
    isStarred: false,
    isArchived: false,
    tags: ['mới', 'tháng hiện tại']
  },
  {
    id: '3',
    name: 'Khách hàng chi tiêu cao',
    description: 'KH có tổng chi tiêu > 5 triệu trong 6 tháng',
    conditions: 'Tổng chi tiêu >= 5000000 AND Thời gian >= 6 tháng',
    customerCount: 234,
    createdBy: 'Lê Văn C',
    createdDate: '2024-05-20',
    lastUsed: '2024-06-18',
    usageCount: 25,
    isStarred: true,
    isArchived: false,
    tags: ['chi tiêu cao', 'vip']
  }
];

export function SavedFiltersTab() {
  const [filters, setFilters] = useState(mockSavedFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>([]);

  const filteredFilters = filters.filter(filter =>
    filter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    filter.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImportFilters = () => {
    toast({
      title: "Nhập bộ lọc",
      description: "Mở trình nhập bộ lọc từ file",
    });
  };

  const handleExportAll = () => {
    toast({
      title: "Xuất tất cả bộ lọc",
      description: `Đã xuất ${filters.length} bộ lọc`,
    });
  };

  const handleShareFilter = (filter: SavedFilter) => {
    toast({
      title: "Chia sẻ bộ lọc",
      description: `Tạo liên kết chia sẻ cho "${filter.name}"`,
    });
  };

  const handleToggleStar = (filterId: string) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, isStarred: !filter.isStarred }
        : filter
    ));
  };

  const handleArchive = (filterId: string) => {
    setFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, isArchived: !filter.isArchived }
        : filter
    ));
    
    const filter = filters.find(f => f.id === filterId);
    toast({
      title: filter?.isArchived ? "Khôi phục bộ lọc" : "Lưu trữ bộ lọc",
      description: `"${filter?.name}" đã được ${filter?.isArchived ? 'khôi phục' : 'lưu trữ'}`,
    });
  };

  const handleUseFilter = (filter: SavedFilter) => {
    // Update usage count
    setFilters(prev => prev.map(f => 
      f.id === filter.id 
        ? { ...f, usageCount: f.usageCount + 1, lastUsed: new Date().toISOString().split('T')[0] }
        : f
    ));
    
    toast({
      title: "Áp dụng bộ lọc",
      description: `Đã áp dụng bộ lọc "${filter.name}"`,
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
    setSelectedFilterIds(filteredFilters.map(filter => filter.id));
  };

  const handleDeselectAll = () => {
    setSelectedFilterIds([]);
  };

  const handleBulkArchive = () => {
    setFilters(prev => prev.map(filter => 
      selectedFilterIds.includes(filter.id)
        ? { ...filter, isArchived: !filter.isArchived }
        : filter
    ));
    setSelectedFilterIds([]);
    toast({
      title: "Lưu trữ hàng loạt",
      description: `Đã lưu trữ ${selectedFilterIds.length} bộ lọc`,
    });
  };

  const handleBulkDelete = () => {
    setFilters(prev => prev.filter(filter => !selectedFilterIds.includes(filter.id)));
    setSelectedFilterIds([]);
    toast({
      title: "Xóa thành công",
      description: `Đã xóa ${selectedFilterIds.length} bộ lọc`,
    });
  };

  const handleBulkExport = () => {
    const selectedFilters = filters.filter(filter => 
      selectedFilterIds.includes(filter.id)
    );
    
    toast({
      title: "Xuất bộ lọc đã chọn",
      description: `Đã xuất ${selectedFilters.length} bộ lọc`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold theme-text">Bộ lọc đã lưu</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleImportFilters} variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Nhập bộ lọc
          </Button>
          <Button onClick={handleExportAll} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất tất cả
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Chia sẻ
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm bộ lọc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">{filteredFilters.length} bộ lọc</Badge>
      </div>

      <BulkOperationsBar
        selectedCount={selectedFilterIds.length}
        totalCount={filteredFilters.length}
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
                  totalCount={filteredFilters.length}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                />
              </TableHead>
              <TableHead className="font-medium">Tên bộ lọc</TableHead>
              <TableHead className="font-medium">Mô tả</TableHead>
              <TableHead className="font-medium">Số KH</TableHead>
              <TableHead className="font-medium">Người tạo</TableHead>
              <TableHead className="font-medium">Sử dụng gần nhất</TableHead>
              <TableHead className="font-medium">Số lần sử dụng</TableHead>
              <TableHead className="font-medium">Tags</TableHead>
              <TableHead className="font-medium">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFilters.map((filter) => (
              <TableRow key={filter.id} className="hover:bg-gray-50">
                <TableCell>
                  <BulkSelectCheckbox
                    checked={selectedFilterIds.includes(filter.id)}
                    onChange={(checked) => handleSelectFilter(filter.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStar(filter.id)}
                      className="p-1 h-auto"
                    >
                      <Star 
                        className={`w-4 h-4 ${filter.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                      />
                    </Button>
                    <span className="font-medium">{filter.name}</span>
                    {filter.isArchived && (
                      <Badge variant="secondary" className="text-xs">Đã lưu trữ</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs">
                  <span className="text-sm text-gray-600 truncate block">
                    {filter.description}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{filter.customerCount.toLocaleString()}</Badge>
                </TableCell>
                <TableCell>{filter.createdBy}</TableCell>
                <TableCell>{new Date(filter.lastUsed).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{filter.usageCount}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {filter.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {filter.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{filter.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button
                      size="sm"
                      onClick={() => handleUseFilter(filter)}
                      className="h-8 px-2 voucher-button-primary"
                    >
                      <Filter className="w-3 h-3 mr-1" />
                      Sử dụng
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleShareFilter(filter)}
                      className="h-8 px-2"
                    >
                      <Share className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleArchive(filter.id)}
                      className="h-8 px-2"
                    >
                      <Archive className="w-3 h-3" />
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
