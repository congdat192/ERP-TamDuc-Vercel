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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col gap-6">
            {/* Desktop: Logo + Title on left, Language button on right */}
            <div className="hidden lg:flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white tracking-tight">
                    {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
                  </h1>
                  <p className="text-emerald-100 mt-2 text-lg font-medium">
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

            {/* Mobile/Tablet: Logo + Title only (no language button) */}
            <div className="flex lg:hidden items-start gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
                <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">
                  {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
                </h1>
                <p className="text-emerald-100 mt-1 text-sm sm:text-base font-medium">
                  {t('Nhà phân phối chính hãng các thương hiệu mắt kính', 'Authorized Eyewear Distributor')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Language Button - Mobile/Tablet Only */}
      <button
        onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
        className="lg:hidden fixed bottom-6 right-6 z-50 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-full font-semibold shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm">{language === 'vi' ? 'EN' : 'VI'}</span>
      </button>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Product Images */}
          {images.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 lg:sticky lg:top-8">
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
                        className="w-full h-full object-contain p-4 sm:p-6 group-hover:scale-110 transition-transform duration-500"
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
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-6 sm:px-8 py-5 sm:py-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {t('THÔNG TIN SẢN PHẨM', 'PRODUCT INFORMATION')}
                </h2>
              </div>
              
              <div className="p-6 sm:p-8 space-y-6">
                {/* Product Name - Featured */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 sm:p-6 rounded-2xl border-l-4 border-emerald-600">
                  <p className="text-xs font-bold text-emerald-800 mb-2 uppercase tracking-wider">
                    {t('Tên sản phẩm', 'Product Name')}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </p>
                </div>

                {/* Info Items - Single Line */}
                <div className="space-y-4">
                  {/* Brand */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-600 min-w-[100px] sm:min-w-[120px]">
                      {t('Thương hiệu', 'Brand')}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
                      {product.trademark_name || t('Chưa có thông tin', 'N/A')}
                    </span>
                  </div>

                  {/* Product Code */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-600 min-w-[100px] sm:min-w-[120px]">
                      {t('Mã sản phẩm', 'Product Code')}
                    </span>
                    <span className="text-lg sm:text-xl font-mono font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 flex-1">
                      {product.code}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <span className="text-sm font-bold text-gray-600 min-w-[100px] sm:min-w-[120px]">
                      {t('Giá bán', 'Price')}
                    </span>
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 flex-1">
                      {formatCurrency(product.base_price)}
                    </span>
                  </div>

                  {/* Store */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-600 min-w-[100px] sm:min-w-[120px]">
                      {t('Cửa hàng', 'Store')}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
                      {t('Mắt Kính Tâm Đức', 'Mat Kinh Tam Duc')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details (Attributes) - Single Line per Attribute */}
            {attributes.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 px-6 sm:px-8 py-5 sm:py-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {t('CHI TIẾT SẢN PHẨM', 'PRODUCT DETAILS')}
                  </h3>
                </div>
                
                <div className="p-6 sm:p-8">
                  <div className="space-y-4">
                    {attributes.map((attr, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
                      >
                        <span className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wider min-w-[100px] sm:min-w-[120px]">
                          {attr.attributeName}
                        </span>
                        <span className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
                          {attr.attributeValue}
                        </span>
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
      <footer className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 border-t-4 border-emerald-900 mt-12 sm:mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <p className="text-emerald-50 font-semibold text-base sm:text-lg max-w-3xl mx-auto leading-relaxed px-4">
              {t(
                'Nhà phân phối chính hãng các thương hiệu mắt kính: POVINO, Levius, Felicity, Mercury',
                'Authorized distributor of eyewear brands: POVINO, Levius, Felicity, Mercury'
              )}
            </p>
            <div className="pt-6 border-t border-emerald-600/30">
              <p className="text-emerald-200 font-medium text-sm sm:text-base">
                © 2025 {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}