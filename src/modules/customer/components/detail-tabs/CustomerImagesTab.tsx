
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  Image as ImageIcon, 
  Calendar, 
  Eye,
  Plus
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
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageDescription, setNewImageDescription] = useState('');

  // Demo URLs for placeholder images
  const demoImages = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
  ];

  // Load demo data for testing
  useEffect(() => {
    // Simulate some demo images for the first few slots
    const demoSlots = [...imageSlots];
    for (let i = 0; i < Math.min(3, demoImages.length); i++) {
      demoSlots[i] = {
        id: `demo_${i + 1}`,
        url: demoImages[i],
        description: `Ảnh demo ${i + 1}`,
        updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
        position: i + 1
      };
    }
    setImageSlots(demoSlots);
  }, []);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL hình ảnh",
        variant: "destructive"
      });
      return;
    }

    // Find the next position (rotating mechanism)
    let nextPosition = 1;
    const occupiedPositions = imageSlots.map((slot, index) => slot ? index + 1 : null).filter(Boolean);
    
    if (occupiedPositions.length >= 10) {
      // If all slots are full, replace the oldest (position 1, then shift all)
      nextPosition = 1;
    } else {
      // Find first empty slot
      for (let i = 1; i <= 10; i++) {
        if (!imageSlots[i - 1]) {
          nextPosition = i;
          break;
        }
      }
    }

    const newImage: CustomerImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: newImageUrl.trim(),
      description: newImageDescription.trim() || undefined,
      updatedAt: new Date().toLocaleDateString('vi-VN'),
      position: nextPosition
    };

    // Update slots with rotation logic
    const updatedSlots = [...imageSlots];
    
    if (occupiedPositions.length >= 10) {
      // Shift all images to the right, new image goes to position 1
      for (let i = 9; i >= 1; i--) {
        updatedSlots[i] = updatedSlots[i - 1] ? { ...updatedSlots[i - 1]!, position: i + 1 } : null;
      }
      updatedSlots[0] = newImage;
    } else {
      // Simply add to the next available slot
      updatedSlots[nextPosition - 1] = newImage;
    }

    setImageSlots(updatedSlots);
    setNewImageUrl('');
    setNewImageDescription('');
    
    toast({
      title: "Thành công",
      description: `Đã thêm hình ảnh vào vị trí ${nextPosition}`,
    });
  };

  const totalImages = imageSlots.filter(slot => slot !== null).length;

  return (
    <div className="space-y-6">
      {/* Add Image Section */}
      <Card className="theme-card border-2 theme-border-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 theme-text">
            <Upload className="w-5 h-5" />
            <span>Thêm hình ảnh mới</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="theme-text text-sm">URL hình ảnh</Label>
            <Input
              id="imageUrl"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="voucher-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="theme-text text-sm">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              value={newImageDescription}
              onChange={(e) => setNewImageDescription(e.target.value)}
              placeholder="Mô tả về hình ảnh..."
              className="voucher-input"
              rows={2}
            />
          </div>

          <Button
            onClick={handleAddImage}
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm hình ảnh
          </Button>
        </CardContent>
      </Card>

      {/* Images Grid - Fixed 10 slots */}
      <Card className="theme-card border-2 theme-border-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2 theme-text">
              <ImageIcon className="w-5 h-5" />
              <span>Thư viện hình ảnh (10 vị trí cố định)</span>
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
          
          {/* Info about rotation mechanism */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Lưu ý:</strong> Hệ thống lưu trữ tối đa 10 ảnh mới nhất. 
              Khi thêm ảnh thứ 11, ảnh cũ nhất (ô 1) sẽ bị thay thế và các ảnh khác sẽ dịch chuyển.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
