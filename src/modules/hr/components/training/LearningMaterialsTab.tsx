import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, FileText, Download, ExternalLink } from 'lucide-react';
import { TrainingDocumentService } from '../../services/trainingDocumentService';
import { supabase } from '@/integrations/supabase/client';

type TrainingDocument = {
  id: string;
  program_id?: string;
  title: string;
  description?: string;
  document_type: string;
  file_url?: string;
  embed_url?: string;
};
import { CreateMaterialModal } from './CreateMaterialModal';

export function LearningMaterialsTab() {
  const [materials, setMaterials] = useState<TrainingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  const loadMaterials = async () => {
    try {
      setLoading(true);
      // Lấy tất cả tài liệu thay vì truyền 'all'
      const { data, error } = await supabase
        .from('training_documents' as any)
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw new Error(`Không thể tải tài liệu: ${error.message}`);
      
      setMaterials((data || []) as any);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tài liệu này?')) return;
    
    try {
      await TrainingDocumentService.deleteDocument(id);
      toast({
        title: 'Thành công',
        description: 'Đã xóa tài liệu',
      });
      loadMaterials();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getDocTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      'slide': 'Slide',
      'reading': 'Tài liệu đọc',
      'video': 'Video',
      'exercise': 'Bài tập'
    };
    return map[type] || type;
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tài Liệu Học Tập</h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm Tài Liệu
        </Button>
      </div>

      <div className="grid gap-4">
        {materials.map((material) => (
          <Card key={material.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{material.title}</CardTitle>
                  {material.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {material.description}
                    </p>
                  )}
                </div>
                <Badge variant="outline">
                  {getDocTypeLabel(material.document_type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{material.title}</span>
                </div>

                <div className="ml-auto flex gap-2">
                  {material.file_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(material.file_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Xem
                    </Button>
                  )}
                  {material.embed_url && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(material.embed_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Embed
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(material.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {materials.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Chưa có tài liệu nào. Nhấn "Thêm Tài Liệu" để bắt đầu.
        </div>
      )}

      <CreateMaterialModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadMaterials();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}
