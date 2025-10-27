import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { voucherService } from '../../../services/voucherService';
import { toast } from 'sonner';
import { CustomerTypeDialog } from './CustomerTypeDialog';

interface CustomerType {
  id: string;
  type_code: string;
  type_name: string;
  description: string | null;
  is_active: boolean;
}

export function CustomerTypeSettings() {
  const [types, setTypes] = useState<CustomerType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<CustomerType | null>(null);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const data = await voucherService.getCustomerTypes();
      setTypes(data);
    } catch (error) {
      toast.error('Không thể tải danh sách loại khách hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    loadTypes();
    setDialogOpen(false);
    setEditingType(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Loại khách hàng</CardTitle>
        <Button onClick={() => setDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tạo loại KH
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-2">
            {types.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{type.type_name}</div>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{type.type_code}</code>
                    {!type.is_active && (
                      <Badge variant="secondary">Không hoạt động</Badge>
                    )}
                  </div>
                  {type.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingType(type);
                    setDialogOpen(true);
                  }}
                >
                  Sửa
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CustomerTypeDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customerType={editingType}
        onSave={handleSave}
      />
    </Card>
  );
}
