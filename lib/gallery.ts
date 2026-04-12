import "server-only";

import fs from "node:fs";
import path from "node:path";

import { getGalleryAssetPaths } from "@/lib/event-config";

/**
 * Foto fallback jika folder galeri kosong dan `NEXT_PUBLIC_GALLERY_PATHS` tidak diisi / tidak valid.
 * Tambah foto: letakkan berkas di `public/assets/gallery/` (mis. `2.jpeg`, `3.png`) lalu deploy ulang.
 */
export const GALLERY_FALLBACK_IMAGE = "/assets/opening/foto-berdua.jpeg";

const GALLERY_DIR = path.join(process.cwd(), "public", "assets", "gallery");

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

/**
 * Daftar path URL (`/assets/gallery/...`) dari isi folder `public/assets/gallery/`.
 * Urutan: nama berkas diurutkan (angka dalam nama diperhitungkan, mis. 2 sebelum 10).
 */
function listGalleryImagePathsFromDisk(): string[] {
  try {
    if (!fs.existsSync(GALLERY_DIR)) return [];
  } catch {
    return [];
  }

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(GALLERY_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base", numeric: true }),
    )
    .map((name) => `/assets/gallery/${name}`);
}

/** True jika `urlPath` menunjuk ke berkas yang ada di bawah `public/` (bukan pengecekan untuk URL absolut). */
function fileExistsUnderPublic(urlPath: string): boolean {
  if (/^https?:\/\//i.test(urlPath)) return true;
  const rel = urlPath.replace(/^\/+/, "");
  if (!rel || rel.includes("..")) return false;
  const abs = path.join(process.cwd(), "public", ...rel.split("/"));
  try {
    const st = fs.statSync(abs);
    return st.isFile();
  } catch {
    return false;
  }
}

/**
 * Path untuk `<img src>` — **selalu asal `/public` situs undangan**, tanpa CDN,
 * supaya foto di `public/assets/gallery/` tidak 404 bila CDN tidak memuat berkas yang sama.
 */
function resolveGalleryImageSrc(raw: string): string | null {
  const s = raw.trim();
  if (!s || s === "undefined" || s === "null") return null;

  if (/^https?:\/\//i.test(s)) {
    try {
      new URL(s);
      return s;
    } catch {
      return null;
    }
  }

  const relativeToPublic = s.replace(/^\/+/, "").replace(/^\.\//, "");
  if (!relativeToPublic) return null;
  return `/${relativeToPublic}`;
}

/**
 * Path gambar galeri untuk halaman undangan.
 *
 * Prioritas:
 * 1. `NEXT_PUBLIC_GALLERY_PATHS` — hanya dipakai jika tiap path **ada** di `public/` (atau URL `http(s)`).
 * 2. Berkas di `public/assets/gallery/`.
 * 3. Satu gambar {@link GALLERY_FALLBACK_IMAGE}.
 */
export function getResolvedGalleryPaths(): string[] {
  const fromEnvRaw = getGalleryAssetPaths()
    .map(resolveGalleryImageSrc)
    .filter((u): u is string => Boolean(u));

  const fromEnv = fromEnvRaw.filter((u) => fileExistsUnderPublic(u));
  if (fromEnv.length > 0) return fromEnv;

  const fromDisk = listGalleryImagePathsFromDisk()
    .map(resolveGalleryImageSrc)
    .filter((u): u is string => Boolean(u));
  if (fromDisk.length > 0) return fromDisk;

  const single =
    resolveGalleryImageSrc(GALLERY_FALLBACK_IMAGE) ?? GALLERY_FALLBACK_IMAGE;
  return [single];
}
