
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Image as ImageIcon, 
  Calendar, 
  Eye
} from 'lucide-react';

interface CustomerImage {
  id: string;
  url: string;
  description?: string;
  updatedAt: string;
  position: number; // Vị trí từ 1-10
}

interface CustomerImagesTabProps {
  customerId: string;
  images?: CustomerImage[];
}

export function CustomerImagesTab({ customerId, images = [] }: CustomerImagesTabProps) {
  // Initialize with 10 empty slots
  const [imageSlots, setImageSlots] = useState<(CustomerImage | null)[]>(() => {
    const slots = new Array(10).fill(null);
    
    // Fill existing images into correct positions
    images.forEach((image) => {
      if (image.position >= 1 && image.position <= 10) {
        slots[image.position - 1] = image;
      }
    });
    
    return slots;
  });

  const [selectedImage, setSelectedImage] = useState<CustomerImage | null>(null);

  // Demo URLs for placeholder images - more variety for testing rotation
  const demoImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1485833077590-4278bba3f111?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
  ];

  // Simulate automatic API updates - load demo data for testing
  useEffect(() => {
    // Simulate automatic image loading from API
    const demoSlots = [...imageSlots];
    
    // Fill first 7 slots with demo images to show the mechanism
    for (let i = 0; i < Math.min(7, demoImages.length); i++) {
      demoSlots[i] = {
        id: `auto_${i + 1}`,
        url: demoImages[i],
        description: `Ảnh tự động ${i + 1} từ hệ thống`,
        updatedAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        position: i + 1
      };
    }
    
    setImageSlots(demoSlots);
  }, [customerId]);

  const totalImages = imageSlots.filter(slot => slot !== null).length;

  return (
    <div className="space-y-6">
      {/* Images Grid - Fixed 10 slots */}
      <Card className="theme-card border-2 theme-border-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2 theme-text">
              <ImageIcon className="w-5 h-5" />
              <span>Thư viện hình ảnh tự động (10 vị trí cố định)</span>
            </div>
            <Badge variant="outline" className="theme-badge-secondary">
              {totalImages}/10 ảnh
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {imageSlots.map((imageSlot, index) => {
              const position = index + 1;
              
              return (
                <div key={`slot-${position}`} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    {imageSlot ? (
                      <>
                        <img
                          src={imageSlot.url}
                          alt={imageSlot.description || `Ảnh ${position}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-white/90 hover:bg-white text-gray-900"
                                onClick={() => setSelectedImage(imageSlot)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Ảnh vị trí {imageSlot.position}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex justify-center">
                                  <img
                                    src={imageSlot.url}
                                    alt={imageSlot.description || `Ảnh ${imageSlot.position}`}
                                    className="max-w-full max-h-96 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.src = '/placeholder.svg';
                                    }}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="theme-text-muted">Vị trí:</p>
                                    <p className="theme-text font-medium">Ô số {imageSlot.position}</p>
                                  </div>
                                  <div>
                                    <p className="theme-text-muted">Cập nhật:</p>
                                    <p className="theme-text font-medium">{imageSlot.updatedAt}</p>
                                  </div>
                                  {imageSlot.description && (
                                    <div className="col-span-2">
                                      <p className="theme-text-muted">Mô tả:</p>
                                      <p className="theme-text">{imageSlot.description}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                          <p className="text-xs">Ô {position}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Position Label */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                    {position}
                  </div>

                  {/* Image Info */}
                  <div className="mt-2 text-center">
                    {imageSlot ? (
                      <>
                        <div className="flex items-center justify-center space-x-1 text-xs theme-text-muted">
                          <Calendar className="w-3 h-3" />
                          <span>{imageSlot.updatedAt}</span>
                        </div>
                        {imageSlot.description && (
                          <p className="text-xs theme-text-muted truncate mt-1" title={imageSlot.description}>
                            {imageSlot.description}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xs theme-text-muted">Trống</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Info about automatic mechanism */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Cơ chế tự động:</strong> Hệ thống tự động cập nhật 10 ảnh mới nhất của khách hàng từ API. 
              Ảnh mới sẽ được gắn vào ô trống tiếp theo theo thứ tự 1→10. Khi đầy, ảnh mới sẽ ghi đè ảnh cũ nhất (quay vòng).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
