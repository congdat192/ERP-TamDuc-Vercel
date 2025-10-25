import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SupplierCatalog } from "../../types/lens";

interface PDFViewerModalProps {
  open: boolean;
  onClose: () => void;
  catalog: SupplierCatalog | null;
}

export function PDFViewerModal({ open, onClose, catalog }: PDFViewerModalProps) {
  if (!catalog) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[95vw] h-[95vh]",
            "translate-x-[-50%] translate-y-[-50%]",
            "bg-background shadow-lg duration-200",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "flex flex-col overflow-hidden rounded-lg",
          )}
        >
          {/* Header - Compact */}
          <div className="flex items-center justify-between px-4 py-2 border-b bg-background shrink-0">
            <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
              <div className="flex items-center gap-2 min-w-0 text-sm">
                <span className="font-medium truncate">{catalog.display_name}</span>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-muted-foreground truncate">{catalog.file_name}</span>
              </div>
            </div>

            {/* Close button inline with header */}
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-sm shrink-0">
                Đóng
              </Button>
            </DialogPrimitive.Close>
          </div>

          {/* PDF Viewer - Takes remaining space */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <embed src={catalog.pdf_url} type="application/pdf" className="w-full h-full" />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
