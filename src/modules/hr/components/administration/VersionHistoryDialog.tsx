import { useState, useEffect } from 'react';
import { History, RotateCcw, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { AdminDocumentService } from '../../services/adminDocumentService';
import type { DocumentVersion } from '../../types/administration';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface VersionHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  onSuccess: () => void;
}

export function VersionHistoryDialog({
  isOpen,
  onClose,
  documentId,
  onSuccess,
}: VersionHistoryDialogProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadVersions();
    }
  }, [isOpen, documentId]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const data = await AdminDocumentService.getVersionHistory(documentId);
      setVersions(data);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async (version: DocumentVersion) => {
    if (!confirm(`Bạn có chắc muốn khôi phục phiên bản ${version.version_number}?`)) return;

    setIsLoading(true);
    try {
      await AdminDocumentService.restoreVersion(documentId, version.id);
      toast({
        title: 'Thành công',
        description: `Đã khôi phục phiên bản ${version.version_number}`,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Lịch Sử Phiên Bản
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 h-[600px]">
          {/* Version List */}
          <div className="col-span-1 border-r pr-4">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Đang tải...
                </div>
              ) : versions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chưa có lịch sử phiên bản</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {versions.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedVersion?.id === version.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <Badge variant="outline">Phiên bản {version.version_number}</Badge>
                        {version.version_number === versions[0].version_number && (
                          <Badge variant="default" className="text-xs">Mới nhất</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {format(new Date(version.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </p>
                      {version.change_note && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {version.change_note}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Version Detail */}
          <div className="col-span-2">
            {selectedVersion ? (
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Phiên bản {selectedVersion.version_number}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestore(selectedVersion)}
                      disabled={isLoading || selectedVersion.version_number === versions[0].version_number}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Khôi phục
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedVersion.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </p>
                  {selectedVersion.change_note && (
                    <p className="text-sm mt-2 p-2 bg-muted rounded">
                      <span className="font-medium">Ghi chú: </span>
                      {selectedVersion.change_note}
                    </p>
                  )}
                </div>

                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium mb-2">Nội dung</p>
                  <ScrollArea className="h-full border rounded-lg p-4 bg-muted/50">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {selectedVersion.content}
                    </pre>
                  </ScrollArea>
                </div>

                {selectedVersion.file_name && (
                  <div className="mt-4 p-3 border rounded-lg">
                    <p className="text-sm font-medium mb-1">File đính kèm</p>
                    <p className="text-sm text-muted-foreground">{selectedVersion.file_name}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Chọn phiên bản để xem chi tiết</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
