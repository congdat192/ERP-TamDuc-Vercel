import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SupplierCatalog } from '../../types/lens';

interface PDFViewerModalProps {
  open: boolean;
  onClose: () => void;
  catalog: SupplierCatalog | null;
}

export function PDFViewerModal({ open, onClose, catalog }: PDFViewerModalProps) {
  if (!catalog) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 gap-0">
        {/* Header Toolbar - Ultra Compact */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b bg-background">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base flex-shrink-0">{catalog.icon}</span>
            <div className="flex items-center gap-2 min-w-0 text-xs">
              <span className="font-medium truncate">{catalog.display_name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground truncate">{catalog.file_name}</span>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="h-7 px-2 text-xs flex-shrink-0"
          >
            Đóng
          </Button>
        </div>

        {/* PDF Viewer - Full screen */}
        <div className="flex-1 overflow-hidden bg-muted/10">
          <embed
            src={catalog.pdf_url}
            type="application/pdf"
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
