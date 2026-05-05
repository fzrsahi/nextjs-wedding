/** Aset penting pakai file lokal agar render stabil dan tidak bergantung request CDN. */
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
  "/assets/flowers/bunga-ayat.webp",
] as const;

/**
 * Aset yang WAJIB terload sebelum loading screen hilang.
 * Jika aset ini gagal/lambat, loading tidak boleh selesai.
 */
export const BLOCKING_CRITICAL_URLS = [
  CDN_AMPL_CLOSED,
  "/assets/background/background3.webp",
  ...OPENING_BORDER_FLOWER_URLS,
  "https://res.cloudinary.com/dg4xtvqwc/video/upload/v1777858107/soft_itp0ot.webm",
  "https://fonts.cdnfonts.com/s/39082/BrittanySignature-LjyZ.woff",
] as const;

/**
 * URL yang diprefetch sebelum undangan interaktif tampil.
 * Sekarang dipangkas hanya untuk aset yang benar-benar krusial agar loading cepat.
 */
export const CRITICAL_INVITE_PREFETCH_URLS = [
  ...BLOCKING_CRITICAL_URLS,
  "/assets/musics/soft.webm",
  "/assets/musics/soft.mp3",
] as const;
