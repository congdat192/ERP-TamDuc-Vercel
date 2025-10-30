import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { KiotVietProductsFullService } from '@/services/kiotvietProductsFullService';
import { Switch } from '@/components/ui/switch';
import { Search, Package, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [trademarkId, setTrademarkId] = useState<number | undefined>();
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [overstockOnly, setOverstockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ['kiotviet-categories-full'],
    queryFn: KiotVietProductsFullService.getCategories
  });

  // Fetch trademarks for filter
  const { data: trademarks = [] } = useQuery({
    queryKey: ['kiotviet-trademarks-full'],
    queryFn: KiotVietProductsFullService.getTrademarks
  });

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['kiotviet-products-full', { categoryId, trademarkId, search, lowStockOnly, overstockOnly, page }],
    queryFn: () => KiotVietProductsFullService.getProducts({
      categoryIds: categoryId ? [categoryId] : undefined,
      trademarkIds: trademarkId ? [trademarkId] : undefined,
      search: search || undefined,
      lowStock: lowStockOnly,
      overstock: overstockOnly,
      page,
      pageSize
    })
  });

  const products = productsData?.products || [];
  const totalPages = Math.ceil((productsData?.total || 0) / pageSize);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8" />
          Sản phẩm KiotViet
        </h1>
        <p className="text-muted-foreground mt-1">
          Quản lý sản phẩm đã đồng bộ từ KiotViet
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              
              <Select
                value={categoryId?.toString() || 'all'}
                onValueChange={(value) => {
                  setCategoryId(value === 'all' ? undefined : Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhóm hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nhóm hàng</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={trademarkId?.toString() || 'all'}
                onValueChange={(value) => {
                  setTrademarkId(value === 'all' ? undefined : Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thương hiệu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thương hiệu</SelectItem>
                  {trademarks.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={lowStockOnly} onCheckedChange={setLowStockOnly} />
                  <span className="text-sm">Tồn kho thấp</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={overstockOnly} onCheckedChange={setOverstockOnly} />
                  <span className="text-sm">Tồn kho dư</span>
                </label>
              </div>

              <Button 
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setCategoryId(undefined);
                  setTrademarkId(undefined);
                  setLowStockOnly(false);
                  setOverstockOnly(false);
                  setPage(1);
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Không tìm thấy sản phẩm</p>
              <p className="text-sm mt-1">Vui lòng đồng bộ dữ liệu từ KiotViet</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã SP</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Nhóm hàng</TableHead>
                    <TableHead>Thương hiệu</TableHead>
                    <TableHead className="text-right">Giá bán</TableHead>
                    <TableHead className="text-right">Tồn kho</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-sm">
                        {product.code}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.full_name || product.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product.category_name || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product.trademark_name || '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(product.base_price)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={product.total_on_hand > 0 ? "default" : "secondary"}>
                          {product.total_on_hand || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {product.is_active ? (
                          <Badge variant="success">Đang bán</Badge>
                        ) : (
                          <Badge variant="secondary">Ngừng bán</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages} • Tổng {productsData?.total || 0} sản phẩm
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
