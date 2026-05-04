/**
 * Bunga border amplop / scroll frame — unik, sama set yang dipakai
 * `FLOWERS` di `components/OpeningGate.tsx` & `components/FloralScrollFrame.tsx`.
 */
export const OPENING_BORDER_FLOWER_URLS = [
  "/assets/opening/flower-1.png",
  "/assets/opening/flower-2.png",
  "/assets/flowers/bunga-ayat.png",
] as const;

/**
 * URL di `public/` yang diprefetch sebelum undangan interaktif tampil.
 * Amplop + galeri pembuka + portrait + **semua file bunga border** (supaya tidak “bolong” saat pertama kali tampil).
 */
export const CRITICAL_INVITE_PREFETCH_URLS = [
  "/assets/opening/amplop-closed.png",
  "/assets/opening/amplop-open.png",
  "/assets/frame/ayat.png",
  "/assets/frame/couple.png",
  "/assets/frame/date.png",
  "/assets/frame/gedung.png",
  "/assets/frame/story.png",
  "/assets/background/background3.webp",
  "/assets/opening/foto-berdua.jpeg",
  "/assets/musics/soft.webm",
  "/assets/musics/soft.mp3",
  ...OPENING_BORDER_FLOWER_URLS,
] as const;
