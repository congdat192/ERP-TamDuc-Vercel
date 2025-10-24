import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Upload, Trash2, Check } from 'lucide-react';
import { lensApi } from '../../services/lensApi';
import { LensMediaItem } from '../../types/lens';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MediaLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  maxSelection?: number;
  currentImages?: string[];
}

export function MediaLibraryDialog({
  open,
  onClose,
  onSelect,
  maxSelection = 10,
  currentImages = [],
}: MediaLibraryDialogProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [folderFilter, setFolderFilter] = useState<string>('');
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadFolder, setUploadFolder] = useState('products');
  const [uploadTags, setUploadTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: mediaItems = [], refetch, error, isError, isLoading } = useQuery({
    queryKey: ['mediaLibrary', searchTerm, folderFilter],
    queryFn: () => lensApi.getMediaLibrary({
      search: searchTerm,
      folder: folderFilter || undefined,
    }),
    enabled: open,
    retry: 1,
  });

  const { data: folders = [] } = useQuery({
    queryKey: ['mediaFolders'],
    queryFn: () => lensApi.getMediaFolders(),
    enabled: open,
  });

  const handleSelect = (mediaId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(mediaId)) {
        return prev.filter(id => id !== mediaId);
      }
      if (prev.length >= maxSelection) {
        toast.error(`Chỉ được chọn tối đa ${maxSelection} ảnh`);
        return prev;
      }
      return [...prev, mediaId];
    });
  };

  const handleConfirmSelection = () => {
    const selectedUrls = mediaItems
      .filter(item => selectedIds.includes(item.id))
      .map(item => {
        const { data: { publicUrl } } = supabase.storage
          .from('lens-images')
          .getPublicUrl(item.file_path);
        return publicUrl;
      });
    
    onSelect(selectedUrls);
    setSelectedIds([]);
    onClose();
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) {
      toast.error('Vui lòng chọn ảnh để upload');
      return;
    }

    setIsUploading(true);
    try {
      // Upload files directly to Storage (no metadata)
      const uploadPromises = uploadFiles.map(file =>
        lensApi.uploadImage(file, uploadFolder as 'products' | 'banners' | 'brands')
      );

      await Promise.all(uploadPromises);
      
      toast.success(`Đã upload ${uploadFiles.length} ảnh thành công`);
      setUploadFiles([]);
      setUploadTags('');
      refetch();
      setActiveTab('library');
    } catch (error: any) {
      toast.error(`Lỗi upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Bạn có chắc muốn xóa ảnh này?')) return;

    try {
      // Find the media item to get file_path
      const media = mediaItems.find(m => m.id === mediaId);
      if (!media) return;
      
      await lensApi.deleteMediaFromLibrary(media.file_path);
      toast.success('Đã xóa ảnh');
      refetch();
    } catch (error: any) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Thư viện ảnh</DialogTitle>
          <DialogDescription>
            Chọn ảnh từ thư viện hoặc upload ảnh mới
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">
              <Search className="w-4 h-4 mr-2" />
              Thư viện ({mediaItems.length})
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload mới
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm ảnh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={folderFilter} onValueChange={setFolderFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả folder</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder} value={folder}>
                      {folder}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Lỗi tải thư viện: {error?.message || 'Không thể kết nối đến storage'}
                </AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-4">Đang tải thư viện...</p>
              </div>
            )}

            {!isLoading && !isError && (
              <ScrollArea className="h-[450px]">
                <div className="grid grid-cols-4 gap-4">
                  {mediaItems.map(media => (
                    <div
                      key={media.id}
                      className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedIds.includes(media.id)
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleSelect(media.id)}
                    >
                      <img
                        src={supabase.storage.from('lens-images').getPublicUrl(media.file_path).data.publicUrl}
                        alt={media.alt_text || media.file_name}
                        className="w-full h-32 object-cover"
                      />
                      
                      {selectedIds.includes(media.id) && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <p className="text-white text-xs truncate">{media.file_name}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {media.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-white/80 text-xs mt-1">
                          Sử dụng: {media.usage_count}
                        </p>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMedia(media.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {mediaItems.length === 0 && !searchTerm && !folderFilter && (
                  <div className="text-center py-12">
                    <Upload className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Chưa có ảnh nào trong thư viện
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload ảnh vào bucket lens-images để bắt đầu
                    </p>
                    <Button onClick={() => setActiveTab('upload')}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload ảnh đầu tiên
                    </Button>
                  </div>
                )}

                {mediaItems.length === 0 && (searchTerm || folderFilter) && (
                  <div className="text-center py-12 text-muted-foreground">
                    Không tìm thấy ảnh phù hợp với bộ lọc
                  </div>
                )}
              </ScrollArea>
            )}

            <div className="flex justify-between items-center border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Đã chọn {selectedIds.length} / {maxSelection} ảnh
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Hủy
                </Button>
                <Button
                  onClick={handleConfirmSelection}
                  disabled={selectedIds.length === 0}
                >
                  Thêm {selectedIds.length} ảnh
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Folder</label>
                <Select value={uploadFolder} onValueChange={setUploadFolder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="banners">Banners</SelectItem>
                    <SelectItem value="brands">Brands</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Chọn ảnh</label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setUploadFiles(files);
                  }}
                />
                {uploadFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Đã chọn {uploadFiles.length} file
                  </p>
                )}
              </div>

              <Button
                onClick={handleUpload}
                disabled={isUploading || uploadFiles.length === 0}
                className="w-full"
              >
                {isUploading ? 'Đang upload...' : `Upload ${uploadFiles.length} ảnh`}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
