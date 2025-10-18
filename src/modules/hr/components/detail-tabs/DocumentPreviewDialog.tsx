import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, FileX, Loader2 } from 'lucide-react';
import { DocumentService, EmployeeDocument } from '../../services/documentService';
import { useToast } from '@/hooks/use-toast';

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: EmployeeDocument | null;
}

export function DocumentPreviewDialog({
  open,
  onOpenChange,
  document,
}: DocumentPreviewDialogProps) {
  const { toast } = useToast();
  const [signedUrl, setSignedUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (open && document) {
      fetchPreviewUrl();
    } else {
      // Reset state when dialog closes
      setSignedUrl('');
      setZoom(1);
    }
  }, [open, document]);

  const fetchPreviewUrl = async () => {
    if (!document) return;

    setLoading(true);
    try {
      const url = await DocumentService.getPreviewUrl(document.file_path);
      setSignedUrl(url);
    } catch (error: any) {
      console.error('❌ Error fetching preview URL:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tải preview',
        variant: 'destructive',
      });
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (signedUrl) {
      window.open(signedUrl, '_blank');
    }
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  if (!document) return null;

  const canPreview = DocumentService.canPreview(document.mime_type || '');
  const isImage = document.mime_type?.startsWith('image/');
  const isPdf = document.mime_type === 'application/pdf';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{document.file_name}</DialogTitle>
          <DialogDescription>
            {DocumentService.getDocumentTypeLabel(document.document_type)} • {DocumentService.formatFileSize(document.file_size)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-[500px]">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin theme-text-primary" />
              <p className="mt-4 theme-text-muted">Đang tải preview...</p>
            </div>
          )}

          {!loading && signedUrl && isPdf && (
            <embed
              src={signedUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              className="min-h-[500px]"
            />
          )}

          {!loading && signedUrl && isImage && (
            <div className="relative flex items-center justify-center h-full theme-bg-secondary/10 rounded-lg">
              <img
                src={signedUrl}
                alt={document.file_name}
                style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={zoomOut}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {!loading && !canPreview && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FileX className="h-16 w-16 theme-text-muted mb-4" />
              <p className="text-lg font-medium">Không thể preview file này</p>
              <p className="text-sm theme-text-muted mt-2">
                Vui lòng tải xuống để xem
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Tải Xuống
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
