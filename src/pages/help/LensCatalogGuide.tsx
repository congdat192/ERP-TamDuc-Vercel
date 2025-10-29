import { HelpLayout } from '@/components/help/HelpLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

export function LensCatalogGuide() {
  return (
    <HelpLayout title="Hướng dẫn sử dụng Lens Catalog">
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📚 Giới thiệu</h2>
          <p className="text-muted-foreground mb-4">
            Module <strong>Lens Catalog</strong> là công cụ tra cứu và tư vấn sản phẩm tròng kính cho nhân viên bán hàng. 
            Module này giúp bạn tìm kiếm, lọc, so sánh và xem chi tiết các sản phẩm tròng kính.
          </p>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Mục đích:</strong> Giúp nhân viên nhanh chóng tìm được sản phẩm phù hợp với nhu cầu khách hàng.
            </AlertDescription>
          </Alert>
        </section>

        {/* Thanh tìm kiếm */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔍 Tìm kiếm sản phẩm</h2>
          
          <h3 className="text-xl font-semibold mb-3">Thanh tìm kiếm</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Gõ từ khóa vào ô tìm kiếm ở góc trên bên trái</li>
            <li>Có thể tìm theo:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>Tên sản phẩm:</strong> VD: "Essilor Eyezen"</li>
                <li><strong>SKU:</strong> VD: "ESS-001"</li>
                <li><strong>Thương hiệu:</strong> VD: "Essilor"</li>
              </ul>
            </li>
            <li>Kết quả hiển thị ngay khi bạn gõ</li>
          </ul>

          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Tip:</strong> Sử dụng tìm kiếm khi bạn đã biết tên hoặc SKU sản phẩm.
            </AlertDescription>
          </Alert>
        </section>

        {/* Bộ lọc thuộc tính */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎯 Bộ lọc cơ bản</h2>
          
          <h3 className="text-xl font-semibold mb-3">Lọc theo thuộc tính</h3>
          <p className="mb-4">Các dropdown bên dưới thanh tìm kiếm cho phép lọc theo thuộc tính:</p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Chất liệu:</strong> Resin, Polycarbonate, Trivex...</li>
            <li><strong>Chiết suất:</strong> 1.50, 1.56, 1.60, 1.67, 1.74...</li>
            <li><strong>Màu sắc:</strong> Trong suốt, Đổi màu, Nâu, Xám...</li>
            <li><strong>Thiết kế:</strong> Single Vision, Progressive, Bifocal...</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Cách sử dụng</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click vào dropdown thuộc tính</li>
            <li>Chọn giá trị muốn lọc</li>
            <li>Kết quả tự động cập nhật</li>
            <li>Có thể chọn nhiều thuộc tính cùng lúc</li>
            <li>Click "Xóa tất cả bộ lọc" để reset</li>
          </ol>
        </section>

        {/* Bộ lọc nâng cao */}
        <section>
          <h2 className="text-2xl font-bold mb-4">⚙️ Bộ lọc nâng cao</h2>
          
          <h3 className="text-xl font-semibold mb-3">Lọc theo thương hiệu và tính năng</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click icon <strong>Filter</strong> (phễu) ở thanh công cụ</li>
            <li>Chọn thương hiệu muốn lọc (Essilor, Hoya, Zeiss...)</li>
            <li>Chọn tính năng mong muốn:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Chống ánh sáng xanh</li>
                <li>Chống tia UV</li>
                <li>Chống nước</li>
                <li>Chống trầy xước</li>
                <li>Chống phản quang</li>
                <li>Chống bám bẩn</li>
              </ul>
            </li>
            <li>Click <strong>"Áp dụng"</strong></li>
          </ol>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Có thể chọn nhiều tính năng cùng lúc. Sản phẩm phải có TẤT CẢ các tính năng đã chọn mới hiển thị.
            </AlertDescription>
          </Alert>
        </section>

        {/* Bộ lọc SPH/CYL */}
        <section>
          <h2 className="text-2xl font-bold mb-4">👓 Lọc theo đơn thuốc</h2>
          
          <h3 className="text-xl font-semibold mb-3">Nhập độ cầu/loạn của khách hàng</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click icon <strong>Sliders</strong> ở thanh công cụ</li>
            <li>Nhập độ cầu (SPH) của khách:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>SPH Min:</strong> VD: -3.00</li>
                <li><strong>SPH Max:</strong> VD: -3.00 (nếu chỉ có 1 mắt)</li>
              </ul>
            </li>
            <li>Nhập độ loạn (CYL) của khách:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li><strong>CYL Min:</strong> VD: -1.00</li>
                <li><strong>CYL Max:</strong> VD: -1.00</li>
              </ul>
            </li>
            <li>Chọn Use Case (tùy chọn):
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Học sinh/Sinh viên</li>
                <li>Văn phòng</li>
                <li>Lái xe</li>
                <li>Thể thao</li>
                <li>Hoạt động ngoài trời</li>
                <li>Làm việc với màn hình</li>
              </ul>
            </li>
            <li>Chọn Tầng cung ứng (1-5)</li>
            <li>Click <strong>"Áp dụng"</strong></li>
          </ol>

          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Kết quả:</strong> Chỉ hiển thị sản phẩm có thể cung cấp độ số theo đơn thuốc của khách.
            </AlertDescription>
          </Alert>
        </section>

        {/* Tư vấn nhanh */}
        <section>
          <h2 className="text-2xl font-bold mb-4">⚡ Tư vấn nhanh</h2>
          
          <h3 className="text-xl font-semibold mb-3">Sử dụng nhóm gợi ý</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click dropdown <strong>"Quick Recommendation"</strong> ở góc trên bên phải</li>
            <li>Chọn nhóm phù hợp:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Tròng kính cho học sinh</li>
                <li>Tròng kính văn phòng</li>
                <li>Tròng kính cao cấp</li>
                <li>Tròng kính giá rẻ</li>
              </ul>
            </li>
            <li>Danh sách tự động lọc theo nhóm đã chọn</li>
          </ol>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Nhóm gợi ý được quản trị viên thiết lập sẵn trong Lens Admin.
            </AlertDescription>
          </Alert>
        </section>

        {/* Sắp xếp */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📊 Sắp xếp kết quả</h2>
          
          <h3 className="text-xl font-semibold mb-3">Các tùy chọn sắp xếp</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Mới nhất:</strong> Sản phẩm mới ra mắt lên đầu</li>
            <li><strong>Giá: Thấp đến Cao:</strong> Sản phẩm rẻ nhất lên đầu</li>
            <li><strong>Giá: Cao đến Thấp:</strong> Sản phẩm đắt nhất lên đầu</li>
            <li><strong>Tên A-Z:</strong> Sắp xếp theo bảng chữ cái</li>
            <li><strong>Tên Z-A:</strong> Sắp xếp ngược bảng chữ cái</li>
          </ul>

          <p className="text-muted-foreground">
            Click dropdown <strong>"Sort"</strong> ở thanh công cụ để chọn kiểu sắp xếp.
          </p>
        </section>

        {/* Chế độ xem */}
        <section>
          <h2 className="text-2xl font-bold mb-4">👁️ Chế độ xem</h2>
          
          <h3 className="text-xl font-semibold mb-3">Card View (Chế độ thẻ)</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Hiển thị sản phẩm dạng thẻ với hình ảnh lớn</li>
            <li>Phù hợp để duyệt nhanh</li>
            <li>Click icon <strong>Grid</strong> để chuyển sang chế độ này</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3">Table View (Chế độ bảng)</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Hiển thị sản phẩm dạng bảng chi tiết</li>
            <li>Phù hợp để so sánh thông số</li>
            <li>Click icon <strong>Table</strong> để chuyển sang chế độ này</li>
            <li>Có thể ẩn/hiện cột bằng nút <strong>"Columns"</strong></li>
          </ul>
        </section>

        {/* So sánh sản phẩm */}
        <section>
          <h2 className="text-2xl font-bold mb-4">⚖️ So sánh sản phẩm</h2>
          
          <h3 className="text-xl font-semibold mb-3">Thêm sản phẩm vào so sánh</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Hover chuột vào card/row sản phẩm</li>
            <li>Click nút <strong>"So sánh"</strong></li>
            <li>Sản phẩm được thêm vào Compare Bag</li>
            <li>Số lượng sản phẩm hiển thị ở badge góc trên bên phải</li>
          </ol>

          <h3 className="text-xl font-semibold mb-3">Xem bảng so sánh</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click nút <strong>"Compare Bag"</strong> (icon Scale)</li>
            <li>Bảng so sánh chi tiết hiển thị</li>
            <li>So sánh các thông số: Giá, Chất liệu, Chiết suất, Tính năng...</li>
            <li>Click <strong>"Xóa"</strong> để xóa sản phẩm khỏi so sánh</li>
            <li>Click <strong>"Xóa tất cả"</strong> để reset</li>
          </ol>

          <Alert>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <strong>Giới hạn:</strong> Có thể so sánh tối đa 5 sản phẩm cùng lúc.
            </AlertDescription>
          </Alert>
        </section>

        {/* Chi tiết sản phẩm */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🔍 Xem chi tiết sản phẩm</h2>
          
          <h3 className="text-xl font-semibold mb-3">Mở modal chi tiết</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Click vào card/row sản phẩm</li>
            <li>Modal hiển thị đầy đủ thông tin:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Hình ảnh sản phẩm</li>
                <li>Tên, SKU, Thương hiệu</li>
                <li>Giá bán</li>
                <li>Mô tả chi tiết</li>
                <li>Tất cả thuộc tính (Chất liệu, Chiết suất...)</li>
                <li>Tính năng (Chống ánh sáng xanh, UV...)</li>
                <li>Phạm vi độ cầu/loạn (Supply Tiers)</li>
              </ul>
            </li>
            <li>Click <strong>"Đóng"</strong> hoặc click bên ngoài để đóng modal</li>
          </ul>
        </section>

        {/* PDF Catalogs */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📄 Xem PDF Catalog</h2>
          
          <h3 className="text-xl font-semibold mb-3">Tra cứu catalog nhà cung cấp</h3>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Click dropdown <strong>"Catalog PDF"</strong> ở góc trên bên phải</li>
            <li>Chọn nhà cung cấp muốn xem</li>
            <li>PDF catalog mở trong modal</li>
            <li>Có thể zoom, cuộn, tìm kiếm trong PDF</li>
            <li>Click <strong>"Đóng"</strong> khi xong</li>
          </ol>
        </section>

        {/* Banner */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📢 Banner quảng cáo</h2>
          
          <p className="text-muted-foreground mb-4">
            Banner quảng cáo hiển thị ở cuối trang, giới thiệu các sản phẩm khuyến mãi hoặc mới nhất.
          </p>

          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Banner tự động cuộn theo carousel</li>
            <li>Click vào banner để xem chi tiết (nếu có link)</li>
          </ul>
        </section>

        {/* Best Practices */}
        <section>
          <h2 className="text-2xl font-bold mb-4">💡 Mẹo sử dụng hiệu quả</h2>
          
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Workflow tư vấn khách hàng:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Hỏi khách về nhu cầu sử dụng (học tập, văn phòng, lái xe...)</li>
                  <li>Sử dụng "Tư vấn nhanh" để lọc nhóm phù hợp</li>
                  <li>Hỏi đơn thuốc → Lọc theo SPH/CYL</li>
                  <li>Hỏi ngân sách → Sắp xếp theo giá</li>
                  <li>Chọn 2-3 sản phẩm → Thêm vào so sánh</li>
                  <li>Giới thiệu bảng so sánh cho khách</li>
                  <li>Khách chọn → Xem chi tiết sản phẩm</li>
                </ol>
              </AlertDescription>
            </Alert>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Lưu ý khi tư vấn:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Luôn kiểm tra Supply Tiers trước khi tư vấn</li>
                  <li>Giải thích rõ các tính năng đặc biệt (Chống ánh sáng xanh...)</li>
                  <li>So sánh giá và tính năng để khách hiểu được giá trị</li>
                  <li>Sử dụng PDF Catalog để show hình ảnh chi tiết hơn</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold mb-4">❓ Câu hỏi thường gặp</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Q: Tại sao không tìm thấy sản phẩm phù hợp?</h3>
              <p className="text-muted-foreground">A: Kiểm tra lại các bộ lọc. Click "Xóa tất cả bộ lọc" rồi lọc lại từng bước.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Q: Làm sao biết sản phẩm có cung cấp độ số của khách không?</h3>
              <p className="text-muted-foreground">A: Sử dụng bộ lọc SPH/CYL. Chỉ sản phẩm có Supply Tiers phù hợp mới hiển thị.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Q: So sánh tối đa bao nhiêu sản phẩm?</h3>
              <p className="text-muted-foreground">A: Tối đa 5 sản phẩm cùng lúc.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Q: Giá hiển thị đã bao gồm VAT chưa?</h3>
              <p className="text-muted-foreground">A: Liên hệ quản trị viên để xác nhận chính sách giá.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Q: Làm sao để in hoặc xuất danh sách sản phẩm?</h3>
              <p className="text-muted-foreground">A: Chuyển sang Table View, chọn các cột cần thiết, rồi dùng Ctrl+P để in.</p>
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
