# Đề xuất tính năng: "Báo giá ước tính trong 30 giây"

> **Trạng thái: ĐỀ XUẤT — chưa triển khai.** Tài liệu này dùng để trao đổi với khách
> hàng về các mức giá trước khi lập trình. Mọi con số trong bảng giá bên dưới là
> **giả định tạm** (placeholder) — studio xác nhận số thật rồi mới code.
>
> Ngày soạn: 2026-10-03. Nguồn nghiên cứu: phân tích 3 mảng (xu hướng website nội
> thất quốc tế 2025–26, tính khả thi kỹ thuật trên stack Astro tĩnh, hành vi khách
> VN) — lưu tại `.agent/memory/research/standout-feature-proposal.md` (nội bộ).

---

## 1. Tính năng là gì?

Một khối công cụ trên website (đặt ở trang chủ + trang riêng `/bao-gia/`):

1. Khách trả lời **4 câu hỏi**: loại hình (nhà ở / quán café – nhà hàng / khách sạn /
   văn phòng / bán lẻ) → diện tích m² → phong cách → mức đầu tư (cơ bản / tiêu
   chuẩn / cao cấp).
2. Website hiển thị ngay **khoảng chi phí ước tính bằng VND** (không cần để lại số
   điện thoại để xem).
3. CTA: **"Nhận báo giá chi tiết"** → đưa khách sang form liên hệ đã điền sẵn thông
   tin + nút chat Zalo trực tiếp.

Bản chất: trả lời ngay câu hỏi đầu tiên mà mọi khách hàng Việt đều hỏi — *"xây nội
thất tốn bao nhiêu tiền một m2?"* — rồi biến người vừa được trả lời thành lead đã
được sơ tuyển (đã biết loại hình, diện tích, tier).

## 2. Vì sao tin được hiệu quả? (bằng chứng thị trường)

- **KenDesign** (benchmark chính của dự án) đang chạy đúng công cụ này — "Khái toán
  đầu tư" + "Tính điểm hòa vốn", kèm ngân sách thật in trên card dự án. KS House,
  KASAI, Cường Thịnh Phát cũng có máy tính chi phí online, đều kết thúc bằng
  *"để lại Zalo/SĐT nhận bảng giá chi tiết"*.
- Tuy nhiên **phần lớn website nội thất VN vẫn chưa có** công cụ tương tác nào —
  trang dự án chỉ là dump ảnh. Làm sớm = khác biệt có sẵn.
- Công cụ tính/chốt giá là dạng lead-magnet chuyển đổi cao nhất trong các dạng nội
  dung tương tác (nguồn quốc tế ước tính 30–50% opt-in — số tham khảo, không bảo hành).
- Ghi chú pháp lý: số điện thoại là dữ liệu cá nhân theo **Nghị định 13/2023/NĐ-CP**
  (và NĐ 356/2025 siết chặt hơn từ 31/12/2025) — form nhận báo giá trên website đã có
  dòng đồng ý (consent) đúng mục đích "nhận báo giá", dùng lại được cho tính năng này.

## 3. Công thức tính (đề xuất)

Không bao giờ hiện MỘT con số — luôn hiện **khoảng**, vì báo giá thật cần khảo sát:

```
thấp = m² × đơn_giá_thi_công_thấp[tier] × hệ_số_loại_hình + m² × phí_thiết_kế[tier]
cao  = m² × đơn_giá_thi_công_cao[tier]  × hệ_số_loại_hình + m² × phí_thiết_kế[tier]

kết_quả = làm_tròn(chênh 10 triệu), sàn tối thiểu 100 triệu
```

- **Tier quyết định đơn giá.** Phong cách chỉ hiển thị, không nhân hệ số (v1) — tránh
  tính trùng và tránh bảng giá lỗi thời khi phong cách thay đổi.
- **Phí thiết kế cộng theo m²**, tách riêng để tiện chạy chính sách *"miễn phí thiết
  kế khi thi công trọn gói"* (studio quyết định sau).

