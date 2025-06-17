
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { AdvancedFilterBuilder } from '../components/AdvancedFilterBuilder';
import { ActionHistoryPanel } from '../components/ActionHistoryPanel';
import { AdvancedFilter, FilterResult } from '../types/filter';
import { FilterProcessor } from '../utils/filterProcessor';
import { mockCustomers } from '@/data/mockData';

export function CustomerSegmentation() {
  const [filter, setFilter] = useState<AdvancedFilter>({
    id: 'default',
    logic: 'and',
    groups: [{
      id: 'group1',
      logic: 'and',
      conditions: [{
        id: 'condition1',
        field: '',
        operator: 'equals',
        value: ''
      }]
    }],
    createdAt: new Date().toISOString()
  });

  const [filterResult, setFilterResult] = useState<FilterResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showActionHistory, setShowActionHistory] = useState(false);

  const executeFilter = async () => {
    setIsExecuting(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = FilterProcessor.executeFilter(filter);
      setFilterResult(result);
    } catch (error) {
      console.error('Filter execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const saveFilter = () => {
    // This is now handled by the AdvancedFilterBuilder component
    console.log('Save filter triggered from legacy handler');
  };

  const exportResults = () => {
    if (!filterResult) return;
    
    // TODO: Implement Excel export
    console.log('Exporting results:', filterResult);
  };

  const getFilteredCustomers = () => {
    if (!filterResult) return [];
    
    return filterResult.customers
      .map(id => mockCustomers.find(c => c.id === id))
      .filter(Boolean)
      .slice(0, 50); // Limit to 50 for performance
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold theme-text">Phân Khúc Khách Hàng</h1>
          <p className="theme-text-muted">Lọc và phân tích khách hàng theo điều kiện nâng cao</p>
        </div>
      </div>

      {/* Advanced Filter Builder */}
      <AdvancedFilterBuilder
        filter={filter}
        onUpdate={setFilter}
        onExecute={executeFilter}
        onSave={saveFilter}
        onExport={exportResults}
        isExecuting={isExecuting}
        resultCount={filterResult?.totalCount}
        customerIds={filterResult?.customers || []}
      />

      {/* Results Table */}
      {filterResult && (
        <Card className="theme-card">
          <CardHeader className="border-b theme-border-primary/20">
            <div className="flex items-center justify-between">
              <CardTitle className="theme-text">Kết Quả Lọc</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-4 text-sm theme-text-muted">
                  <span>Thời gian thực hiện: {filterResult.executionTime}ms</span>
                  <span>Tổng số: {filterResult.totalCount.toLocaleString()} khách hàng</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowActionHistory(!showActionHistory)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Lịch sử thao tác
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader className="sticky top-0 theme-bg-primary/5">
                  <TableRow>
                    <TableHead>Mã KH</TableHead>
                    <TableHead>Tên khách hàng</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Nhóm</TableHead>
                    <TableHead>Khu vực</TableHead>
                    <TableHead>Tổng chi tiêu</TableHead>
                    <TableHead>Điểm tích lũy</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getFilteredCustomers().map((customer) => (
                    <TableRow key={customer!.id} className="hover:theme-bg-primary/5">
                      <TableCell className="font-medium theme-text-primary">
                        {customer!.id}
                      </TableCell>
                      <TableCell className="font-medium theme-text">
                        {customer!.name}
                      </TableCell>
                      <TableCell className="theme-text">
                        {customer!.phone}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="theme-text">
                          {customer!.group}
                        </Badge>
                      </TableCell>
                      <TableCell className="theme-text">
                        {customer!.deliveryArea}
                      </TableCell>
                      <TableCell className="font-medium theme-text">
                        {formatCurrency(customer!.totalSpent)}
                      </TableCell>
                      <TableCell className="font-medium theme-text-primary">
                        {customer!.points.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={customer!.status === 'Hoạt động' ? 'default' : 'secondary'}
                          className={customer!.status === 'Hoạt động' ? 'berry-success' : 'berry-error'}
                        >
                          {customer!.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filterResult.totalCount > 50 && (
              <div className="p-4 border-t theme-border-primary/20 text-center">
                <p className="text-sm theme-text-muted">
                  Hiển thị 50/{filterResult.totalCount.toLocaleString()} khách hàng đầu tiên. 
                  Sử dụng tính năng xuất Excel để xem toàn bộ kết quả.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action History Panel */}
      <ActionHistoryPanel
        isOpen={showActionHistory}
        onClose={() => setShowActionHistory(false)}
      />
    </div>
  );
}
