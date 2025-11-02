import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { KiotVietProductsFullService } from '@/services/kiotvietProductsFullService';
import { KiotVietProductFullDB } from '@/lib/types/kiotviet.types';
import { Globe, Package } from 'lucide-react';

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
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E8D88E] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">{t('Đang tải thông tin sản phẩm...', 'Loading product information...')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border-2 border-gray-200">
          <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {t('Không tìm thấy sản phẩm', 'Product Not Found')}
          </h2>
          <p className="text-gray-600 mb-4 text-lg">
            {error || t('Mã sản phẩm không tồn tại trong hệ thống', 'Product code does not exist')}
          </p>
          <p className="text-sm text-gray-500 font-mono bg-gray-100 inline-block px-4 py-2 rounded-lg">
            {t('Mã:', 'Code:')} {code}
          </p>
        </div>
      </div>
    );
  }

  const images = parseImages(product.images);
  const attributes = parseAttributes(product.attributes);

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      {/* Header - Yellow Brand Bar */}
      <div className="bg-gradient-to-r from-[#E8D88E] to-[#F4E896] border-b-4 border-[#D4C17A]">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
              </h1>
              <p className="text-base sm:text-lg text-gray-800 mt-2 font-medium">
                {t('Nhà phân phối chính hãng các thương hiệu mắt kính', 'Authorized Eyewear Distributor')}
              </p>
            </div>
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="flex items-center justify-center gap-2 bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300"
            >
              <Globe className="w-5 h-5" />
              {language === 'vi' ? 'English' : 'Tiếng Việt'}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Product Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 mb-6">
          <div className="bg-gradient-to-r from-[#E8D88E] to-[#F4E896] px-6 py-4 border-b-2 border-[#D4C17A]">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('THÔNG TIN SẢN PHẨM', 'PRODUCT INFORMATION')}
            </h2>
          </div>
          
          <div className="p-6 sm:p-8 space-y-5">
            {/* Tên sản phẩm - Special styling */}
            <div className="bg-gradient-to-r from-[#FFF9E6] to-white p-4 rounded-xl border-l-4 border-[#E8D88E]">
              <p className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                {t('Tên sản phẩm:', 'Product Name:')}
              </p>
              <p className="text-2xl font-bold text-gray-900 leading-tight">
                {product.name}
              </p>
            </div>

            {/* Other fields - Single line */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-2 py-2 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-700 min-w-[120px]">
                  {t('Thương hiệu:', 'Brand:')}
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {product.trademark_name || t('Chưa có thông tin', 'N/A')}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 py-2 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-700 min-w-[120px]">
                  {t('Mã sản phẩm:', 'Product Code:')}
                </span>
                <span className="text-lg font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                  {product.code}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 py-2 border-b border-gray-100">
                <span className="text-sm font-bold text-gray-700 min-w-[120px]">
                  {t('Giá bán:', 'Price:')}
                </span>
                <span className="text-3xl font-black text-green-600">
                  {formatCurrency(product.base_price)}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-2 py-2">
                <span className="text-sm font-bold text-gray-700 min-w-[120px]">
                  {t('Cửa hàng:', 'Store:')}
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {t('Mắt Kính Tâm Đức', 'Mat Kinh Tam Duc')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details (Attributes) */}
        {attributes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 mb-6">
            <div className="bg-gradient-to-r from-[#E8D88E] to-[#F4E896] px-6 py-4 border-b-2 border-[#D4C17A]">
              <h3 className="text-2xl font-bold text-gray-900">
                {t('CHI TIẾT SẢN PHẨM', 'PRODUCT DETAILS')}
              </h3>
            </div>
            
            <div className="p-6 sm:p-8 space-y-3">
              {attributes.map((attr, index) => (
                <div 
                  key={index} 
                  className="flex flex-wrap items-baseline gap-2 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm font-bold text-gray-700 uppercase min-w-[140px]">
                    {attr.attributeName}:
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {attr.attributeValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Images */}
        {images.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
            <div className="bg-gradient-to-r from-[#E8D88E] to-[#F4E896] px-6 py-4 border-b-2 border-[#D4C17A]">
              <h3 className="text-2xl font-bold text-gray-900">
                {t('HÌNH ẢNH SẢN PHẨM', 'PRODUCT IMAGES')}
              </h3>
            </div>
            
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-200 bg-white"
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#E8D88E] to-[#F4E896] border-t-4 border-[#D4C17A] mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-900 font-semibold text-base mb-2">
            {t(
              'Nhà phân phối chính hãng các thương hiệu mắt kính: POVINO, Levius, Felicity, Mercury',
              'Authorized distributor of eyewear brands: POVINO, Levius, Felicity, Mercury'
            )}
          </p>
          <p className="text-center text-sm text-gray-700 font-medium">
            © 2025 {t('Công ty TNHH Đăng Anh Trí', 'Dang Anh Tri Co., Ltd')}
          </p>
        </div>
      </footer>
    </div>
  );
}