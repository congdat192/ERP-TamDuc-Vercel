import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { KiotVietProductsFullService } from "@/services/kiotvietProductsFullService";
import { KiotVietProductFullDB } from "@/lib/types/kiotviet.types";
import { Globe, Package, Tag, DollarSign, Store, Info, Ruler, Palette, Shapes } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicProductPage() {
  const { code } = useParams<{ code: string }>();
  const [product, setProduct] = useState<KiotVietProductFullDB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<"vi" | "en">("vi");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!code) {
        setError("Mã sản phẩm không hợp lệ");
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
          setError("Không tìm thấy sản phẩm");
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError("Lỗi khi tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [code]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const parseImages = (images: any): string[] => {
    if (Array.isArray(images)) return images;
    if (typeof images === "string") {
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
    if (typeof attributes === "string") {
      try {
        return JSON.parse(attributes);
      } catch {
        return [];
      }
    }
    return [];
  };

  const t = (vi: string, en: string) => (language === "vi" ? vi : en);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("Đang tải thông tin sản phẩm...", "Loading product information...")}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("Không tìm thấy sản phẩm", "Product Not Found")}</h2>
          <p className="text-gray-600 mb-4">
            {error || t("Mã sản phẩm không tồn tại trong hệ thống", "Product code does not exist")}
          </p>
          <p className="text-sm text-gray-500">
            {t("Mã:", "Code:")} {code}
          </p>
        </div>
      </div>
    );
  }

  const images = parseImages(product.images);
  const attributes = parseAttributes(product.attributes);

  // icon suggestor cho các thuộc tính phổ biến
  const getAttrIcon = (label: string) => {
    const key = label.toLowerCase();
    if (/(size|kích thước|cỡ)/.test(key)) return <Ruler className="w-4 h-4 text-blue-600 mr-2 shrink-0" />;
    if (/(màu|color)/.test(key)) return <Palette className="w-4 h-4 text-blue-600 mr-2 shrink-0" />;
    if (/(chất liệu|material)/.test(key)) return <Shapes className="w-4 h-4 text-blue-600 mr-2 shrink-0" />;
    if (/(kiểu dáng|style|frame)/.test(key)) return <Tag className="w-4 h-4 text-blue-600 mr-2 shrink-0" />;
    if (/(thiết kế|design|ve mũi|nose)/.test(key)) return <Info className="w-4 h-4 text-blue-600 mr-2 shrink-0" />;
    return <Info className="w-4 h-4 text-blue-600 mr-2 shrink-0" />;
  };

  // item render theo 1 hàng <icon> <label>: <value>
  const RowItem = ({
    icon,
    label,
    value,
    valueClass = "text-base font-semibold",
  }: {
    icon: JSX.Element;
    label: string;
    value: string | number | null | undefined;
    valueClass?: string;
  }) => (
    <div className="flex items-start text-gray-900">
      {icon}
      <span className="text-sm font-medium whitespace-nowrap mr-1">{label}:</span>
      <span className={`${valueClass} break-words`}>{value ?? t("Chưa có thông tin", "N/A")}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("Công ty TNHH Đăng Anh Trí", "Dang Anh Tri Co., Ltd")}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t("Nhà phân phối chính hãng các thương hiệu mắt kính", "Authorized Eyewear Distributor")}
              </p>
            </div>
            {/* nút ngôn ngữ đã chuyển xuống dưới */}
            <div className="hidden" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language switch – ngay trên card đầu tiên */}
        <div className="flex justify-end mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
            className="gap-2"
          >
            <Globe className="w-4 h-4" />
            {language === "vi" ? "English" : "Tiếng Việt"}
          </Button>
        </div>

        {/* === Khối 1: Thông tin sản phẩm === */}
        <section className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              {t("Thông tin sản phẩm", "Product Information")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">{t("Tên sản phẩm", "Product Name")}</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1 break-words">{product.name}</p>
                </div>

                <RowItem
                  icon={<Tag className="w-4 h-4 text-blue-600 mr-2 shrink-0" />}
                  label={t("Thương hiệu", "Brand")}
                  value={product.trademark_name}
                />

                <RowItem
                  icon={<Package className="w-4 h-4 text-blue-600 mr-2 shrink-0" />}
                  label={t("Mã sản phẩm", "Product Code")}
                  value={product.code}
                  valueClass="text-base font-semibold font-mono"
                />
              </div>

              <div className="space-y-4">
                <RowItem
                  icon={<DollarSign className="w-5 h-5 text-green-600 mr-2 shrink-0" />}
                  label={t("Giá bán", "Price")}
                  value={formatCurrency(product.base_price)}
                  valueClass="text-2xl font-bold text-green-600"
                />

                <RowItem
                  icon={<Store className="w-4 h-4 text-blue-600 mr-2 shrink-0" />}
                  label={t("Cửa hàng", "Store")}
                  value={t("Mắt Kính Tâm Đức", "Mat Kinh Tam Duc")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* === Khối 2: Chi tiết sản phẩm (attributes) === */}
        {attributes.length > 0 && (
          <section className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("Chi tiết sản phẩm", "Product Details")}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attributes.map((attr, index) => (
                  <div key={index} className="flex items-start text-gray-900 bg-gray-50 rounded-lg p-3 border">
                    {getAttrIcon(attr.attributeName)}
                    <span className="text-sm font-medium whitespace-nowrap mr-1">{attr.attributeName}:</span>
                    <span className="text-sm font-semibold break-words">{attr.attributeValue}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* === Khối 3: Hình ảnh sản phẩm === */}
        {images.length > 0 && (
          <section className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("Hình ảnh sản phẩm", "Product Images")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-contain bg-white"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=No+Image";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            {t(
              "Nhà phân phối chính hãng các thương hiệu mắt kính: POVINO, Levius, Felicity, Mercury",
              "Authorized distributor of eyewear brands: POVINO, Levius, Felicity, Mercury",
            )}
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            © 2025 {t("Công ty TNHH Đăng Anh Trí", "Dang Anh Tri Co., Ltd")}
          </p>
        </div>
      </footer>
    </div>
  );
}
