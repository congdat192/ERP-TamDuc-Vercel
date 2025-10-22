import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LensProductVariant } from '../../types/lens';
import { Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { lensApi } from '../../services/lensApi';
import { toast } from 'sonner';

interface VariantsTableProps {
  variants: (LensProductVariant & { _isNew?: boolean })[];
  onChange: (index: number, field: keyof LensProductVariant, value: any) => void;
  onDelete: (index: number) => void;
}

export function VariantsTable({ variants, onChange, onDelete }: VariantsTableProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const variant = variants[index];
    if (variant.image_urls.length + files.length > 5) {
      toast.error('Tối đa 5 ảnh cho mỗi biến thể');
      return;
    }

    setUploadingIndex(index);
    try {
      const uploadedUrls = await lensApi.uploadImages(files);
      onChange(index, 'image_urls', [...variant.image_urls, ...uploadedUrls]);
      toast.success(`Đã tải lên ${files.length} ảnh`);
    } catch (error: any) {
      toast.error('Lỗi tải ảnh: ' + error.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveImage = (variantIndex: number, imageIndex: number) => {
    const variant = variants[variantIndex];
    const newImages = variant.image_urls.filter((_, i) => i !== imageIndex);
    onChange(variantIndex, 'image_urls', newImages);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/30">
          <tr>
            <th className="p-2 text-left text-xs font-medium w-12">#</th>
            <th className="p-2 text-left text-xs font-medium min-w-[200px]">Tên biến thể</th>
            <th className="p-2 text-left text-xs font-medium min-w-[150px]">SKU *</th>
            <th className="p-2 text-left text-xs font-medium w-32">Giá (₫) *</th>
            <th className="p-2 text-left text-xs font-medium w-24">Tồn kho</th>
            <th className="p-2 text-left text-xs font-medium min-w-[200px]">Ảnh</th>
            <th className="p-2 text-center text-xs font-medium w-20">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant, index) => (
            <tr key={variant.id} className="border-b hover:bg-muted/20">
              <td className="p-2 text-sm text-muted-foreground">{index + 1}</td>
              
              {/* Variant Name */}
              <td className="p-2">
                <div className="flex flex-col gap-1">
                  <Input
                    value={variant.variant_name}
                    onChange={(e) => onChange(index, 'variant_name', e.target.value)}
                    className="h-8 text-sm"
                    placeholder="VD: 1.56 - Clear"
                  />
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <Badge key={key} variant="outline" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </td>
              
              {/* SKU */}
              <td className="p-2">
                <Input
                  value={variant.sku}
                  onChange={(e) => onChange(index, 'sku', e.target.value)}
                  className="h-8 text-sm"
                  placeholder="ROD-CLR-156"
                />
              </td>
              
              {/* Price */}
              <td className="p-2">
                <Input
                  type="number"
                  value={variant.price}
                  onChange={(e) => onChange(index, 'price', Number(e.target.value))}
                  className="h-8 text-sm"
                  min="0"
                />
              </td>
              
              {/* Stock */}
              <td className="p-2">
                <Input
                  type="number"
                  value={variant.stock_quantity}
                  onChange={(e) => onChange(index, 'stock_quantity', Number(e.target.value))}
                  className="h-8 text-sm"
                  min="0"
                />
              </td>
              
              {/* Images */}
              <td className="p-2">
                <div className="flex items-center gap-1">
                  {/* Image Thumbnails */}
                  {variant.image_urls.map((url, imgIdx) => (
                    <div key={imgIdx} className="relative w-10 h-10 border rounded overflow-hidden group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index, imgIdx)}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Upload Button */}
                  {variant.image_urls.length < 5 && (
                    <label className="flex items-center justify-center w-10 h-10 border-2 border-dashed rounded cursor-pointer hover:bg-muted">
                      {uploadingIndex === index ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 text-muted-foreground" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(index, e)}
                        className="hidden"
                        disabled={uploadingIndex !== null}
                      />
                    </label>
                  )}
                  
                  <span className="text-xs text-muted-foreground ml-1">
                    {variant.image_urls.length}/5
                  </span>
                </div>
              </td>
              
              {/* Delete */}
              <td className="p-2 text-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(index)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
