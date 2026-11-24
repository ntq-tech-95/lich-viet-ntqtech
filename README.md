# Lịch Việt — Âm Lịch Việt Nam Đa Nền Tảng

**Tác giả:** NTQ TECH

Ứng dụng Âm lịch Việt Nam hiện đại, giao diện văn hóa Việt (hỗ trợ Light/Dark mode), hoạt động offline và đóng gói cho **Windows, macOS, iOS, Android và Web/PWA** từ một mã nguồn duy nhất.

## Tính năng chính
- **Thuật toán Âm lịch chuẩn Việt Nam (UTC+7)**: Tính theo Jean Meeus Ch. 49 & Ch. 25 (xử lý chính xác các năm nhuận sát nửa đêm như 2023 nhuận tháng 2).
- **Lịch Bloc & Lịch Tháng nghệ thuật**: Họa tiết Trống Đồng, Pha Mặt Trăng theo ngày Âm, biểu tượng 12 Con Giáp, đánh dấu Mùng 1 (`M1`), Ngày Rằm (`Rằm`), Ngày Lễ (`Lễ`) và thẻ Điểm nhấn trong tháng.
- **Phong thủy & Lịch Vạn Niên**: Can Chi ngày/tháng/năm, Nạp Âm Ngũ Hành, 12 Trực, 24 Tiết Khí, 6 khung Giờ Hoàng Đạo (làm nổi bật giờ hiện tại), Hướng xuất hành (Hỷ Thần / Tài Thần), lưu ý Nguyệt Kỵ / Tam Nương.
- **Đổi ngày Âm ⇄ Dương**: Hỗ trợ đổi nhanh từ năm 1900 đến 2100 (tự động nhận diện tháng nhuận).
- **Quản lý & Sao lưu sự kiện / Giỗ chạp**: Hỗ trợ lặp lại hàng năm theo **Âm lịch** hoặc Dương lịch, xuất/nhập tệp `.json` để sao lưu hoặc chuyển sang máy khác.

## Hướng dẫn chạy & phát hành cho mọi người dùng

### 1. Chạy phát triển & kiểm thử
```powershell
npm test      # Kiểm tra thuật toán Âm lịch (1900–2100)
npm run dev   # Mở giao diện phát triển trên trình duyệt
npm run build # Biên dịch bản sản phẩm vào thư mục dist/
```

### 2. Phát hành Web / PWA (Mọi người trên Windows, Mac, iOS, Android dùng ngay)
- Upload toàn bộ nội dung trong thư mục `dist/` lên bất kỳ hosting có **HTTPS** (Cloudflare Pages, Vercel, Netlify, GitHub Pages hoặc hosting riêng của NTQ TECH).
- Đã tích hợp sẵn icon PNG (`192x192`, `512x512`, `apple-touch-icon.png`) và ảnh xem trước `og-preview.png` khi gửi link qua Zalo/Facebook.
- Người dùng mở link trên **Safari (iOS)** → *Chia sẻ → Thêm vào màn hình chính*, hoặc **Chrome/Edge (Android/Windows/Mac)** → *Cài đặt ứng dụng*.

### 3. Đóng gói file cài đặt Windows `.exe` (với cache lưu trên ổ D)
```powershell
.\scripts\build-win.ps1
```
File cài đặt (`.exe` Installer và bản Portable không cần cài) sẽ được xuất ra trong thư mục `release\`.

### 4. Đóng gói Mobile Native (iOS & Android) với Capacitor
```powershell
npm install @capacitor/core --cache D:\npm-cache
npm install -D @capacitor/cli @capacitor/android @capacitor/ios --cache D:\npm-cache
npx cap add android
npx cap add ios
npm run cap:sync
npx cap open android   # Mở Android Studio để xuất APK / AAB
npx cap open ios       # Mở Xcode (trên máy Mac) để xuất IPA lên App Store
```
