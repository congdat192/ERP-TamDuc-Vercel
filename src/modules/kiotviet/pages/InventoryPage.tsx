import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { KiotVietService } from '@/services/kiotvietService';
import { Search, Boxes, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function InventoryPage() {
  const [search, setSearch] = useState('');

  // Fetch products with inventory
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['kiotviet-products-inventory'],
    queryFn: () => KiotVietService.getProducts({ pageSize: 100 })
  });

  // Fetch total inventory value
  const { data: totalValue = 0 } = useQuery({
    queryKey: ['kiotviet-inventory-value'],
    queryFn: KiotVietService.getTotalInventoryValue
  });

  const filteredProducts = productsData?.products?.filter((product: any) =>
    (product.full_name || product.name).toLowerCase().includes(search.toLowerCase()) ||
    product.code.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStockStatus = (on_hand: number) => {
    if (on_hand === 0) return { icon: Minus, label: 'Hết hàng', variant: 'destructive' as const, color: 'text-red-500' };
    if (on_hand < 10) return { icon: TrendingDown, label: 'Sắp hết', variant: 'secondary' as const, color: 'text-orange-500' };
    return { icon: TrendingUp, label: 'Còn hàng', variant: 'default' as const, color: 'text-green-500' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Boxes className="h-8 w-8" />
          Tồn kho KiotViet
        </h1>
        <p className="text-muted-foreground mt-1">
          Theo dõi tồn kho sản phẩm từ KiotViet
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng giá trị tồn</p>
                <p className="text-2xl font-bold mt-1">{formatPrice(totalValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng sản phẩm</p>
                <p className="text-2xl font-bold mt-1">{filteredProducts.length}</p>
              </div>
              <Boxes className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sắp hết hàng</p>
                <p className="text-2xl font-bold mt-1 text-orange-500">
                  {filteredProducts.filter((p: any) => (p.on_hand || 0) > 0 && (p.on_hand || 0) < 10).length}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Danh sách tồn kho</span>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Boxes className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Không tìm thấy sản phẩm</p>
              <p className="text-sm mt-1">Vui lòng đồng bộ dữ liệu từ KiotViet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SP</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-right">Tồn kho</TableHead>
                  <TableHead className="text-right">Giá vốn</TableHead>
                  <TableHead className="text-right">Giá trị tồn</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product: any) => {
                  const status = getStockStatus(product.on_hand || 0);
                  const StatusIcon = status.icon;
                  const inventoryValue = (product.on_hand || 0) * (product.base_price || 0);
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-sm">
                        {product.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.full_name || product.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold ${status.color}`}>
                          {product.on_hand || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {formatPrice(product.base_price || 0)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(inventoryValue)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={status.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
