import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KiotVietService } from '@/services/kiotvietService';
import { FolderTree, Loader2, ChevronRight, ChevronDown, RefreshCw } from 'lucide-react';

interface CategoryTreeItemProps {
  category: any;
  level: number;
}

function CategoryTreeItem({ category, level }: CategoryTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  return (
    <div className="border-b last:border-0">
      <div 
        className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors cursor-pointer"
        style={{ paddingLeft: `${level * 24 + 12}px` }}
        onClick={() => category.has_child && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 flex-1">
          {category.has_child && (
            <button
              className="p-1 hover:bg-muted rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}
          {!category.has_child && <div className="w-6" />}
          
          <FolderTree className="h-5 w-5 text-primary" />
          
          <div className="flex-1">
            <div className="font-medium">{category.category_name}</div>
            {category.modified_date && (
              <div className="text-xs text-muted-foreground">
                Cập nhật: {new Date(category.modified_date).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            Cấp {category.level}
          </Badge>
          
          {category.has_child && (
            <Badge variant="secondary" className="text-xs">
              Có nhóm con
            </Badge>
          )}
        </div>
      </div>

      {isExpanded && category.children && category.children.length > 0 && (
        <div>
          {category.children.map((child: any) => (
            <CategoryTreeItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoriesPage() {
  const { data: categoryTree = [], isLoading, refetch } = useQuery({
    queryKey: ['kiotviet-category-tree'],
    queryFn: KiotVietService.getCategoryTree,
    staleTime: 0,
    gcTime: 0
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderTree className="h-8 w-8" />
            Nhóm hàng KiotViet
          </h1>
          <p className="text-muted-foreground mt-1">
            Cấu trúc phân loại sản phẩm từ KiotViet
          </p>
        </div>
        
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
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
