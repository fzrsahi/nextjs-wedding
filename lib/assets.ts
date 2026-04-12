/**
 * URL aset: produksi pakai CDN bila NEXT_PUBLIC_CDN_BASE_URL diset;
 * selain itu path relatif ke /public.
 */
export function getAssetUrl(path: string): string {
  const normalized = path.replace(/^\/+/, "");
  const base = process.env.NEXT_PUBLIC_CDN_BASE_URL?.trim().replace(/\/+$/, "");
  if (base) {
    return `${base}/${normalized}`;
  }
  return `/${normalized}`;
}
