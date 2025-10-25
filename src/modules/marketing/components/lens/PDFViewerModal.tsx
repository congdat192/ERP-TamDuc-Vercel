import { useState } from 'react';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SupplierCatalog } from '../../types/lens';

interface PDFViewerModalProps {
  open: boolean;
  onClose: () => void;
  catalog: SupplierCatalog | null;
}

export function PDFViewerModal({ open, onClose, catalog }: PDFViewerModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20; // Simplified - in production use react-pdf to get actual page count

  if (!catalog) return null;

  const handleDownload = () => {
    window.open(catalog.pdf_url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 gap-0">
        {/* Header Toolbar */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{catalog.icon}</span>
            <div>
              <h3 className="font-semibold">{catalog.display_name}</h3>
              <p className="text-xs text-muted-foreground">{catalog.file_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content: Sidebar + PDF Viewer */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar: Page Navigation */}
          <div className="w-48 border-r bg-muted/20">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-full p-2 text-left text-sm rounded hover:bg-accent transition-colors ${
                      currentPage === page ? 'bg-accent font-medium' : ''
                    }`}
                  >
                    Trang {page}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 flex flex-col bg-muted/10">
            {/* Page Navigation */}
            <div className="flex items-center justify-center gap-2 p-2 border-b">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* PDF Embed */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <embed
                src={`${catalog.pdf_url}#page=${currentPage}`}
                type="application/pdf"
                className="w-full h-full border rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
