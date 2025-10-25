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
        {/* Header Toolbar - Compact */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
          <div className="flex items-center gap-2">
            <span className="text-lg">{catalog.icon}</span>
            <div>
              <h3 className="text-sm font-semibold">{catalog.display_name}</h3>
              <p className="text-xs text-muted-foreground">{catalog.file_name}</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
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
