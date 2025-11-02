import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { KiotVietProductsFullService } from '@/services/kiotvietProductsFullService';
import { KiotVietProductFullDB } from '@/lib/types/kiotviet.types';
import { Globe, Package, Tag, DollarSign, Store, Info } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t('Nhà phân phối chính hãng các thương hiệu mắt kính', 'Authorized Eyewear Distributor')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === 'vi' ? 'English' : 'Tiếng Việt'}
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Product Info Section */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              {t('Thông tin sản phẩm', 'Product Information')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Tên sản phẩm', 'Product Name')}</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Thương hiệu', 'Brand')}</label>
                  <p className="text-base text-gray-900 mt-1 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    {product.trademark_name || t('Chưa có thông tin', 'N/A')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Mã sản phẩm', 'Product Code')}</label>
                  <p className="text-base text-gray-900 mt-1 font-mono bg-gray-100 px-3 py-2 rounded">
                    {product.code}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Giá bán', 'Price')}</label>
                  <p className="text-2xl font-bold text-green-600 mt-1 flex items-center gap-2">
                    <DollarSign className="w-6 h-6" />
                    {formatCurrency(product.base_price)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">{t('Cửa hàng', 'Store')}</label>
                  <p className="text-base text-gray-900 mt-1 flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-600" />
                    {t('Mắt Kính Tâm Đức', 'Mat Kinh Tam Duc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details (Attributes) */}
          {attributes.length > 0 && (
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('Chi tiết sản phẩm', 'Product Details')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {attributes.map((attr, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="text-xs font-medium text-gray-500 uppercase">
                      {attr.attributeName}
                    </label>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {attr.attributeValue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Images */}
          {images.length > 0 && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {t('Hình ảnh sản phẩm', 'Product Images')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-contain bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            {t(
              'Nhà phân phối chính hãng các thương hiệu mắt kính: POVINO, Levius, Felicity, Mercury',
              'Authorized distributor of eyewear brands: POVINO, Levius, Felicity, Mercury'
            )}
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            © 2025 {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
          </p>
        </div>
      </footer>
    </div>
  );
}