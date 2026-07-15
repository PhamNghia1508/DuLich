import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop — tự động scroll về đầu trang mỗi khi route thay đổi.
 *
 * Vấn đề được fix: trong SPA dùng client-side routing (wouter),
 * trình duyệt KHÔNG tự reset scroll position khi chuyển trang như
 * khi load trang mới thực sự. Component này lắng nghe sự thay đổi
 * pathname và gọi window.scrollTo về đầu trang một cách mượt mà.
 *
 * Đặt component này bên trong <WouterRouter> để nó có thể đọc context.
 */
export default function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    // Dùng 'instant' thay vì 'smooth' để tránh cảm giác lag
    // khi trang mới render — user cần thấy top ngay lập tức.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  // Component này không render gì ra DOM
  return null;
}
