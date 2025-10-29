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
import { KiotVietService } from '@/services/kiotvietService';
import { Search, Package, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export function ProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch categories for filter
  const { data: categories = [] } = useQuery({
    queryKey: ['kiotviet-categories'],
    queryFn: KiotVietService.getCategories
  });

  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['kiotviet-products', { categoryId, search, page }],
    queryFn: () => KiotVietService.getProducts({
      categoryId,
      search: search || undefined,
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
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline"
              onClick={() => {
                setSearch('');
                setCategoryId(undefined);
                setPage(1);
              }}
            >
              Xóa bộ lọc
            </Button>
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
                    <TableHead className="text-right">Giá bán</TableHead>
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
                        {product.category_id || '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(product.base_price)}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.is_active ? (
                          <Badge variant="default">Đang bán</Badge>
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
