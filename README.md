# HPZ Community (kiểu Reddit)

Site tĩnh thuần HTML/CSS/JS, không cần build. Mở `index.html` hoặc deploy trực tiếp từ branch `main`.

## Cấu trúc
- `index.html`: khung trang
- `styles.css`: giao diện (sáng/tối, responsive)
- `app.js`: dữ liệu mẫu, vote, bình luận phân nhánh, tìm kiếm, lưu bài

## Deploy từ branch
Settings → Pages → Source: Deploy from a branch → Branch: `main` → Folder: `/ (root)`.

Dữ liệu demo lưu trong localStorage của trình duyệt. Muốn xóa dữ liệu, xóa localStorage của trang.
