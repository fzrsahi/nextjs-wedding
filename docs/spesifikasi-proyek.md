# Spesifikasi Proyek & Arsitektur — Undangan Pernikahan

Dokumen ini adalah **spesifikasi teknis** (data, API, alur, performa). Urutan section dan copy UI-level **tidak** dijabarkan di sini; hal itu dibahas lebih lengkap di **[desain undangan](./desain-undangan.md)**.

Untuk **panduan pemakaian** yang mudah dibaca panitia dan tamu (non-programmer), lihat **[panduan penggunaan](./panduan-pengguna.md)**.

---

## Ringkasan

Situs undangan pernikahan berbasis **link personal** (`?to=slug-nama`), data tamu di **Google Sheets**, aset gambar di **Cloudinary** (produksi), deploy **Vercel**. RSVP di-update lewat **API Route** serverless. **Tidak ada fitur generate link di aplikasi** — link diisi admin lewat **rumus spreadsheet** (Excel / Google Sheets).

---

## Tech Stack

| Layer | Pilihan |
|-------|---------|
| Framework | **Next.js** (App Router, **static-first**) |
| Styling | **Tailwind CSS** |
| Hosting | **Vercel** |
| API | **Next.js API Route** (serverless) |
| Database | **Google Sheets** |
| Asset (produksi) | **Cloudinary** (CDN) |
| Asset (development) | Berkas di dalam repo Next.js (lihat [Strategi aset](#strategi-aset)) |

---

## Roadmap & Pertimbangan

| Item | Status |
|------|--------|
| **Komentar tamu** (guestbook / komentar) | **Dipertimbangkan** untuk pengembangan ke depan; belum masuk scope awal implementasi. |

---

## Strategi aset

| Lingkungan | Sumber aset | Catatan |
|------------|-------------|---------|
| **Development** | Aset disimpan di proyek Next.js (mis. `public/`, atau modul impor statis sesuai kebiasaan tim) | Memudahkan iterasi tanpa upload CDN. |
| **Production** | Utama: **CDN** (Cloudinary) | URL transformasi, caching edge, ukuran file terkontrol. |
| **Production — fallback** | Jika URL CDN **tidak tersedia** (env kosong, error load, atau keputusan deploy): ambil dari **`public/`** (Next.js) | Implementasi disarankan: helper satu pintu (`getAssetUrl(key)`) yang mencoba CDN lalu fallback ke path lokal. |

Prinsip: satu kontrak nama/key aset; sumber (CDN vs lokal) ditentukan oleh env dan ketersediaan, bukan dengan mengganti markup di banyak tempat.

---

## Struktur Google Sheets (Final)

Kolom sheet (header disarankan persis seperti ini agar mapping API konsisten):

| no | group | nama | ket | tipe | link | konfirmasi |
|----|-------|------|-----|------|------|------------|

### Penjelasan Field

| Field | Deskripsi |
|-------|-----------|
| **no** | Nomor urut (bantu admin sort / referensi). |
| **group** | Kategori tamu: keluarga, teman, kantor, dll. |
| **nama** | Nama tamu **yang ditampilkan** di website. |
| **ket** | Status awal dari admin: `datang`, `tidak`, `possible`. |
| **tipe** | Jenis undangan: `akad`, `resepsi`, `keduanya`. **Kosong** = di aplikasi dianggap `keduanya` (memudahkan sheet yang baru isi nama saja). |
| **link** | URL undangan personal; diisi admin (biasanya dengan **rumus** di spreadsheet, bukan dari fitur app). |
| **konfirmasi** | Hasil RSVP: `datang` atau `tidak`. Di-update API (overwrite). |

---

## Link undangan: rumus spreadsheet (bukan fitur app)

Aplikasi **tidak** menyediakan tombol atau endpoint untuk “generate link”. Admin memakai **Excel / Google Sheets** agar kolom **`link`** terisi otomatis dari nama atau dari kolom slug.

**Bisa?** Ya. Spreadsheet mendukung penggabungan teks (`&`, `CONCAT`), `LOWER`, `SUBSTITUTE` untuk mengganti spasi jadi `-`, dll.

### Contoh (Google Sheets / Excel modern)

Asumsi:

- Domain produksi di cell **satu tempat** (mis. `Settings!$B$1` = `https://domain.com`), atau string tetap di rumus.
- Layout umum: **A**=`no`, **B**=`group`, **C**=`nama`, **D**=`ket`, **E**=`tipe`, **F**=`link`, **G**=`konfirmasi` (sesuaikan jika urutan Anda beda).
- Baris pertama header, data mulai baris 2.

**Opsi A — isi sel kolom `link` (mis. F2): domain tetap, slug dari `nama` di C (spasi → strip):**

```excel
="https://domain.com?to="&LOWER(SUBSTITUTE(C2;" ";"-"))
```

Di Excel locale Indonesia pemisah argumen bisa koma: `SUBSTITUTE(C2," ","-")`.

**Opsi B — domain dari cell (mis. `$J$1`), slug di kolom dedikasi (mis. kolom `H`, bukan kolom `link`):**

```excel
=$J$1&"?to="&H2
```

**Catatan:** Nama dengan karakter khusus / banyak spasi beruntun mungkin perlu rumus tambahan (`TRIM`, ganda spasi, normalisasi aksen) atau kolom **slug** yang diisi manual agar cocok persis dengan yang dipakai app untuk `?to=`.

Slug yang dipakai website harus **sama** dengan yang ada di URL; rumus sheet wajib mengikuti aturan normalisasi yang sama dengan kode (dokumentasikan di satu tempat saat implementasi).

---

## Format Link Undangan

```
https://domain.com?to={slug-nama}
```

**Aturan slug (contoh):**

- Nama: `Budi Santoso` → slug: `budi-santoso`
- Normalisasi: huruf kecil, spasi → `-`, karakter aman: `a-z`, `0-9`, `-`.

Tamu membuka URL dengan query `to`; sistem mencocokkan slug dengan baris di sheet.

---

## Logic Utama

### 1. Identifikasi tamu

1. Baca query parameter `to`.
2. Cocokkan dengan data tamu (slug dari `nama` atau kolom slug jika ada).

### 2. Validasi

| Kondisi | Perilaku |
|---------|----------|
| Tamu **ditemukan** | Render undangan personal. |
| Tamu **tidak ditemukan** | **"Undangan tidak ditemukan"**. |

### 3. Logic tipe undangan

| `tipe` | `showAkad` | `showResepsi` |
|--------|------------|---------------|
| `akad` | `true` | `false` |
| `resepsi` | `false` | `true` |
| `keduanya` | `true` | `true` |

```text
showAkad    = tipe === "akad"    || tipe === "keduanya"
showResepsi = tipe === "resepsi" || tipe === "keduanya"
```

---

## Struktur Halaman (tingkat section)

Detail visual, tipografi, dan microcopy: **[desain undangan](./desain-undangan.md)**.

Urutan fungsional:

1. Opening (nama tamu)
2. Hero / cover
3. Informasi acara — Akad (conditional), Resepsi (conditional)
4. Gallery
5. RSVP

---

## Logic RSVP

### `tipe === "keduanya"`

Pilihan terpisah (akad / resepsi). **Implementasi saat ini** menyimpan satu nilai di kolom `konfirmasi` dengan format:

```text
akad:datang;resepsi:tidak
```

(nilai `datang` / `tidak` per segmen; huruf kecil.)

### `tipe === "akad"` atau `resepsi`

Satu nilai di kolom `konfirmasi`: `datang` | `tidak`.

---

## API RSVP

| Item | Nilai |
|------|--------|
| Method | `POST` |
| Path | `/api/rsvp` |

### Payload (contoh)

**Tipe satu acara (`akad` / `resepsi`):**

```json
{
  "slug": "budi-santoso",
  "konfirmasi": "datang"
}
```

**Tipe `keduanya`:**

```json
{
  "slug": "budi-santoso",
  "konfirmasiAkad": "datang",
  "konfirmasiResepsi": "tidak"
}
```

Field identitas tamu memakai **`slug`** (bukan `nama`) agar konsisten dengan query `?to=`.

### Proses API

1. Validasi payload.
2. Cari baris tamu di sheet.
3. Update kolom `konfirmasi` (satu nilai teks; untuk `keduanya` memakai format `akad:…;resepsi:…`).
4. Overwrite jika sudah ada.
5. Response JSON + status HTTP.

---

## Flow Sistem

### Admin

1. Input / edit data di Google Sheets.
2. Isi kolom **`link`** dengan rumus (atau salin dari kolom formula); **tanpa** fitur generate di website.
3. Kirim link ke tamu.

### Tamu

1. Buka `?to=...`.
2. Konten mengikuti `tipe`.
3. RSVP.

### Sistem

1. Baca data dari sheet (sesuai strategi static/ISR).
2. Render + terima `POST /api/rsvp`, tulis ke sheet.

---

## Strategi Performa

| Strategi | Tujuan |
|----------|--------|
| Static rendering | TTFB cepat. |
| CDN untuk aset produksi | LCP, caching. |
| Gambar tidak berlebihan | Hemat bandwidth. |
| API serverless | RSVP ringan. |

Jangan expose kredensial Google ke client.

---

## Validasi & Edge Cases

| Skenario | Perilaku |
|----------|----------|
| `to` tidak match | **Undangan tidak ditemukan**. |
| RSVP valid | Update sheet, sukses. |
| RSVP invalid | 4xx. |
| RSVP ulang | Overwrite. |

---

## Kesimpulan

- Next.js fullstack ringan; Sheets sebagai sumber data; API untuk RSVP; CDN untuk aset produksi dengan fallback `public/`.
- Link personal hanya dari **spreadsheet + rumus**, bukan dari fitur aplikasi.

---

*Dokumen teknis; diperbarui seiring implementasi.*
