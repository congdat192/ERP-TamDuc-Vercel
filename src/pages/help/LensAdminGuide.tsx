import { HelpLayout } from '@/components/help/HelpLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

export function LensAdminGuide() {
  return (
    <HelpLayout title="Hướng dẫn sử dụng Lens Admin">
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📚 Giới thiệu</h2>
          <p className="text-muted-foreground mb-4">
            Module <strong>Lens Admin</strong> là công cụ quản lý toàn diện cho danh mục sản phẩm tròng kính. 
            Module này cho phép bạn quản lý sản phẩm, thuộc tính, tầng cung ứng, use cases, tư vấn nhanh, banner quảng cáo và PDF catalogs.
          </p>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Quyền truy cập:</strong> Bạn cần có quyền "manage_lens_admin" để sử dụng module này.
            </AlertDescription>
          </Alert>
        </section>

        {/* Tab Sản phẩm */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔷 Tab "Sản phẩm"</h2>
          
          <h3 className="text-xl font-semibold mb-3">Thêm sản phẩm mới</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click nút <strong>"Thêm sản phẩm"</strong></li>
            <li>Điền thông tin bắt buộc:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>Tên sản phẩm:</strong> Tên hiển thị của tròng kính</li>
                <li><strong>SKU:</strong> Mã sản phẩm duy nhất</li>
                <li><strong>Thương hiệu:</strong> Chọn từ danh sách có sẵn</li>
                <li><strong>Giá (VNĐ):</strong> Giá bán lẻ</li>
              </ul>
            </li>
            <li>Điền thông tin tùy chọn:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>Mô tả:</strong> Mô tả chi tiết sản phẩm</li>
                <li><strong>Hình ảnh URL:</strong> Link ảnh sản phẩm</li>
                <li><strong>Ngày ra mắt:</strong> Thời điểm sản phẩm được giới thiệu</li>
              </ul>
            </li>
            <li>Chọn thuộc tính SELECT (Chất liệu, Chiết suất, Màu sắc...)</li>
            <li>Chọn tính năng MULTISELECT (Chống ánh sáng xanh, UV, Chống nước...)</li>
            <li>Click <strong>"Lưu"</strong></li>
          </ol>

          <Alert className="mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Tip:</strong> Sử dụng chức năng "Clone" để tạo sản phẩm tương tự nhanh chóng.
            </AlertDescription>
          </Alert>

          <h3 className="text-xl font-semibold mb-3">Sửa/Xóa sản phẩm</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Sửa:</strong> Click icon bút chì trên hàng sản phẩm → Chỉnh sửa → Lưu</li>
            <li><strong>Xóa:</strong> Click icon thùng rác → Xác nhận xóa</li>
            <li><strong>Clone:</strong> Click icon copy → Sản phẩm mới được tạo với hậu tố "(Copy)"</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Nhập Excel hàng loạt</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click nút <strong>"Nhập Excel"</strong></li>
            <li>Click <strong>"Tải template mẫu"</strong> để tải file Excel mẫu</li>
            <li>Mở file Excel, điền thông tin sản phẩm:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>Cột bắt buộc:</strong> Tên sản phẩm, SKU, ID Thương hiệu, Giá</li>
                <li><strong>Cột thuộc tính:</strong> Chọn giá trị từ dropdown hoặc nhập text</li>
                <li><strong>Cột tính năng:</strong> Nhập "Có" hoặc "Không"</li>
                <li><strong>Cột Supply Tiers:</strong> Độ cầu Min/Max (SPH), Độ loạn Min/Max (CYL), Tầng cung ứng</li>
              </ul>
            </li>
            <li>Lưu file Excel</li>
            <li>Kéo thả file vào vùng upload hoặc click "Chọn file"</li>
            <li>Click <strong>"Nhập dữ liệu"</strong></li>
          </ol>

          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong>Lưu ý:</strong> SKU phải duy nhất. Nếu SKU đã tồn tại, sản phẩm sẽ được cập nhật thay vì tạo mới.
            </AlertDescription>
          </Alert>

          <h3 className="text-xl font-semibold mb-3">Xuất Excel</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Click nút <strong>"Xuất Excel"</strong> để tải xuống toàn bộ danh sách sản phẩm</li>
            <li>File Excel bao gồm tất cả thông tin: sản phẩm, thuộc tính, tính năng, supply tiers</li>
            <li>Có thể sử dụng file này để import lại hoặc chỉnh sửa hàng loạt</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Ẩn/hiện cột</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Click icon <strong>"Columns"</strong> ở góc trên bên phải bảng</li>
            <li>Tích/bỏ tích các cột muốn hiển thị/ẩn</li>
            <li>Cài đặt được lưu tự động trong trình duyệt</li>
          </ul>
        </section>

        {/* Tab Thuộc tính */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔷 Tab "Thuộc tính"</h2>
          <p className="mb-4">Quản lý các thuộc tính của sản phẩm như Chất liệu, Chiết suất, Màu sắc...</p>

          <h3 className="text-xl font-semibold mb-3">Thêm thuộc tính mới</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Chọn loại thuộc tính:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>SELECT:</strong> Chọn 1 giá trị (VD: Chất liệu)</li>
                <li><strong>MULTISELECT:</strong> Chọn nhiều giá trị (VD: Tính năng)</li>
              </ul>
            </li>
            <li>Nhập tên thuộc tính</li>
            <li>Nhập các giá trị có thể có (mỗi giá trị 1 dòng)</li>
            <li>Click <strong>"Lưu"</strong></li>
          </ol>

          <h3 className="text-xl font-semibold mb-3">Sửa/Xóa thuộc tính</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Click icon bút chì để sửa</li>
            <li>Click icon thùng rác để xóa</li>
          </ul>

          <Alert>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong>Cảnh báo:</strong> Xóa thuộc tính sẽ xóa dữ liệu thuộc tính của tất cả sản phẩm liên quan.
            </AlertDescription>
          </Alert>
        </section>

        {/* Tab Tầng cung ứng */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔷 Tab "Tầng cung ứng"</h2>
          <p className="mb-4">Thiết lập phạm vi độ cầu (SPH) và độ loạn (CYL) mà mỗi sản phẩm có thể cung cấp.</p>

          <h3 className="text-xl font-semibold mb-3">Thêm tầng cung ứng</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Chọn sản phẩm từ dropdown</li>
            <li>Nhập phạm vi độ cầu:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>SPH Min:</strong> Độ cầu tối thiểu (VD: -10.00)</li>
                <li><strong>SPH Max:</strong> Độ cầu tối đa (VD: +6.00)</li>
              </ul>
            </li>
            <li>Nhập phạm vi độ loạn:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>CYL Min:</strong> Độ loạn tối thiểu (VD: 0.00)</li>
                <li><strong>CYL Max:</strong> Độ loạn tối đa (VD: -4.00)</li>
              </ul>
            </li>
            <li>Chọn tầng (1-5)</li>
            <li>Click <strong>"Thêm"</strong></li>
          </ol>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Ứng dụng:</strong> Dùng để lọc sản phẩm phù hợp với đơn thuốc của khách hàng.
            </AlertDescription>
          </Alert>
        </section>

        {/* Tab Use Cases */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔷 Tab "Use Cases"</h2>
          <p className="mb-4">Chấm điểm mức độ phù hợp của sản phẩm với từng trường hợp sử dụng.</p>

          <h3 className="text-xl font-semibold mb-3">Các Use Cases mặc định</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>students:</strong> Học sinh/Sinh viên</li>
            <li><strong>office:</strong> Văn phòng</li>
            <li><strong>driving:</strong> Lái xe</li>
            <li><strong>sports:</strong> Thể thao</li>
            <li><strong>outdoor:</strong> Hoạt động ngoài trời</li>
            <li><strong>digital:</strong> Làm việc với màn hình</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Chấm điểm</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Chọn sản phẩm</li>
            <li>Chọn Use Case</li>
            <li>Nhập điểm từ 1-10 (10 = rất phù hợp)</li>
            <li>Click <strong>"Lưu"</strong></li>
          </ol>
        </section>

        {/* Tab Tư vấn nhanh */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔷 Tab "Tư vấn nhanh"</h2>
          <p className="mb-4">Tạo nhóm sản phẩm gợi ý để nhân viên có thể tư vấn nhanh cho khách hàng.</p>

          <h3 className="text-xl font-semibold mb-3">Tạo nhóm gợi ý</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click <strong>"Thêm nhóm"</strong></li>
            <li>Nhập tên nhóm (VD: "Tròng kính cho học sinh")</li>
            <li>Nhập mô tả</li>
            <li>Chọn sản phẩm từ danh sách</li>
            <li>Click <strong>"Lưu"</strong></li>
          </ol>

          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Tip:</strong> Nhóm gợi ý sẽ hiển thị trong dropdown "Tư vấn nhanh" ở trang Lens Catalog.
            </AlertDescription>
          </Alert>
        </section>

        {/* Tab Banner */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔷 Tab "Banner"</h2>
          <p className="mb-4">Quản lý banner quảng cáo hiển thị trên trang Lens Catalog.</p>

          <h3 className="text-xl font-semibold mb-3">Thêm banner</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click <strong>"Thêm banner"</strong></li>
            <li>Nhập tiêu đề</li>
            <li>Nhập URL hình ảnh</li>
            <li>Nhập link đích (tùy chọn)</li>
            <li>Đặt thứ tự hiển thị</li>
            <li>Click <strong>"Lưu"</strong></li>
          </ol>
        </section>

        {/* Tab PDF Catalogs */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔷 Tab "PDF Catalogs"</h2>
          <p className="mb-4">Upload catalog PDF từ nhà cung cấp để nhân viên có thể tra cứu.</p>

          <h3 className="text-xl font-semibold mb-3">Upload catalog</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click <strong>"Thêm catalog"</strong></li>
            <li>Nhập tên nhà cung cấp</li>
            <li>Upload file PDF</li>
            <li>Click <strong>"Lưu"</strong></li>
          </ol>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-4">❓ Câu hỏi thường gặp</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Q: Làm sao để import nhiều sản phẩm cùng lúc?</h3>
              <p className="text-muted-foreground">A: Sử dụng chức năng "Nhập Excel". Tải template mẫu, điền thông tin, rồi upload file lên.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Q: SKU bị trùng khi import sẽ như thế nào?</h3>
              <p className="text-muted-foreground">A: Sản phẩm có SKU trùng sẽ được cập nhật thay vì tạo mới.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Q: Có thể xóa nhiều sản phẩm cùng lúc không?</h3>
              <p className="text-muted-foreground">A: Hiện tại chưa hỗ trợ. Bạn cần xóa từng sản phẩm một.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Q: Làm sao để khôi phục sản phẩm đã xóa?</h3>
              <p className="text-muted-foreground">A: Sản phẩm bị xóa không thể khôi phục. Hãy cẩn thận khi xóa.</p>
            </div>
          </div>
        </section>

        {/* Support */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">📞 Hỗ trợ</h2>
          <p className="text-muted-foreground">
            Nếu bạn gặp vấn đề hoặc cần hỗ trợ, vui lòng liên hệ bộ phận IT hoặc quản trị viên hệ thống.
          </p>
        </section>
      </div>
    </HelpLayout>
  );
}
