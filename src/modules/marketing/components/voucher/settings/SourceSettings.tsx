import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { voucherService } from '../../../services/voucherService';
import { toast } from 'sonner';
import { SourceDialog } from './SourceDialog';

interface VoucherSource {
  id: string;
  source_code: string;
  source_name: string;
  description: string | null;
  is_active: boolean;
}

export function SourceSettings() {
  const [sources, setSources] = useState<VoucherSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<VoucherSource | null>(null);

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    try {
      const data = await voucherService.getSources();
      setSources(data);
    } catch (error) {
      toast.error('Không thể tải danh sách nguồn khách hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    loadSources();
    setDialogOpen(false);
    setEditingSource(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Nguồn khách hàng</CardTitle>
        <Button onClick={() => setDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tạo nguồn KH
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-2">
            {sources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{source.source_name}</div>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{source.source_code}</code>
                    {!source.is_active && (
                      <Badge variant="secondary">Không hoạt động</Badge>
                    )}
                  </div>
                  {source.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {source.description}
                    </div>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingSource(source);
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

      <SourceDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        source={editingSource}
        onSave={handleSave}
      />
    </Card>
  );
}
