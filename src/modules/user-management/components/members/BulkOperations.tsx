
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  UserCog, 
  Building2, 
  Users,
  X
} from 'lucide-react';

interface BulkOperationsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkOperation?: (operation: any) => void;
}

export function BulkOperations({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkOperation
}: BulkOperationsProps) {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCount} thành viên được chọn
            </Badge>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onSelectAll}
                disabled={selectedCount === totalCount}
              >
                Chọn tất cả ({totalCount})
              </Button>
              <span>|</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onDeselectAll}
              >
                Bỏ chọn
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkOperation?.({ type: 'activate', userIds: [] })}
              className="text-green-600 hover:text-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Kích Hoạt
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkOperation?.({ type: 'deactivate', userIds: [] })}
              className="text-orange-600 hover:text-orange-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Vô Hiệu Hóa
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkOperation?.({ type: 'change_role', userIds: [] })}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Đổi Vai Trò
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkOperation?.({ type: 'change_department', userIds: [] })}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Đổi Phòng Ban
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkOperation?.({ type: 'add_to_group', userIds: [] })}
            >
              <Users className="w-4 h-4 mr-2" />
              Thêm Vào Nhóm
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onBulkOperation?.({ type: 'delete', userIds: [] })}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={onDeselectAll}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
