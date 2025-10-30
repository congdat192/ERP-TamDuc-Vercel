import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ImageIcon, TrendingUp } from 'lucide-react';

interface ProductInfoTabProps {
  product: any;
}

const InfoRow = ({ 
  label, 
  value, 
  valueClassName = "" 
}: { 
  label: string; 
  value: string | number;
  valueClassName?: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm theme-text-muted">{label}</span>
    <span className={`font-medium theme-text ${valueClassName}`}>{value}</span>
  </div>
);

export function ProductInfoTab({ product }: ProductInfoTabProps) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoadError, setImageLoadError] = useState<Set<number>>(new Set());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const handleImageError = (index: number) => {
    setImageLoadError(prev => new Set(prev).add(index));
  };

  // Support both mock data and database fields
  const productCode = product.code || product.productCode || '-';
  const productName = product.full_name || product.product_name || product.name || '-';
  const categoryPath = product.category_path || product.category || 'Chưa phân loại';
  const barcode = product.barcode || 'Chưa có';
  const retailPrice = product.retail_price || product.price || 0;
  const basePrice = product.base_price || product.costPrice || 0;
  const onHand = product.on_hand !== undefined ? product.on_hand : (product.stock || 0);
  const totalReserved = product.total_reserved || 0;
  const totalAvailable = product.total_available || 0;
  const trademarkName = product.trademark_name || product.brand || '-';
  const location = product.location || 'Chưa có';
  const weight = product.weight || null;
  const minStock = product.min_stock || 0;
  const maxStock = product.max_stock || 999999999;
  const lowStockAlert = product.low_stock_alert || false;
  const overstockAlert = product.overstock_alert || false;
  const hasVariants = product.has_variants || false;
  const productType = product.product_type || 'standard';
  const allowEarnPoints = product.allow_earn_points !== undefined ? product.allow_earn_points : product.pointsEarning;
  const allowDirectSale = product.allow_direct_sale !== undefined ? product.allow_direct_sale : product.directSales;
  const isStandard = product.is_standard_product !== undefined ? product.is_standard_product : true;

  // Extract attributes for inline display
  const attributes = [
    product.color,
    product.material,
    product.shape,
    product.size,
    product.gender
  ].filter(Boolean).join(' ');

  // Parse images from database
  const productImages = Array.isArray(product.images) ? product.images : [];
  const hasImages = productImages.length > 0;
  const mainImage = hasImages ? productImages[0] : null;

  // DEBUG LOG
  console.log('🖼️ ProductInfoTab - Images:', {
    raw: product.images,
    parsed: productImages,
    hasImages,
    mainImage
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex gap-4 items-start pb-6 border-b theme-border-primary">
        {/* Product Image */}
        <div 
          className={`w-40 h-40 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${hasImages ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          onClick={() => hasImages && setIsImagePreviewOpen(true)}
        >
          {hasImages && !imageLoadError.has(0) ? (
            <img 
              src={mainImage || ''} 
              alt={productName}
              className="w-full h-full object-cover"
              onError={() => handleImageError(0)}
            />
          ) : (
            <ImageIcon className="w-16 h-16 theme-text-muted" />
          )}
        </div>
        
        {/* Product Details */}
        <div className="flex-1 space-y-3">
          {/* Title with inline attributes */}
          <h2 className="text-xl font-medium theme-text">
            {productName} <span className="font-bold">{productCode}</span>
            {attributes && (
              <span className="ml-2 font-normal theme-text-muted text-base">
                {attributes}
              </span>
            )}
          </h2>
          
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm theme-text-muted">Nhóm hàng:</span>
            <Badge variant="outline" className="theme-badge-secondary">
              {categoryPath}
            </Badge>
          </div>
          
          {/* Product Type Tabs */}
          <div className="flex gap-1 text-sm">
            <span className={isStandard ? "font-medium theme-text px-3 py-1 rounded border theme-border-primary" : "theme-text-muted px-3 py-1"}>
              Hàng hóa thường
            </span>
            <span className="theme-text-muted">|</span>
            <span className={allowDirectSale ? "font-medium theme-text px-3 py-1 rounded border theme-border-primary" : "theme-text-muted px-3 py-1"}>
              Bán trực tiếp
            </span>
            <span className="theme-text-muted">|</span>
            <span className={allowEarnPoints ? "font-medium theme-text px-3 py-1 rounded border theme-border-primary" : "theme-text-muted px-3 py-1"}>
              Tích điểm
            </span>
          </div>
          
          {/* Analytics Link */}
          <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-700">
            <TrendingUp className="w-4 h-4 mr-1" />
            Xem phân tích
          </Button>
        </div>
      </div>
      
      {/* Main Info Grid - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Column 1 - Thông tin cơ bản */}
        <div className="space-y-4">
          <InfoRow label="Mã hàng" value={productCode} />
          <InfoRow label="Giá vốn" value={formatCurrency(basePrice)} />
          <InfoRow label="Trọng lượng" value={weight ? `${weight} kg` : "Chưa có"} />
        </div>
        
        {/* Column 2 - Giá cả */}
        <div className="space-y-4">
          <InfoRow label="Mã vạch" value={barcode} />
          <InfoRow 
            label="Giá bán" 
            value={formatCurrency(retailPrice)} 
            valueClassName="text-blue-600 font-semibold text-lg"
          />
        </div>
        
        {/* Column 3 - Chi tiết sản phẩm */}
        <div className="space-y-4">
          <InfoRow label="Tồn kho" value={onHand.toString()} />
          <InfoRow label="Có thể bán" value={totalAvailable.toString()} />
          <InfoRow label="Đang đặt" value={totalReserved.toString()} />
          <InfoRow label="Thương hiệu" value={trademarkName} />
          <InfoRow label="Vị trí" value={location} />
        </div>
        
        {/* Column 4 - Định mức tồn & Alerts */}
        <div className="space-y-4">
          <InfoRow label="Định mức tồn" value={`${minStock} - ${maxStock.toLocaleString('vi-VN')}`} />
          {lowStockAlert && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Cảnh báo tồn thấp
            </Badge>
          )}
          {overstockAlert && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Cảnh báo tồn cao
            </Badge>
          )}
          {hasVariants && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Có biến thể
            </Badge>
          )}
        </div>
      </div>
      
      {/* Bottom Section - 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t theme-border-primary">
        {/* Physical Properties */}
        <div>
          <h3 className="font-semibold theme-text mb-4">Thuộc tính vật lý</h3>
          <div className="space-y-3">
            <InfoRow label="Khối lượng" value={weight || "-"} />
            <InfoRow label="Kích thước" value={product.dimensions || "-"} />
          </div>
        </div>
        
        {/* Settings */}
        <div>
          <h3 className="font-semibold theme-text mb-4">Cài đặt</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm theme-text-muted">Tích điểm:</span>
              <Badge variant={allowEarnPoints ? "success" : "secondary"} className={allowEarnPoints ? "bg-green-100 text-green-800" : ""}>
                {allowEarnPoints ? "Có" : "Không"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm theme-text-muted">Bán trực tiếp:</span>
              <Badge variant={allowDirectSale ? "success" : "secondary"} className={allowDirectSale ? "bg-green-100 text-green-800" : ""}>
                {allowDirectSale ? "Có" : "Không"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-4xl">
          <div className="space-y-4">
            {/* Main Image */}
            <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {hasImages && !imageLoadError.has(selectedImageIndex) ? (
                <img 
                  src={productImages[selectedImageIndex]} 
                  alt={`${productName} - Ảnh ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  onError={() => handleImageError(selectedImageIndex)}
                />
              ) : (
                <ImageIcon className="w-16 h-16 theme-text-muted" />
              )}
            </div>
            
            {/* Thumbnails (if multiple images) */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`
                      w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all
                      ${index === selectedImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-400'}
                    `}
                  >
                    {!imageLoadError.has(index) ? (
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(index)}
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 theme-text-muted" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Image Counter */}
            {productImages.length > 1 && (
              <div className="text-center text-sm theme-text-muted">
                {selectedImageIndex + 1} / {productImages.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
