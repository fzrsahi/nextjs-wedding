/** CDN utama untuk frame ayat & amplop pembuka; fallback ke `public/` di `onError` pada komponen. */
export const CDN_AYAT_FRAME = "/assets/frame/ayat.webp";
/** Amplop gunakan aset lokal agar render lebih stabil di Safari iOS. */
export const CDN_AMPL_OPEN = "/assets/opening/amplop-open.webp";
export const CDN_AMPL_CLOSED = "/assets/opening/amplop-closed.webp";

export const FALLBACK_AYAT_FRAME = "/assets/frame/ayat.webp";
export const FALLBACK_AMPL_OPEN = "/assets/opening/amplop-open.webp";
export const FALLBACK_AMPL_CLOSED = "/assets/opening/amplop-closed.webp";

/**
 * Bunga border amplop / scroll frame — unik, sama set yang dipakai
 * `FLOWERS` di `components/OpeningGate.tsx` & `components/FloralScrollFrame.tsx`.
 */
export const OPENING_BORDER_FLOWER_URLS = [
  "/assets/opening/flower-1.webp",
  "/assets/opening/flower-2.webp",
  "/assets/flowers/bunga-ayat.png",
] as const;

/**
 * URL di `public/` yang diprefetch sebelum undangan interaktif tampil.
 * Amplop + galeri pembuka + portrait + **semua file bunga border** (supaya tidak “bolong” saat pertama kali tampil).
 */
export const CRITICAL_INVITE_PREFETCH_URLS = [
  CDN_AMPL_CLOSED,
  CDN_AMPL_OPEN,
  CDN_AYAT_FRAME,
  "/assets/frame/couple.png",
  "/assets/frame/date.png",
  "/assets/frame/gedung.png",
  "/assets/frame/story.webp",
  "/assets/background/background3.webp",
  "/assets/opening/foto-berdua.jpeg",
  "/assets/musics/soft.webm",
  "/assets/musics/soft.mp3",
  ...OPENING_BORDER_FLOWER_URLS,
] as const;
