import { Badge } from '@/components/ui/badge';
import { ImageIcon, DollarSign, Package2, Boxes } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ProductAdvancedTabProps {
  product: any;
}

export function ProductAdvancedTab({ product }: ProductAdvancedTabProps) {
  // Parse JSONB fields
  const images = Array.isArray(product.images) ? product.images : [];
  const attributes = Array.isArray(product.attributes) ? product.attributes : [];
  const priceBooks = Array.isArray(product.price_books) ? product.price_books : [];
  const units = Array.isArray(product.units) ? product.units : [];
  const productFormulas = Array.isArray(product.product_formulas) ? product.product_formulas : [];

  // Debug log
  console.log('🔍 [ProductAdvancedTab] Product data:', {
    productCode: product.code,
    hasAttributes: !!product.attributes,
    attributesType: typeof product.attributes,
    attributesIsArray: Array.isArray(product.attributes),
    attributesLength: attributes.length,
    attributesRaw: product.attributes,
    attributesParsed: attributes
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Product Images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 theme-text-primary" />
            <h3 className="font-semibold theme-text text-lg">Hình ảnh sản phẩm</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img: any, index: number) => (
              <div key={index} className="aspect-square border theme-border-primary rounded-lg overflow-hidden">
                {typeof img === 'string' ? (
                  <img 
                    src={img} 
                    alt={`Product ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={img.url || img.path} 
                    alt={img.name || `Product ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 theme-text-primary" />
            <h3 className="font-semibold theme-text text-lg">Hình ảnh sản phẩm</h3>
          </div>
          <div className="w-full h-40 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 theme-text-muted mx-auto mb-2" />
              <p className="theme-text-muted text-sm">Chưa có hình ảnh</p>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Product Attributes */}
      <div className="space-y-4">
        <h3 className="font-semibold theme-text text-lg">Thuộc tính sản phẩm</h3>
        
        {attributes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attributes.map((attr: any, index: number) => (
              <div key={index} className="p-4 theme-card rounded-lg border theme-border-primary">
                <label className="text-sm font-medium theme-text-muted capitalize">
                  {attr.attributeName || 'Chưa có tên'}
                </label>
                <p className="theme-text font-medium mt-1">
                  {attr.attributeValue || 'Chưa có giá trị'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="theme-text-muted text-sm">Chưa có thuộc tính nào</p>
        )}
      </div>

      <Separator />

      {/* Price Books */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 theme-text-primary" />
          <h3 className="font-semibold theme-text text-lg">Bảng giá</h3>
        </div>
        
        {priceBooks.length > 0 ? (
          <div className="space-y-3">
            {priceBooks.map((priceBook: any, index: number) => (
              <div key={index} className="p-4 theme-card rounded-lg border theme-border-primary">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium theme-text-muted">Tên bảng giá</label>
                    <p className="theme-text font-medium">{priceBook.name || priceBook.price_book_name || 'Chưa có'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium theme-text-muted">Giá bán</label>
                    <p className="theme-text font-semibold text-blue-600">
                      {formatCurrency(priceBook.price || priceBook.retail_price || 0)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium theme-text-muted">Từ ngày</label>
                    <p className="theme-text text-sm">
                      {priceBook.from_date ? new Date(priceBook.from_date).toLocaleDateString('vi-VN') : 'Chưa có'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium theme-text-muted">Đến ngày</label>
                    <p className="theme-text text-sm">
                      {priceBook.to_date ? new Date(priceBook.to_date).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="theme-text-muted text-sm">Chưa có bảng giá nào</p>
        )}
      </div>

      <Separator />

      {/* Units */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package2 className="w-5 h-5 theme-text-primary" />
          <h3 className="font-semibold theme-text text-lg">Đơn vị tính</h3>
        </div>
        
        {units.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit: any, index: number) => (
              <div key={index} className="p-4 theme-card rounded-lg border theme-border-primary">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium theme-text-muted">Tên đơn vị</label>
                  {unit.is_base_unit && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      Đơn vị cơ bản
                    </Badge>
                  )}
                </div>
                <p className="theme-text font-medium">{unit.unit_name || unit.name || 'Chưa có'}</p>
                {unit.conversion_value && (
                  <p className="theme-text-muted text-sm mt-1">
                    Quy đổi: {unit.conversion_value}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="theme-text-muted text-sm">Chưa có đơn vị tính nào</p>
        )}
      </div>

      {/* Product Formulas (for combo products) */}
      {productFormulas.length > 0 && (
        <>
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 theme-text-primary" />
              <h3 className="font-semibold theme-text text-lg">Công thức sản phẩm (Combo)</h3>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Sản phẩm combo
              </Badge>
            </div>
            
            <div className="space-y-3">
              {productFormulas.map((formula: any, index: number) => (
                <div key={index} className="p-4 theme-card rounded-lg border theme-border-primary">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium theme-text-muted">Sản phẩm thành phần</label>
                      <p className="theme-text font-medium">
                        {formula.product_name || formula.component_name || 'Chưa có'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium theme-text-muted">Số lượng</label>
                      <p className="theme-text">{formula.quantity || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium theme-text-muted">Đơn vị</label>
                      <p className="theme-text">{formula.unit || 'Chưa có'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
