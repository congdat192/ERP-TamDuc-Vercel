import { useState, Fragment } from 'react';
import { Pencil, Trash2, Copy, ChevronDown, ChevronRight, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LensProduct, LensBrand } from '../../types/lens';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';
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
  brands: LensBrand[];
  onEdit: (product: LensProduct) => void;
  onRefetch: () => void;
}

export function ProductTable({ products, brands, onEdit, onRefetch }: ProductTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || '-';
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(k => k !== groupKey)
        : [...prev, groupKey]
    );
  };

  const handleDuplicateAsVariant = (product: LensProduct) => {
    const newProduct = {
      ...product,
      id: '',
      sku: `${product.sku}-COPY`,
      parent_sku: product.parent_sku || product.sku,
      name: `${product.name} (Bản sao)`,
    } as LensProduct;
    onEdit(newProduct);
  };

  // Group products by parent_sku
  const groupedProducts = products.reduce((acc, product) => {
    const key = product.parent_sku || product.id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(product);
    return acc;
  }, {} as Record<string, LensProduct[]>);

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

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Thương hiệu</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Chất liệu</TableHead>
              <TableHead>Chiết suất</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Chưa có sản phẩm nào
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(groupedProducts).map(([groupKey, variants]) => {
                const mainProduct = variants[0];
                const hasVariants = variants.length > 1;
                const isExpanded = expandedGroups.includes(groupKey);

                return (
                  <Fragment key={groupKey}>
                    {/* Main Product Row */}
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {hasVariants && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => toggleGroup(groupKey)}
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </Button>
                          )}
                          <span>{mainProduct.name}</span>
                          {hasVariants && (
                            <Badge variant="secondary" className="text-xs">
                              {variants.length} variants
                            </Badge>
                          )}
                          {mainProduct.parent_sku && (
                            <Badge variant="outline" className="text-xs">
                              <Link2 className="w-3 h-3 mr-1" />
                              Variant
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getBrandName(mainProduct.brand_id)}</TableCell>
                      <TableCell>{mainProduct.price.toLocaleString('vi-VN')}₫</TableCell>
                      <TableCell>{mainProduct.material || '-'}</TableCell>
                      <TableCell>{mainProduct.refractive_index || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={mainProduct.is_active ? 'default' : 'secondary'}>
                          {mainProduct.is_active ? 'Hoạt động' : 'Tạm ẩn'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicateAsVariant(mainProduct)}
                            title="Tạo biến thể"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit(mainProduct)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteId(mainProduct.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Variant Rows (Expanded) */}
                    {isExpanded && hasVariants && variants.slice(1).map((variant) => (
                      <TableRow key={variant.id} className="bg-muted/30">
                        <TableCell className="pl-14">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">└</span>
                            <span>{variant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getBrandName(variant.brand_id)}</TableCell>
                        <TableCell>{variant.price.toLocaleString('vi-VN')}₫</TableCell>
                        <TableCell>{variant.material || '-'}</TableCell>
                        <TableCell>{variant.refractive_index || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={variant.is_active ? 'default' : 'secondary'}>
                            {variant.is_active ? 'Hoạt động' : 'Tạm ẩn'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDuplicateAsVariant(variant)}
                              title="Tạo biến thể"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit(variant)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteId(variant.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

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
