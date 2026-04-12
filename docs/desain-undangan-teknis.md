# Desain undangan — spesifikasi teknis

Dokumen ini menjelaskan **cara menerjemahkan brief ke implementasi** (warna, tipografi, struktur halaman, motion, audio, aset). Sumber kebutuhan bisnis/non-teknis: **[brief desain klien](./brief-desain-klien.md)**. Arsitektur data & API: **[spesifikasi proyek](./spesifikasi-proyek.md)**.

**Prinsip utama implementasi:** desain diprioritaskan untuk **mobile terlebih dahulu** (mobile-first), lalu diadaptasi ke tablet/desktop.

---

## 1. Ringkasan arah desain (dari brief)

| Aspek | Arah implementasi |
|--------|-------------------|
| Mood | Bunga + **minimalis**, **elegant simple** — ornamen floral ringan, tidak ramai |
| Palet | **Silver, white, deep green** sebagai basis; **maroon** sebagai aksen sekunder |
| Tipografi | **Klasik santai** untuk judul/display; isi teks mengikuti **formal** (brief klien) |
| Referensi gerak | 3 link TikTok di brief = acuan **mood & transisi**, bukan salinan pixel-perfect |
| Galeri | **Banyak** foto — perlu grid, lazy load, ukuran file terkontrol |
| Audio | Musik latar dengan **gesture user** (play eksplisit) |

---

## 2. Stack & tempat ubah di kode

| Lapisan | Teknologi | Berkas / area utama |
|---------|-----------|---------------------|
| Framework | Next.js App Router | `app/page.tsx`, `app/layout.tsx` |
| Gaya | Tailwind CSS v4 | `app/globals.css` (`@theme`, variabel), class di komponen |
| Font | `next/font` (disarankan) | `app/layout.tsx` — daftarkan pasangan font display + body |
| Aset gambar | CDN + fallback `public/` | `lib/assets.ts`, env `NEXT_PUBLIC_*` (lihat spesifikasi proyek) |
| Konten acara | Konfig terpusat | `lib/event-config.ts` |
| RSVP | Server action / API | `components/RsvpForm.tsx`, `app/api/rsvp` |

---

## 3. Design tokens (usulan)

Definisikan di `:root` (light) di `globals.css` atau lewat `@theme inline` agar konsisten dengan Tailwind.

| Token | Keterangan | Nilai awal (disepakati desainer) |
|-------|------------|----------------------------------|
| `--color-primary` | Deep green utama | Contoh: `#1f4d3a` untuk heading, tombol utama |
| `--color-secondary` | Silver | Contoh: `#c0c0c0` untuk border/ornamen tipis |
| `--color-accent` | Maroon (aksen) | Contoh: `#7a1f2b` — dipakai hemat pada highlight penting |
| `--color-surface` | Latar section / kartu | White `#ffffff` atau off-white netral agar tetap elegan |
| `--color-ink` | Teks utama | Charcoal `#1f2937` atau deep green gelap, cek kontras WCAG |

**Catatan:** silver + white berisiko kurang kontras jika terlalu dekat tone-nya. Pastikan teks body tetap gelap dan maroon dipakai sebagai aksen, bukan warna teks utama panjang.

---

## 4. Tipografi

- **Display / judul:** font serif klasik atau humanist (contoh arah: Cormorant Garamond, Libre Baskerville, atau Playfair Display) — bobot medium/semibold.
- **Body / formulir:** font sans atau serif yang tetap terbaca di HP; ukuran minimum **16px** untuk input (hindari zoom iOS yang mengganggu).
- **Bahasa:** string UI bisa dikelola di `lib/constants/messages.id.ts`; nada **formal** sesuai brief.

Implementasi: impor via `next/font/google`, terapkan ke `body` dan utility heading (bisa `className` di `layout.tsx` atau map ke `--font-sans` / `--font-display` di `@theme`).

---

