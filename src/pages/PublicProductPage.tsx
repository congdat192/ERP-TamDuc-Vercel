import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { KiotVietProductsFullService } from '@/services/kiotvietProductsFullService';
import { KiotVietProductFullDB } from '@/lib/types/kiotviet.types';
import { Globe, Package, DollarSign, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PublicProductPage() {
  const { code } = useParams<{ code: string }>();
  const [product, setProduct] = useState<KiotVietProductFullDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!code) {
        setError('Mã sản phẩm không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await KiotVietProductsFullService.getProductByCode(code);
        if (data) {
          setProduct(data);
          setError(null);
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError('Lỗi khi tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [code]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const parseImages = (images: any): string[] => {
    if (Array.isArray(images)) return images;
    if (typeof images === 'string') {
      try {
        return JSON.parse(images);
      } catch {
        return [];
      }
    }
    return [];
  };

  const parseAttributes = (attributes: any): Array<{ attributeName: string; attributeValue: string }> => {
    if (Array.isArray(attributes)) return attributes;
    if (typeof attributes === 'string') {
      try {
        return JSON.parse(attributes);
      } catch {
        return [];
      }
    }
    return [];
  };

  const t = (vi: string, en: string) => (language === 'vi' ? vi : en);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('Đang tải thông tin sản phẩm...', 'Loading product information...')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t('Không tìm thấy sản phẩm', 'Product Not Found')}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || t('Mã sản phẩm không tồn tại trong hệ thống', 'Product code does not exist')}
          </p>
          <p className="text-sm text-gray-500">{t('Mã:', 'Code:')} {code}</p>
        </div>
      </div>
    );
  }

  const images = parseImages(product.images);
  const attributes = parseAttributes(product.attributes);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header - Compact */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">
              {t('Đăng Anh Trí', 'Dang Anh Tri')}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="gap-1 h-8 px-2"
            >
              <Globe className="w-3 h-3" />
              <span className="text-xs">{language === 'vi' ? 'EN' : 'VI'}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Body - Compact */}
      <main className="max-w-7xl mx-auto px-3 py-2">
        <div className="bg-white rounded-md shadow-lg overflow-hidden">
          {/* Product Info - Inline */}
          <div className="p-3 space-y-1.5">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-1">
              <Package className="w-4 h-4 text-blue-600" />
              {product.name}
            </h2>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{t('Thương hiệu', 'Brand')}:</span> {product.trademark_name || t('N/A', 'N/A')}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{t('Mã', 'Code')}:</span> <span className="font-mono">{product.code}</span>
            </p>
            <div className="flex items-center justify-between pt-1">
              <p className="text-lg font-bold text-green-600 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatCurrency(product.base_price)}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <Store className="w-3 h-3 text-blue-600" />
                {t('Tâm Đức', 'Tam Duc')}
              </p>
            </div>
          </div>

          {/* Product Details - Horizontal Scroll Chips */}
          {attributes.length > 0 && (
            <div className="px-3 py-2 border-t bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {t('Chi tiết', 'Details')}
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {attributes.map((attr, index) => (
                  <div key={index} className="bg-white px-3 py-1.5 rounded-md border border-gray-200 whitespace-nowrap snap-start shrink-0">
                    <span className="text-xs text-gray-600">{attr.attributeName}:</span>
                    <span className="text-xs font-semibold text-gray-900 ml-1">{attr.attributeValue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Images - Horizontal Carousel */}
          {images.length > 0 && (
            <div className="px-3 py-2 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                {t('Hình ảnh', 'Images')}
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {images.map((image, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden border border-gray-200 snap-start shrink-0" style={{ width: '85vw', maxWidth: '320px' }}>
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-40 object-contain bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer - Compact */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-3 py-2">
          <p className="text-center text-xs text-gray-600">
            © 2025 {t('Đăng Anh Trí - Nhà phân phối: POVINO, Levius, Felicity, Mercury', 'Dang Anh Tri - Distributor: POVINO, Levius, Felicity, Mercury')}
          </p>
        </div>
      </footer>
    </div>
  );
}