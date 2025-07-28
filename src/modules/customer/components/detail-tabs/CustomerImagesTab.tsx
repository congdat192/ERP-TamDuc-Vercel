
import { useState, useRef } from 'react';
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
  FileText, 
  Eye, 
  Download,
  Trash2,
  Plus
} from 'lucide-react';

interface CustomerImage {
  id: string;
  url: string;
  filename: string;
  uploadDate: string;
  size: number;
  type: string;
  description?: string;
}

interface CustomerImagesTabProps {
  customerId: string;
  images?: CustomerImage[];
}

export function CustomerImagesTab({ customerId, images = [] }: CustomerImagesTabProps) {
  const [customerImages, setCustomerImages] = useState<CustomerImage[]>(images);
  const [selectedImage, setSelectedImage] = useState<CustomerImage | null>(null);
  const [uploadDescription, setUploadDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Lỗi",
          description: "Chỉ chấp nhận file hình ảnh",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: CustomerImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: e.target?.result as string,
          filename: file.name,
          uploadDate: new Date().toLocaleString('vi-VN'),
          size: file.size,
          type: file.type,
          description: uploadDescription || undefined
        };

        setCustomerImages(prev => [...prev, newImage]);
        setUploadDescription('');
        
        toast({
          title: "Thành công",
          description: `Đã tải lên ${file.name}`,
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage: CustomerImage = {
            id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url: event.target?.result as string,
            filename: file.name,
            uploadDate: new Date().toLocaleString('vi-VN'),
            size: file.size,
            type: file.type,
            description: uploadDescription || undefined
          };

          setCustomerImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });

    if (files.length > 0) {
      toast({
        title: "Thành công",
        description: `Đã tải lên ${files.length} hình ảnh`,
      });
      setUploadDescription('');
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setCustomerImages(prev => prev.filter(img => img.id !== imageId));
    toast({
      title: "Đã xóa",
      description: "Hình ảnh đã được xóa khỏi danh sách",
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="theme-card border-2 theme-border-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 theme-text">
            <Upload className="w-5 h-5" />
            <span>Tải lên hình ảnh mới</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="theme-text text-sm">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              placeholder="Mô tả về hình ảnh..."
              className="voucher-input"
              rows={2}
            />
          </div>

          {/* Drag & Drop Area */}
          <div
            className="border-2 border-dashed theme-border-primary rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-12 h-12 mx-auto theme-text-muted mb-2" />
            <p className="theme-text text-sm mb-2">
              Kéo thả hình ảnh vào đây hoặc click để chọn file
            </p>
            <p className="theme-text-muted text-xs">
              Chấp nhận: JPG, PNG, GIF (tối đa 10MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Chọn hình ảnh từ máy tính
          </Button>
        </CardContent>
      </Card>

      {/* Images Gallery */}
      <Card className="theme-card border-2 theme-border-primary">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2 theme-text">
              <ImageIcon className="w-5 h-5" />
              <span>Thư viện hình ảnh</span>
            </div>
            <Badge variant="outline" className="theme-badge-secondary">
              {customerImages.length} hình ảnh
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customerImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto theme-text-muted mb-4" />
              <p className="theme-text-muted">Chưa có hình ảnh nào</p>
              <p className="theme-text-muted text-sm mt-1">Tải lên hình ảnh đầu tiên</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customerImages.map((image) => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-white/90 hover:bg-white text-gray-900"
                            onClick={() => setSelectedImage(image)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>{selectedImage?.filename}</DialogTitle>
                          </DialogHeader>
                          {selectedImage && (
                            <div className="space-y-4">
                              <div className="flex justify-center">
                                <img
                                  src={selectedImage.url}
                                  alt={selectedImage.filename}
                                  className="max-w-full max-h-96 object-contain"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="theme-text-muted">Tên file:</p>
                                  <p className="theme-text font-medium">{selectedImage.filename}</p>
                                </div>
                                <div>
                                  <p className="theme-text-muted">Kích thước:</p>
                                  <p className="theme-text font-medium">{formatFileSize(selectedImage.size)}</p>
                                </div>
                                <div>
                                  <p className="theme-text-muted">Ngày tải lên:</p>
                                  <p className="theme-text font-medium">{selectedImage.uploadDate}</p>
                                </div>
                                <div>
                                  <p className="theme-text-muted">Loại file:</p>
                                  <p className="theme-text font-medium">{selectedImage.type}</p>
                                </div>
                                {selectedImage.description && (
                                  <div className="col-span-2">
                                    <p className="theme-text-muted">Mô tả:</p>
                                    <p className="theme-text">{selectedImage.description}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-red-500/90 hover:bg-red-600 text-white"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="mt-2 space-y-1">
                    <p className="text-xs theme-text font-medium truncate" title={image.filename}>
                      {image.filename}
                    </p>
                    <div className="flex items-center space-x-2 text-xs theme-text-muted">
                      <Calendar className="w-3 h-3" />
                      <span>{image.uploadDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs theme-text-muted">
                      <FileText className="w-3 h-3" />
                      <span>{formatFileSize(image.size)}</span>
                    </div>
                    {image.description && (
                      <p className="text-xs theme-text-muted truncate" title={image.description}>
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
