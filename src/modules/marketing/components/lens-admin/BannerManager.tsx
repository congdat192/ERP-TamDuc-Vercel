import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { lensApi } from '@/modules/marketing/services/lensApi';
import { LensBanner } from '@/modules/marketing/types/lens';
import { BannerForm } from './BannerForm';
import { toast } from 'sonner';

export function BannerManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<LensBanner | null>(null);

  const { data: banners, refetch, isLoading } = useQuery({
    queryKey: ['admin-lens-banners'],
    queryFn: () => lensApi.getBanners(),
  });

  const handleCreate = () => {
    setEditingBanner(null);
    setIsFormOpen(true);
  };

  const handleEdit = (banner: LensBanner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      await lensApi.updateBanner(id, { is_active });
      refetch();
      toast.success(is_active ? 'Đã bật banner' : 'Đã tắt banner');
    } catch (error) {
      toast.error('Lỗi khi cập nhật banner');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xác nhận xóa banner này?')) return;
    
    try {
      await lensApi.deleteBanner(id);
      refetch();
      toast.success('Đã xóa banner');
    } catch (error) {
      toast.error('Lỗi khi xóa banner');
      console.error(error);
    }
  };

  const handleFormClose = (success?: boolean) => {
    setIsFormOpen(false);
    setEditingBanner(null);
    if (success) {
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Thêm Banner
        </Button>
      </div>

      {!banners || banners.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            Chưa có banner nào. Tạo banner đầu tiên!
          </p>
          <Button onClick={handleCreate} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Thêm Banner
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map((banner) => (
            <Card key={banner.id} className={!banner.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="aspect-[2/1] mb-3 rounded overflow-hidden bg-muted">
                  <img 
                    src={banner.image_url} 
                    alt={banner.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="mb-3">
                  <h4 className="font-bold mb-1">{banner.title}</h4>
                  {banner.subtitle && (
                    <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>Thứ tự: {banner.display_order}</span>
                    {banner.link_url && (
                      <>
                        <span>•</span>
                        <a 
                          href={banner.link_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Link
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={banner.is_active ? "default" : "outline"}
                    onClick={() => handleToggleActive(banner.id, !banner.is_active)}
                  >
                    {banner.is_active ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <BannerForm 
        open={isFormOpen}
        banner={editingBanner}
        onClose={handleFormClose}
      />
    </div>
  );
}
