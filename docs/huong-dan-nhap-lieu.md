# Hướng dẫn nhập nội dung website (dành cho biên tập viên)

Website quản lý nội dung qua trang quản trị Keystatic. Mọi thay đổi lưu lại sẽ được
đưa lên website tự động sau vài phút.

## 1. Quy trình đăng nội dung

1. Mở trang quản trị: `/keystatic` (khi website đã được kích hoạt chế độ chỉnh sửa).
2. Chọn **Projects** (dự án) hoặc **Journal** (bài viết).
3. Chỉnh sửa, rồi bấm **Save**.
4. Hệ thống tự động cập nhật website trong ~2–3 phút. Kiểm tra lại trang public
   bằng nút **Preview**.

## 2. Thêm ảnh dự án

Ảnh tải lên sẽ tự động được tối ưu (WebP, nhiều kích thước) — chỉ cần chuẩn bị ảnh gốc đúng quy cách:

| Quy cách | Giá trị |
| --- | --- |
| Định dạng | JPG hoặc WebP |
| Kích thước | Cạnh dài ≤ 2560px (đủ 1600px trở lên là tốt) |
| Dung lượng | ≤ ~500KB/ảnh |
| Tên file | tiếng Việt không dấu, các từ cách nhau bằng gạch ngang, ví dụ `phong-khach-go-oc-cho.jpg` — **không** dùng `IMG_4821.jpg` |

**Ảnh bìa (Cover photo):** ảnh đại diện hiển thị ở trang chủ, trang danh sách và
đầu trang dự án. Bỏ trống toàn bộ nhóm này nếu chưa có ảnh — dự án sẽ dùng ảnh
minh họa thay thế.

**Thư viện ảnh (Photo gallery):** bấm **Add**, chọn file, nhập mô tả ảnh. Khi có
ít nhất 1 ảnh, thư viện ảnh thật tự thay thế thư viện minh họa.

**Mô tả ảnh (Alt text) — bắt buộc.** Đây là mô tả cho người khiếm thị và cho Google.
Công thức: `[loại phòng/không gian] + [đặc điểm chính + vật liệu] + [góc nhìn]`,
dưới 125 ký tự, không viết "ảnh của...".

- ✅ `Phòng khách với kệ gỗ óc chó và sofa vải lanh, ánh sáng tự nhiên`
- ✅ `Bếp với đảo đá terrazzo, chụp từ bàn ăn`
- ❌ `Ảnh 1`, `phòng đẹp`

## 3. Các trường của một dự án

| Trường | Bắt buộc | Ý nghĩa |
| --- | --- | --- |
| Title / Slug | ✅ | Tên dự án và đường dẫn — **không sửa Slug sau khi đăng** |
| Summary | ✅ | 1–2 câu tóm tắt, hiển thị ở danh sách và kết quả tìm kiếm |
| Category / Style | ✅ | Loại hình (dân dụng/khách sạn/văn phòng/bán lẻ) và phong cách |
| Location, Floor area, Year | ✅ | Địa điểm, diện tích (m²), năm hoàn thành |
| Services, Investment | — | Hạng mục thiết kế và mức đầu tư (dạng chữ, ví dụ "8.5 tỷ VND") |
| Cover illustration + hue | — | Ảnh minh họa thay thế khi chưa có ảnh chụp |
| Featured on home hero | — | Đưa dự án lên màn hình chính trang chủ (chọn 3–5 dự án tốt nhất) |
| Sort order | — | Số nhỏ hơn đứng trước trong danh sách |
| SEO title / description | — | Chỉ cần khi muốn khác mặc định (≤ 60 / ~155 ký tự) |

## 4. Lưu ý quan trọng (đọc kỹ)

- **Không xóa hoặc sửa tên file ảnh trực tiếp trong thư mục dự án** — chỉ thay ảnh qua trang quản trị.
- **Xin phép khách hàng trước khi đăng ảnh căn nhà của họ** (chụp ảnh, add vào website, mạng xã hội). Nếu khách chưa đồng ý đăng tên, dùng tên khu vực: "Biệt thự An Phú" thay vì tên chủ nhà. Không đăng địa chỉ chi tiết.
- Alt text là bắt buộc — hệ thống sẽ không cho lưu nếu bỏ trống.
- Không đăng hình ảnh có bản quyền của đơn vị khác (nhiếp ảnh gia, tạp chí) nếu chưa có giấy phép.
- Muốn chỉnh nặng (đổi slug, xóa dự án) — liên hệ developer trước.

## 5. Sự cố thường gặp

| Hiện tượng | Xử lý |
| --- | --- |
| Ảnh không hiện sau khi lưu | Chờ 2–3 phút cho website build lại, rồi Ctrl+F5 |
| Không bấm được Save | Kiểm tra trường có dấu `*` còn trống (thường là ảnh hoặc alt text) |
| Sửa sai muốn hoàn tác | Bấm **Reset changes** trước khi Save; đã Save thì liên hệ developer (lịch sử Git lưu được mọi phiên bản) |
| Ảnh nặng, tải chậm | Nén lại ở ~80% chất lượng trước khi tải lên |
