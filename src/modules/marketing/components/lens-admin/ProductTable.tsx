import { useState, useEffect } from 'react';
import { Pencil, Trash2, Copy, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LensProduct } from '../../types/lens';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';
import { EmployeePagination } from '@/modules/hr/components/EmployeePagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProductTableProps {
  products: LensProduct[];
  onEdit: (product: LensProduct) => void;
  onClone: (product: LensProduct) => void;
  onRefetch: () => void;
  onSelect?: (productId: string) => void;
  columnVisibility: Record<string, boolean>;
}

export const DEFAULT_PRODUCT_COLUMNS = [
  { key: 'sku', label: 'Mã SKU', visible: true },
  { key: 'name', label: 'Tên sản phẩm', visible: true },
  { key: 'description', label: 'Mô tả', visible: false },
  { key: 'price', label: 'Giá gốc', visible: true },
  { key: 'sale_price', label: 'Giá khuyến mãi', visible: false },
  { key: 'discount_percent', label: 'Chiết khấu %', visible: false },
  { key: 'brand', label: 'Thương hiệu', visible: true },
  { key: 'material', label: 'Chất liệu', visible: true },
  { key: 'refractive_index', label: 'Chiết suất', visible: true },
  { key: 'is_promotion', label: 'Khuyến mãi', visible: false },
  { key: 'promotion_text', label: 'Text KM', visible: false },
  { key: 'view_count', label: 'Lượt xem', visible: false },
  { key: 'is_active', label: 'Trạng thái', visible: true },
  { key: 'created_at', label: 'Ngày tạo', visible: false },
  { key: 'updated_at', label: 'Ngày cập nhật', visible: false },
  { key: 'actions', label: 'Thao tác', visible: true },
];

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const truncateText = (text: string | null, maxLength: number = 50) => {
  if (!text) return '-';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export function ProductTable({ products, onEdit, onClone, onRefetch, onSelect, columnVisibility }: ProductTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [products.length, pageSize, currentPage, totalPages]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await lensApi.deleteProduct(deleteId);
      toast.success('Xóa sản phẩm thành công');
      onRefetch();
    } catch (error: any) {
      toast.error('Lỗi xóa sản phẩm: ' + error.message);
    } finally {
      setDeleteId(null);
    }
  };

  const visibleColumnsCount = Object.values(columnVisibility).filter(Boolean).length;

  return (
    <>
      <div className="border rounded-lg overflow-x-auto">
        <Table className="min-w-max">
      <TableHeader>
        <TableRow>
          {columnVisibility.sku && <TableHead className="min-w-[120px]">Mã SKU</TableHead>}
          {columnVisibility.name && <TableHead className="min-w-[200px]">Tên sản phẩm</TableHead>}
          {columnVisibility.description && <TableHead className="min-w-[250px]">Mô tả</TableHead>}
          {columnVisibility.price && <TableHead className="min-w-[120px]">Giá gốc</TableHead>}
          {columnVisibility.sale_price && <TableHead className="min-w-[120px]">Giá KM</TableHead>}
          {columnVisibility.discount_percent && <TableHead className="min-w-[100px]">Chiết khấu</TableHead>}
          {columnVisibility.brand && <TableHead className="min-w-[120px]">Thương hiệu</TableHead>}
          {columnVisibility.material && <TableHead className="min-w-[120px]">Chất liệu</TableHead>}
          {columnVisibility.refractive_index && <TableHead className="min-w-[100px]">Chiết suất</TableHead>}
          {columnVisibility.is_promotion && <TableHead className="min-w-[100px]">Khuyến mãi</TableHead>}
          {columnVisibility.promotion_text && <TableHead className="min-w-[150px]">Text KM</TableHead>}
          {columnVisibility.view_count && <TableHead className="min-w-[100px]">Lượt xem</TableHead>}
          {columnVisibility.is_active && <TableHead className="min-w-[100px]">Trạng thái</TableHead>}
          {columnVisibility.created_at && <TableHead className="min-w-[120px]">Ngày tạo</TableHead>}
          {columnVisibility.updated_at && <TableHead className="min-w-[120px]">Cập nhật</TableHead>}
          {columnVisibility.actions && <TableHead className="text-right min-w-[180px]">Thao tác</TableHead>}
        </TableRow>
      </TableHeader>
          <TableBody>
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumnsCount} className="text-center text-muted-foreground">
                  {products.length === 0 
                    ? 'Chưa có sản phẩm nào' 
                    : 'Không có sản phẩm nào trên trang này'}
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  {columnVisibility.sku && (
                    <TableCell>{product.sku || '-'}</TableCell>
                  )}
                  {columnVisibility.name && (
                    <TableCell className="font-medium">{product.name}</TableCell>
                  )}
                  {columnVisibility.description && (
                    <TableCell>{truncateText(product.description, 60)}</TableCell>
                  )}
                  {columnVisibility.price && (
                    <TableCell>{product.price.toLocaleString('vi-VN')}₫</TableCell>
                  )}
                  {columnVisibility.sale_price && (
                    <TableCell>
                      {product.sale_price ? `${product.sale_price.toLocaleString('vi-VN')}₫` : '-'}
                    </TableCell>
                  )}
                  {columnVisibility.discount_percent && (
                    <TableCell>{product.discount_percent ? `${product.discount_percent}%` : '-'}</TableCell>
                  )}
                  {columnVisibility.brand && (
                    <TableCell>{product.attributes?.lens_brand?.[0] || '-'}</TableCell>
                  )}
                  {columnVisibility.material && (
                    <TableCell>{product.attributes?.material?.[0] || '-'}</TableCell>
                  )}
                  {columnVisibility.refractive_index && (
                    <TableCell>{product.attributes?.refractive_index?.[0] || '-'}</TableCell>
                  )}
                  {columnVisibility.is_promotion && (
                    <TableCell>
                      {product.is_promotion ? (
                        <Badge variant="default" className="bg-red-500">Có</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.promotion_text && (
                    <TableCell>{truncateText(product.promotion_text, 40)}</TableCell>
                  )}
                  {columnVisibility.view_count && (
                    <TableCell>{product.view_count.toLocaleString('vi-VN')}</TableCell>
                  )}
                  {columnVisibility.is_active && (
                    <TableCell>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Hoạt động' : 'Tạm ẩn'}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.created_at && (
                    <TableCell>{formatDate(product.created_at)}</TableCell>
                  )}
                  {columnVisibility.updated_at && (
                    <TableCell>{formatDate(product.updated_at)}</TableCell>
                  )}
                  {columnVisibility.actions && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {onSelect && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onSelect(product.id)}
                            title="Quản lý Tiers & Use Cases"
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(product)}
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onClone(product)}
                          title="Sao chép sản phẩm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteId(product.id)}
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {products.length > 0 && (
        <EmployeePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={products.length}
          onPageChange={(page) => setCurrentPage(page)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Export for LensAdminPage to use
export function useProductColumnVisibility() {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('lens-product-columns-visibility');
    return saved 
      ? JSON.parse(saved) 
      : DEFAULT_PRODUCT_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.visible }), {});
  });

  const handleColumnToggle = (columnKey: string) => {
    setColumnVisibility(prev => {
      const newState = { ...prev, [columnKey]: !prev[columnKey] };
      localStorage.setItem('lens-product-columns-visibility', JSON.stringify(newState));
      return newState;
    });
  };

  const columns = DEFAULT_PRODUCT_COLUMNS.map(col => ({
    ...col,
    visible: columnVisibility[col.key] ?? col.visible
  }));

  return { columns, handleColumnToggle };
}
