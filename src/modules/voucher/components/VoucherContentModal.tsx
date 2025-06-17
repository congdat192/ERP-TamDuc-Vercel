
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

interface VoucherContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  voucherCode: string;
}

export function VoucherContentModal({ isOpen, onClose, content, voucherCode }: VoucherContentModalProps) {
  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Thành công",
        description: "Nội dung voucher đã được sao chép vào clipboard."
      });
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Thành công",
        description: "Nội dung voucher đã được sao chép."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Nội Dung Voucher</span>
            <span className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">
              {voucherCode}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 border rounded-lg p-4">
            <div className="text-sm bg-white p-4 rounded border max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {content}
              </pre>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button onClick={handleCopyContent} className="voucher-button-primary">
            <Copy className="w-4 h-4 mr-2" />
            Copy Nội Dung
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
