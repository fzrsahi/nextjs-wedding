# Desain Undangan — Dokumentasi Detail

Dokumen ini menjadi **tempat utama** untuk membahas desain undangan secara lengkap: konsep visual, hierarki informasi, tipografi, warna, motion, dan penyalinan teks (copy). Spesifikasi stack, data sheet, API, dan alur teknis ada di **[spesifikasi proyek](./spesifikasi-proyek.md)**. Panduan untuk panitia/tamu tanpa jargon teknis ada di **[panduan penggunaan](./panduan-penggunaan.md)**.

---

## Status dokumen

| Bagian | Status |
|--------|--------|
| Arsitektur informasi (section halaman) | Referensi singkat + akan diperkaya |
| Visual identity (warna, font, mood) | *Akan diisi* |
| Hero & opening | *Akan diisi* |
| Detail section Akad / Resepsi | *Akan diisi* |
| Gallery & media | *Akan diisi* (selaras strategi aset: dev lokal, prod CDN + fallback `public/`) |
| Form RSVP (UX copy & layout) | *Akan diisi* |
| Responsif & aksesibilitas | *Akan diisi* |
| Referensi & moodboard | *Akan diisi* |

---

## Tujuan desain

- Menyambut tamu dengan **nama personal** dan nuansa yang selaras acara.
- Menyampaikan **waktu, lokasi, dress code** (jika ada) dengan jelas pada section yang relevan — dengan penyembunyian **Akad** / **Resepsi** sesuai `tipe` undangan (lihat spesifikasi teknis).
- Menjaga **performa**: gambar tidak membebani; di produksi memakai CDN, dengan fallback aset lokal jika perlu.

---

## Arsitektur informasi (draft)

Urutan section disarankan selaras dengan spesifikasi teknis; detail *bagaimana* tiap blok terlihat dijelaskan di sub-bab berikut (saat diisi):

1. **Opening** — sapaan + nama tamu.
2. **Hero / cover** — first impression, branding pasangan.
3. **Informasi acara** — blok Akad dan/atau Resepsi (conditional).
4. **Gallery** — kurasi foto/video (lazy load, format modern).
5. **RSVP** — form sesuai aturan `tipe` (satu jawaban vs akad+resepsi).

---

## Identitas visual

### Mood & kata kunci

*Contoh placeholder: elegan, hangat, editorial, minimal — ganti saat keputusan desain sudah fix.*

### Palet warna

| Token | Peran | Nilai (HEX / CSS) |
|-------|--------|-------------------|
| *—* | Latar utama | *TBD* |
| *—* | Teks utama | *TBD* |
| *—* | Aksen | *TBD* |

### Tipografi

| Peran | Font (family) | Catatan |
|-------|----------------|--------|
| Display / judul | *TBD* | Ukuran skala responsif |
| Body | *TBD* | Legibility mobile-first |

### Komponen berulang

- Tombol primer / sekunder (CTA RSVP, link maps).
- Kartu informasi acara (tanggal, waktu, venue).
- Pembatas antar-section (ornamen tipis / whitespace).

---

## Section per section (akan diperkaya)

### Opening

- *Copy contoh, alignment, apakah ada animasi reveal, dll.*

### Hero

- *Rasio aset, overlay teks, video vs gambar.*

### Akad & Resepsi

- *Layout maps, countdown opsional, ikon kalender.*

### Gallery

- *Grid vs carousel, lightbox, batas jumlah item.*

### RSVP

- *Label field, pesan sukses/error, privasi.*

---

## Motion & interaksi

- *Scroll reveal, hover halus, reduced-motion preference.*

---

## Aset desain & produksi

- **Development:** berkas di repo (`public/` atau struktur yang dipilih tim) untuk iterasi cepat.
- **Production:** URL CDN (Cloudinary); jika tidak tersedia, fallback ke path yang sama di `public/` agar halaman tetap utuh.

Detail nama file, ukuran export, dan pipeline upload: *TBD di dokumen ini.*

---

## Komentar / guestbook (opsi masa depan)

Fitur **komentar** dari tamu **sedang dipertimbangkan**; jika diadopsi, dampaknya ke desain (section baru, moderasi, privasi) akan ditambahkan di revisi dokumen ini.

---

## Checklist sebelum launch desain

- [ ] Semua teks legalitas / doa / quote disetujui.
- [ ] Proofread nama venue, tanggal, zona waktu.
- [ ] Uji di perangkat target (mobile utama).
- [ ] Lighthouse / performa gambar memenuhi target.

---

*Dokumen hidup — isi detail desain undangan di sini; root README mengarahkan ke file ini.*
