# nextjs-wedding — Situs Undangan Pernikahan

Aplikasi web **undangan pernikahan digital** berbasis **Next.js**. Setiap tamu membuka **tautan pribadi** (alamat situs + kode nama); halaman menampilkan sapaan dengan nama mereka, informasi acara sesuai jenis undangan, galeri, dan formulir **RSVP**. Data tamu dan jawaban konfirmasi dikelola lewat **Google Sheets**; aset gambar di lingkungan produksi dapat dilayani lewat **CDN** (misalnya Cloudinary), dengan cadangan aset lokal di folder `public/`.

---

## Apa yang dibangun di proyek ini?

| Aspek | Ringkasan |
|-------|-----------|
| **Personalisasi** | Query `?to=...` pada URL menentukan tamu; jika tidak cocok dengan data, tamu melihat pesan bahwa undangan tidak ditemukan. |
| **Jenis undangan** | Nilai di spreadsheet mengatur apakah yang ditampilkan hanya akad, hanya resepsi, atau keduanya. |
| **RSVP** | Tamu mengirim konfirmasi lewat situs; nilai tertulis kembali ke spreadsheet (jawaban baru menggantikan yang lama jika dikirim ulang). |
| **Tautan undangan** | **Bukan** fitur tombol di aplikasi. Panitia mengisi kolom tautan di spreadsheet memakai **rumus** (seperti di Excel / Google Sheets) atau menyalin format yang sudah disepakati. |

Rencana fitur **komentar / buku tamu** masih **pertimbangan** untuk ke depan; lihat dokumen spesifikasi.

---

## Dokumentasi (Bahasa Indonesia)

Semua panduan proyek undangan ditulis dalam **Bahasa Indonesia**. Ringkasan isi folder dokumentasi:

| Lokasi | Fungsi |
|--------|--------|
| **[`docs/README.md`](docs/README.md)** | **Indeks dokumentasi** — penjelasan tiap berkas, untuk siapa, dan urutan baca yang disarankan. Mulai dari sini jika Anda mencari dokumen yang tepat. |
| [`docs/panduan-penggunaan.md`](docs/panduan-penggunaan.md) | Panduan untuk **panitia dan tamu** tanpa istilah teknis berat. |
| [`docs/spesifikasi-proyek.md`](docs/spesifikasi-proyek.md) | **Spesifikasi teknis**: struktur sheet, API RSVP, strategi aset, performa, contoh rumus tautan. |
| [`docs/desain-undangan.md`](docs/desain-undangan.md) | **Desain undangan**: visual, tipografi, section, copy; diisi bertahap bersama tim desain. |

---

## Teknologi utama

- **Framework:** Next.js (App Router, orientasi static-first)
- **Tampilan:** Tailwind CSS
- **Hosting:** Vercel (disarankan)
- **Data tamu:** Google Sheets
- **API:** Next.js Route Handler / API Route (serverless) untuk RSVP
- **Aset:** pengembangan dari berkas di proyek; produksi dari CDN dengan fallback ke `public/` jika CDN tidak dipakai atau tidak tersedia

Detail implementasi dan keputusan arsitektur ada di [`docs/spesifikasi-proyek.md`](docs/spesifikasi-proyek.md).

---

## Prasyarat

- **Node.js** — gunakan versi yang dicantumkan di [`.nvmrc`](.nvmrc) jika Anda memakai `nvm`.
- **npm** (atau `pnpm` / `yarn` / `bun` sesuai kebiasaan tim).

---

## Menjalankan proyek secara lokal

Pasang dependensi terlebih dahulu:

```bash
npm install
```

Jalankan server pengembangan:

```bash
npm run dev
```

Buka peramban di alamat [http://localhost:3000](http://localhost:3000). Perubahan pada berkas kode akan memperbarui tampilan secara langsung (hot reload).

Perintah lain yang tersedia:

| Perintah | Kegunaan |
|----------|----------|
| `npm run build` | Membangun versi produksi untuk memastikan tidak ada error build. |
| `npm run start` | Menjalankan hasil build secara lokal (setelah `npm run build`). |
| `npm run lint` | Memeriksa gaya kode dengan ESLint. |

---

## Variabel lingkungan & layanan luar

Salin [`.env.example`](.env.example) ke `.env.local`, lalu isi nilai Google Sheets dan (opsional) `NEXT_PUBLIC_*` untuk teks acara, galeri, hero, dan CDN. Untuk tab yang namanya rumit (`|`, `&`, dll.), set **`GOOGLE_SHEETS_SHEET_GID`** dari URL (`#gid=...`). Detail kolom sheet dan format RSVP ada di [`docs/spesifikasi-proyek.md`](docs/spesifikasi-proyek.md).

**Logging (server):** [Pino](https://getpino.io/) lewat `lib/logger.ts` — JSON di production (Vercel / log drain), `pino-pretty` di development. Atur `LOG_LEVEL`.

**Penting:** jangan mengunggah kunci rahasia ke repositori publik.

**Rute utama:** halaman undangan `/?to={slug}` · `POST /api/rsvp` (body JSON memakai field `slug`).

---

## Deploy

Cara umum untuk Next.js di **Vercel**: hubungkan repositori Git, tentukan perintah build bawaan (`next build`), dan atur variabel lingkungan di panel proyek. Panduan resmi Next.js tentang deployment tetap relevan untuk mekanisme teknis; kebutuhan bisnis undangan (domain, sheet, CDN) dirinci di dokumentasi proyek.

---

## Struktur repositori (orientasi)

- `app/` — halaman undangan (`page.tsx`), `app/api/rsvp` (handler tipis).
- `components/` — UI minimal (RSVP form, banner dev Sheets).
- `lib/constants/` — cache tag, keys sheet/RSVP, teks UI/API bahasa Indonesia (`messages.id.ts`).
- `lib/types/` — tipe `T*` (guest, sheet, RSVP, event).
- `lib/services/` — logika domain (mis. `rsvp.service.ts`).
- `lib/` — slug, event config, aset, Google Sheets, logger (Pino).
- `public/` — aset statis lokal (fallback dan pengembangan).
- `docs/` — dokumentasi proyek (indeks: [`docs/README.md`](docs/README.md)).

---

## Lisensi & privasi

Sesuaikan dengan keputusan pemilik proyek (hak cipta konten undangan, data tamu, kebijakan privasi).

---

## Referensi framework (opsional)

Dokumentasi resmi Next.js: [nextjs.org/docs](https://nextjs.org/docs). Berguna untuk tim pengembang; panitia undangan cukup memakai [`docs/panduan-penggunaan.md`](docs/panduan-penggunaan.md).
