import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { voucherService, type VoucherTemplate } from '../../../services/voucherService';
import { toast } from 'sonner';
import { TemplateDialog } from './TemplateDialog';

export function TemplateSettings() {
  const [templates, setTemplates] = useState<VoucherTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<VoucherTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await voucherService.getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Không thể tải danh sách template');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    loadTemplates();
    setDialogOpen(false);
    setEditingTemplate(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý Template Voucher</CardTitle>
        <Button onClick={() => setDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tạo template
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <div className="space-y-2">
            {templates.map((template) => (
              <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{template.name}</div>
                    {template.is_default && (
                      <Badge variant="secondary">Mặc định</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {template.template_text}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingTemplate(template);
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

      <TemplateDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        template={editingTemplate}
        onSave={handleSave}
      />
    </Card>
  );
}
