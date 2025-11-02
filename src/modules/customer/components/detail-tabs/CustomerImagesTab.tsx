import { useState, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Image as ImageIcon } from 'lucide-react';

interface Invoice {
  code: string;
  createddate: string;
  eye_prescription?: string;
}

interface CustomerImagesTabProps {
  invoices: Invoice[] | null;
  isLoading: boolean;
}

export function CustomerImagesTab({ invoices, isLoading }: CustomerImagesTabProps) {
  const [selectedImage, setSelectedImage] = useState<{ url: string; date: string; code: string } | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Get 10 most recent images with eye_prescription
  const imageSlots = useMemo(() => {
    if (!invoices) return Array(10).fill(null);
    
    const imagesWithDates = invoices
      .filter(inv => inv.eye_prescription)
      .map(inv => ({
        url: inv.eye_prescription!,
        date: inv.createddate,
        code: inv.code
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const slots = [...imagesWithDates];
    while (slots.length < 10) {
      slots.push(null);
    }
    
    return slots;
  }, [invoices]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleImageClick = (slot: { url: string; date: string; code: string } | null) => {
    if (slot) {
      setSelectedImage(slot);
      setIsZoomOpen(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="theme-text">Đang tải hình ảnh...</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold theme-text flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Thư viện hình ảnh tự động (10 vị trí cố định)
          </h4>
          <div className="text-sm theme-text-muted">
            {imageSlots.filter(s => s !== null).length}/10 ảnh
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-5 gap-4">
          {imageSlots.map((slot, index) => (
            <div 
              key={index}
              className={`relative aspect-square border-2 rounded-lg overflow-hidden ${
                slot 
                  ? 'cursor-pointer hover:border-blue-500 transition-all hover:shadow-lg' 
                  : 'border-dashed border-gray-300 bg-gray-50'
              }`}
              onClick={() => handleImageClick(slot)}
            >
              {/* Slot Number */}
              <div className="absolute top-1 left-1 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded z-10">
                {index + 1}
              </div>

              {slot ? (
                <>
                  {/* Image */}
                  <img 
                    src={slot.url} 
                    alt={`Đơn thuốc ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=Error';
                    }}
                  />
                  
                  {/* Date Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="text-white text-xs font-medium text-center">
                      📅 {formatDate(slot.date)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">Trống</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="theme-text">
            <strong>Cơ chế tự động:</strong> Hệ thống tự động cập nhật 10 ảnh mới nhất của khách hàng từ API. 
            Ảnh mới sẽ được gắn vào ô trống tiếp theo theo thứ tự 1→10. 
            Khi đầy, ảnh mới sẽ ghi đè ảnh cũ nhất (quay vòng).
          </p>
        </div>
      </div>

      {/* Zoom Dialog */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-4xl">
          <div className="flex flex-col items-center space-y-4 p-4">
            {selectedImage && (
              <>
                <div className="relative overflow-hidden rounded-xl shadow-2xl border-4 border-white">
                  <img
                    src={selectedImage.url}
                    alt="Đơn thuốc kính"
                    className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Error';
                    }}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="text-lg font-semibold theme-text">Đơn thuốc kính</h3>
                  <p className="text-sm theme-text-muted">Hóa đơn: {selectedImage.code}</p>
                  <p className="text-sm theme-text-muted">Ngày: {formatDate(selectedImage.date)}</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