## 5. Arsitektur informasi & pemetaan section

Urutan **target** (selaras [brief klien](./brief-desain-klien.md) + [struktur halaman di spesifikasi](./spesifikasi-proyek.md)):

1. **Opening** — layar pembuka / reveal ke konten (animasi sesuai referensi; `prefers-reduced-motion` harus mengurangi atau mematikan gerak berlebihan).
2. **Quotes / ayat** — ayat Al-Qur’an atau kutipan singkat; konten statis / env / konfig terpusat; tipografi elegan, tidak ramai.
3. **Visual panel (pengenalan pengantin)** — panel aesthetic (ornamen floral ringan, referensi TikTok = mood saja): mis. **hero** gambar besar (`NEXT_PUBLIC_HERO_IMAGE_PATH` + `getAssetUrl`), **sapaan nama tamu** dari sheet, **story pasangan** (teks dari env / `lib/` / MDX jika nanti), dan **galeri** banyak foto (`getGalleryAssetPaths()`, grid + `loading="lazy"`, aspect ratio konsisten) jika dipetakan di blok ini — satu kesatuan visual “kenalan” dengan pasangan.
4. **Detail acara + countdown** — **Akad** / **Resepsi** **conditional** menurut `invitationKind` (`lib/guest.ts`); **countdown** ke tanggal acara (`lib/event-config.ts`, komponen client); **peta / lokasi** (embed atau tombol “Buka di Google Maps” dari `event-config`). Tampilan akhir menggantikan `pre` JSON debug.
5. **RSVP** — `RsvpForm` (sudah ada).
6. **Gift / amplop digital** — teks dari konfig, QR/rekening (gambar QR dari aset); **butuh konten final dari klien**.
7. **Closing** — penutup: ucapan terima kasih / salam, baris nama atau doa singkat, ornamen minimal; tidak memerlukan interaksi berat.

**Status implementasi saat ini:** `app/page.tsx` masih **placeholder** (debug sheet, JSON jadwal). Dokumen ini menjadi acuan saat **refactor UI** ke layout di atas.

---

## 6. Motion & interaksi

- **Entrance:** fade + slide ringan atau “buka amplop” abstrak (CSS `animation` / Framer Motion jika ditambahkan dependency — pertimbangkan bundle size).
- **Durasi:** preferensi umum 300–600ms untuk transisi; hindari loop yang mengganggu.
- **Aksesibilitas:** hormati `prefers-reduced-motion: reduce` (kurangi transform, nonaktifkan autoplay dekoratif).

### 6.1 Opening section (OpeningGate)

Konsep: layar penuh pertama kali yang muncul sebelum konten undangan utama.

- **Latar:** gradasi lembut dari putih ke silver sangat muda; bisa ditambah tekstur tipis (noise halus) agar tidak terlalu flat.
- **Elemen utama:** bentuk amplop / kartu abstrak dengan warna:
  - badan amplop / kartu: deep green (`--color-primary`)
  - penutup / flap atau pita: maroon (`--color-accent`)
  - bayangan lembut ke bawah agar terasa mengambang.
- **Foto kecil:** opsional dua foto monokrom/low-saturation yang “keluar” sedikit dari amplop, terinspirasi referensi yang diberikan, tapi tidak wajib di versi pertama.
- **Copy teks:** tulisan display “Anda Dijemput” atau sapaan setara di bawah amplop, memakai font klasik-santai, warna deep green atau maroon.

**Alur animasi dasar:**

1. Layar fade-in dari putih → latar silver/white.
2. Amplop/kartu muncul dengan scale-up kecil dari 0.9 → 1 dan opacity 0 → 1 (durasi ~400ms).
3. Flap/panel penutup “terbuka” dengan animasi rotateX atau slide-up (durasi ~500ms); pada mode `prefers-reduced-motion` cukup ubah opacity/translate ringan.
4. Teks “Anda Dijemput” dan tombol/indikator “Scroll untuk melihat undangan” fade-in setelah flap terbuka.
5. Setelah animasi selesai, user bisa:
   - scroll ke bawah untuk melihat konten utama, atau
   - klik tombol kecil “Lihat undangan” yang melakukan scroll ke **section quotes/ayat** (konten pertama setelah opening).

