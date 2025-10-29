import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KiotVietService } from '@/services/kiotvietService';
import { FolderTree, Loader2, ChevronRight } from 'lucide-react';

interface CategoryTreeItemProps {
  category: any;
  level: number;
}

function CategoryTreeItem({ category, level }: CategoryTreeItemProps) {
  return (
    <div className="space-y-1">
      <div 
        className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
      >
        {category.children && category.children.length > 0 && (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
        <FolderTree className="h-4 w-4 text-blue-500" />
        <span className="font-medium flex-1">{category.category_name}</span>
        <Badge variant="secondary" className="text-xs">
          {category.product_count || 0} SP
        </Badge>
      </div>
      
      {category.children && category.children.length > 0 && (
        <div className="space-y-1">
          {category.children.map((child: any) => (
            <CategoryTreeItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoriesPage() {
  const { data: categoryTree = [], isLoading } = useQuery({
    queryKey: ['kiotviet-category-tree'],
    queryFn: KiotVietService.getCategoryTree
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FolderTree className="h-8 w-8" />
          Nhóm hàng KiotViet
        </h1>
        <p className="text-muted-foreground mt-1">
          Cấu trúc phân loại sản phẩm từ KiotViet
        </p>
      </div>

      {/* Category Tree */}
      <Card>
        <CardHeader>
          <CardTitle>Cây nhóm hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : categoryTree.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FolderTree className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Chưa có nhóm hàng</p>
              <p className="text-sm mt-1">Vui lòng đồng bộ dữ liệu từ KiotViet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {categoryTree.map((category) => (
                <CategoryTreeItem key={category.id} category={category} level={0} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