### Bảng đơn giá (PLACEHOLDER — chờ studio/khách điền số thật)

| Tier | Thi công nội thất (triệu/m²) | | Phí thiết kế (nghìn/m²) |
|------|------------------|------------------|-------------------------|
| | **Thấp** | **Cao** | |
| Cơ bản | 2.5 | 3.5 | 150 |
| Tiêu chuẩn | 3.5 | 5.0 | 250 |
| Cao cấp | 5.0 | 8.0 | 400 |

### Hệ số loại hình (mật độ FF&E, độ bền)

| Loại hình | Hệ số |
|-----------|-------|
| Nhà ở (residential) | 1.00 |
| Văn phòng | 0.95 |
| Bán lẻ | 1.05 |
| Café / nhà hàng | 1.15 |
| Khách sạn / homestay | 1.20 |

### Ví dụ

Café 80 m², tier Tiêu chuẩn:

- Thấp: 80 × 3.5 × 1.15 + 80 × 0.25 = **342 triệu**
- Cao: 80 × 5.0 × 1.15 + 80 × 0.25 = **472 triệu**
- Hiển thị: **"≈ 340 – 470 triệu"** (+ dòng chữ: *ước tính thô, chưa gồm VAT, giá
  cuối cùng sau khảo sát hiện trường*)

Kiểm chứng chéo: khớp với tier thực tế KenDesign dán trên dự án (~2–4 triệu/m² cho
quán F&B) và với dải ngân sách trong form liên hệ hiện tại (1–3 tỷ / 3–7 tỷ).

## 4. Kèm theo (rẻ, cùng đợt làm)

**Badge ngân sách trên card dự án**: dòng *"từ ~3.2 tr/m²"* hoặc ngân sách thật của
dự án (như KenDesign in "1.700.000.000vnđ"). Tận dụng đúng dữ liệu `budgetVi` đã có
trong schema — gần như miễn phí, cùng một file cấu hình với công cụ tính.

## 5. Cái studio cần cung cấp trước khi code

1. ✅ **Bảng đơn giá thật** (thay bảng placeholder ở mục 3) — thiết kế và thi công,
   theo 3 tier; chốt chính sách miễn phí thiết kế hay không.
2. Chốt **hệ số loại hình** có đúng thực tế giá của studio không (bảng trên là ước
   định thị trường).
3. Quyết định **kênh nhận lead**: form email (đã có) + nút Zalo deep-link
   (`zalo.me/<số>` — không cần script) hoặc Zalo OA chat widget (cần tài khoản OA).
4. (Tùy chọn) Số dự án thật để gắn badge ngân sách.

## 6. Kỹ thuật & chi phí triển khai (khi được duyệt)

- Thuần client-side: ~100–150 dòng TypeScript, không thêm thư viện, tĩnh 100% —
  chạy tốt trên GitHub Pages, mobile 4G, không ảnh hưởng CSP/security vừa hardening.
- Bảng đơn giá nằm trong **một file cấu hình riêng** — sửa giá không đụng code; về
  sau có thể nâng thành collection Keystatic để studio tự sửa.
- Song ngữ EN/VI theo cấu trúc i18n sẵn có; kết quả cao độ cho form liên hệ có sẵn
  (consent PDPD giữ nguyên).
- Ước lượng: **4–8 giờ** công phát triển (bao gồm trang /bao-gia/, khối trang chủ,
  badge card, song ngữ). Badge card: ~1 giờ.

## 7. Không chọn (lần này) — để tham chiếu

| Phương án | Vì sao hoãn |
|-----------|-------------|
| Slider before/after | Đẹp, 2–4h, lib 1.5kB — nhưng là "wow", không phải lead-gen. Làm đợt 2. |
| Tour 360° | Khách phải có camera 360 / chụp panorama — workflow chụp sẽ bỏ hoang. |
| Hotspot ảnh / đổi vật liệu | Nhập tọa độ / chụp ảnh từng SKU — gánh nặng nội dung cao. |
| Video walkthrough | Rẻ (2–3h) nhưng cần khách có video thật. |