Catatan implementasi:

- OpeningGate dibuat sebagai **client component** terpisah, muncul paling atas di `app/page.tsx`.
- Berikan state untuk:
  - status “sudah dibuka” (supaya kalau user reload, bisa pilih untuk skip animasi penuh),
  - menghormati `prefers-reduced-motion`.
- Jangan memblokir scroll total terlalu lama: animasi sebaiknya selesai < 1.5 detik sebelum user bebas bergerak.

---

## 7. Audio latar

- **Browser:** tidak mengandalkan autoplay bersuara; sediakan kontrol **Play / Pause** yang jelas.
- **Sumber file:** file audio di CDN atau `public/` (format MP3/AAC); path lewat env misalnya `NEXT_PUBLIC_BG_MUSIC_URL`.
- **Legal:** lagu komersil memerlukan lisensi; untuk produksi, konfirmasi ke klien atau ganti ke trek bebas lisensi dengan mood serupa.

---

## 8. Ornamen & tema “bunga”

- Prioritas **minimalis:** pola SVG tipis, border floral sederhana, atau ilustrasi satu titik fokus — hindari background foto bunga full-bleed yang mengganggu teks.
- Aset dekoratif: SVG inline atau file di `public/images/decor/`, optimasi ukuran.

---

## 9. Responsif & performa

- **Mobile-first adalah prioritas utama**; baseline desain, spacing, tipografi, dan alur interaksi ditetapkan dari viewport HP terlebih dahulu.
- `max-w-xl` atau sedikit lebih lebar jika desain membutuhkan — tetap nyaman dibaca satu tangan.
- Gambar: lebar adaptif, `sizes` untuk `next/image` jika migrasi dari `<img>`.
- **Core Web Vitals:** LCP utama biasanya elemen visual besar pertama di **visual panel (pengenalan pengantin)**; prioritas load tinggi untuk hero / foto utama di blok tersebut.

---

## 10. Komponen yang layak dipisah (rencana)

| Komponen | Tanggung jawab |
|----------|----------------|
| `OpeningGate` atau sejenis | Overlay pembuka + animasi + lanjut ke konten |
| `QuotesSection` | Ayat / kutipan setelah opening |
| `CoupleIntroPanel` (visual panel) | Ornamen + hero, sapaan tamu, story, galeri (sesuai desain final) |
| `InvitationHero` | Hero image + optional judul *(bisa hidup di dalam `CoupleIntroPanel`)* |
| `CoupleStory` | Teks story *(bisa hidup di dalam `CoupleIntroPanel`)* |
| `GalleryGrid` | Grid banyak foto *(bisa hidup di dalam `CoupleIntroPanel`)* |
| `EventSchedule` | Akad/resepsi terformat (bukan JSON mentah) |
| `CountdownSection` | Client-only countdown |
| `VenueMap` | Link / embed peta |
| `RsvpForm` / wrapper section | RSVP |
| `GiftSection` | Rekening / QR / copy |
| `ClosingSection` | Penutup halaman (terima kasih, salam, footer ringan) |

Pisahkan **server vs client** jelas: data tamu tetap di server component; countdown, audio, dan opening interaktif di client (`"use client"`).

---

## 11. Tautan silang

- **Brief klien (warna, section, musik):** [brief-desain-klien.md](./brief-desain-klien.md)  
- **Sheet, RSVP API, URL tamu:** [spesifikasi-proyek.md](./spesifikasi-proyek.md)  
- **Operasional panitia:** [panduan-penggunaan.md](./panduan-penggunaan.md)
