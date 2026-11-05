# UMC Meeting Recorder — Cloudflare

Ứng dụng ghi âm cuộc họp chạy trực tiếp trên Cloudflare Workers, dùng R2 để lưu audio và D1 để lưu metadata/transcript.

## Tài nguyên riêng

- Worker: `umc-meeting-recorder`
- R2: `umc-meeting-audio` (private)
- D1: `umc-meeting-db`
- D1 binding: `DB`
- R2 binding: `AUDIO`

Không dùng chung Worker, R2 hoặc D1 với UMC Chat.

## Triển khai

1. Tạo R2 bucket `umc-meeting-audio` trong Cloudflare.
2. Tạo D1 database `umc-meeting-db` và chép `database_id` vào `wrangler.jsonc`.
3. Chạy migration `migrations/0001_init.sql` bằng D1 Console hoặc `npm run db:migrate:remote`.
4. Kết nối repository GitHub với Workers Builds hoặc chạy `npm run deploy` trong môi trường đã đăng nhập Cloudflare.
5. Tạo Cloudflare Access Self-hosted application cho hostname Worker; chỉ cho phép email/nhóm nội bộ. Worker dùng header `Cf-Access-Authenticated-User-Email` làm định danh chủ sở hữu.
6. Thử ghi âm 1–2 phút bằng Chrome/Edge, sau đó xác nhận object trong R2 và metadata trong D1.

Không commit Cloudflare API token, Access service token, nội dung họp hoặc file audio vào repository.

## MVP

- Ghi/tạm dừng/tiếp tục/kết thúc.
- Mỗi phần audio là một MediaRecorder độc lập khoảng 30 giây.
- Hàng đợi IndexedDB và tự đồng bộ khi có mạng.
- Phụ đề trực tiếp `vi-VN` khi trình duyệt hỗ trợ.
- Lịch sử D1, nghe lại từng phần R2, xuất TXT và xóa cuộc họp.
- Chặn lưu trữ mới ở 8 GiB.

Workers AI/Whisper, hiệu đính có phiên bản, chia sẻ theo quyền và xuất DOCX thuộc giai đoạn tiếp theo.
