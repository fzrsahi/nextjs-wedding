/**
 * Bunga border amplop / scroll frame — unik, sama set yang dipakai
 * `FLOWERS` di `components/OpeningGate.tsx` & `components/FloralScrollFrame.tsx`.
 */
export const OPENING_BORDER_FLOWER_URLS = [
  "/assets/flowers/17.png",
  "/assets/flowers/18.png",
  "/assets/flowers/21.png",
  "/assets/flowers/22.png",
  "/assets/flowers/24.png",
  "/assets/flowers/25.png",
  "/assets/flowers/26.png",
  "/assets/flowers/28.png",
  "/assets/flowers/29.png",
  "/assets/flowers/30.png",
  "/assets/flowers/31.png",
  "/assets/flowers/32.png",
] as const;

/**
 * URL di `public/` yang diprefetch sebelum undangan interaktif tampil.
 * Amplop + galeri pembuka + portrait + **semua file bunga border** (supaya tidak “bolong” saat pertama kali tampil).
 */
export const CRITICAL_INVITE_PREFETCH_URLS = [
  "/assets/opening/closed.png",
  "/assets/opening/open.png",
  "/assets/gallery/1.jpeg",
  "/assets/gallery/2.jpeg",
  "/assets/gallery/3.jpeg",
  "/assets/gallery/4.jpeg",
  "/assets/gallery/5.jpeg",
  "/assets/opening/foto-berdua.jpeg",
  "/assets/opening/foto-berdua-2.jpeg",
  "/assets/visual-blessing/man.jpeg",
  "/assets/visual-blessing/woman.jpeg",
  ...OPENING_BORDER_FLOWER_URLS,
] as const;
