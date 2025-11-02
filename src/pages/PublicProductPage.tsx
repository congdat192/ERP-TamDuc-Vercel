import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { KiotVietProductsFullService } from '@/services/kiotvietProductsFullService';
import { KiotVietProductFullDB } from '@/lib/types/kiotviet.types';
import { Globe, Package, Eye } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-700 text-lg font-medium">{t('Đang tải thông tin sản phẩm...', 'Loading product information...')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-emerald-700" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('Không tìm thấy sản phẩm', 'Product Not Found')}
          </h2>
          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            {error || t('Mã sản phẩm không tồn tại trong hệ thống', 'Product code does not exist')}
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-xl border border-gray-200">
            <span className="text-sm text-gray-500 font-medium">{t('Mã:', 'Code:')}</span>
            <span className="text-base font-mono font-bold text-gray-900">{code}</span>
          </div>
        </div>
      </div>
    );
  }

  const images = parseImages(product.images);
  const attributes = parseAttributes(product.attributes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Premium Header */}
      <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
                </h1>
                <p className="text-emerald-100 mt-2 text-base lg:text-lg font-medium">
                  {t('Nhà phân phối chính hãng các thương hiệu mắt kính', 'Authorized Eyewear Distributor')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="inline-flex items-center justify-center gap-3 bg-white text-emerald-800 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-emerald-200"
            >
              <Globe className="w-5 h-5" />
              <span>{language === 'vi' ? 'English' : 'Tiếng Việt'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Images */}
          {images.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full"></div>
                  {t('Hình ảnh', 'Images')}
                </h3>
                <div className="space-y-4">
                  {images.map((image, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-50 to-white group"
                    >
                      <img
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right Column - Product Information */}
          <div className={images.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {/* Product Info Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-8 py-6">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  {t('THÔNG TIN SẢN PHẨM', 'PRODUCT INFORMATION')}
                </h2>
              </div>
              
              <div className="p-8 space-y-6">
                {/* Product Name - Featured */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border-l-4 border-emerald-600">
                  <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wider">
                    {t('Tên sản phẩm', 'Product Name')}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Brand */}
                    <div className="group">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                        {t('Thương hiệu', 'Brand')}
                      </p>
                      <p className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {product.trademark_name || t('Chưa có thông tin', 'N/A')}
                      </p>
                    </div>

                    {/* Product Code */}
                    <div className="group">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                        {t('Mã sản phẩm', 'Product Code')}
                      </p>
                      <p className="text-xl font-mono font-bold text-gray-900 bg-gray-50 inline-block px-4 py-2 rounded-lg border border-gray-200 group-hover:border-emerald-300 transition-colors">
                        {product.code}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Price */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 rounded-2xl shadow-lg">
                      <p className="text-xs font-bold text-emerald-100 mb-2 uppercase tracking-wider">
                        {t('Giá bán', 'Price')}
                      </p>
                      <p className="text-4xl font-black text-white">
                        {formatCurrency(product.base_price)}
                      </p>
                    </div>

                    {/* Store */}
                    <div className="group">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                        {t('Cửa hàng', 'Store')}
                      </p>
                      <p className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                        {t('Mắt Kính Tâm Đức', 'Mat Kinh Tam Duc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details (Attributes) */}
            {attributes.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-8 py-6">
                  <h3 className="text-2xl font-bold text-white tracking-wide">
                    {t('CHI TIẾT SẢN PHẨM', 'PRODUCT DETAILS')}
                  </h3>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {attributes.map((attr, index) => (
                      <div 
                        key={index} 
                        className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                      >
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                          {attr.attributeName}
                        </p>
                        <p className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {attr.attributeValue}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 border-t-4 border-emerald-900 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-emerald-50 font-semibold text-lg max-w-3xl mx-auto leading-relaxed">
              {t(
                'Nhà phân phối chính hãng các thương hiệu mắt kính: POVINO, Levius, Felicity, Mercury',
                'Authorized distributor of eyewear brands: POVINO, Levius, Felicity, Mercury'
              )}
            </p>
            <div className="pt-6 border-t border-emerald-600/30">
              <p className="text-emerald-200 font-medium">
                © 2025 {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}