# Dokumentasi Proyek — nextjs-wedding

Folder **`docs/`** berisi **semua dokumen panduan dan spesifikasi** untuk proyek situs undangan pernikahan ini. Isinya **Bahasa Indonesia** agar panitia, desainer, dan pengembang bisa selaras tanpa campur bahasa yang tidak perlu.

Dokumen di sini **melengkapi** [README utama di root](../README.md): README root fokus pada gambaran proyek, cara jalanin kode secara lokal, dan tautan masuk ke folder ini. Di **`docs/README.md`** (halaman ini) Anda mendapat **peta isi** dan saran urutan baca.

---

## Daftar dokumen

| Berkas | Untuk siapa? | Apa isinya? |
|--------|----------------|-------------|
| [**panduan-penggunaan.md**](panduan-penggunaan.md) | **Panitia**, keluarga yang urus data tamu, dan **tamu** yang hanya perlu tahu cara pakai undangan | Penjelasan sederhana: arti kolom spreadsheet, cara tambah tamu, cara kirim tautan (termasuk konsep rumus di sheet, **tanpa** fitur generate link di website), cara RSVP, dan apa yang dilakukan jika muncul “undangan tidak ditemukan”. **Tidak** mengandalkan istilah pemrograman. |
| [**spesifikasi-proyek.md**](spesifikasi-proyek.md) | **Pengembang** dan orang yang urus integrasi (Sheets, hosting, CDN) | Spesifikasi teknis: stack, struktur kolom Google Sheets, format URL `?to=`, logika tipe undangan (akad / resepsi / keduanya), kontrak API RSVP, alur admin–tamu–sistem, strategi aset (dev lokal, produksi CDN + fallback `public/`), performa, validasi, contoh rumus spreadsheet untuk kolom tautan, serta roadmap (misalnya fitur komentar yang masih dipertimbangkan). |
| [**desain-undangan.md**](desain-undangan.md) | **Desainer**, **penulis konten**, dan pengembang front-end | Dokumen hidup untuk **tampilan dan pengalaman**: mood, warna, font, urutan section halaman, hero, galeri, form RSVP dari sisi copy dan layout. Spesifikasi teknis dan cara isi sheet **tidak** diulang di sini; dirujuk ke `spesifikasi-proyek.md`. |

---

## Urutan baca yang disarankan

### Saya panitia / keluarga (bukan tim IT)

1. [panduan-penggunaan.md](panduan-penggunaan.md) — cukup untuk operasional harian.  
2. Jika perlu tahu **mengapa** kolom sheet tertentu ada atau bagaimana RSVP tersimpan, buka sekilas bagian terkait di [spesifikasi-proyek.md](spesifikasi-proyek.md) atau tanyakan ke tim pengembang.

### Saya pengembang / yang urus website

1. [README di root](../README.md) — prasyarat, `npm run dev`, gambaran teknologi.  
2. [spesifikasi-proyek.md](spesifikasi-proyek.md) — sumber kebenaran untuk implementasi.  
3. [desain-undangan.md](desain-undangan.md) — supaya UI mengikuti keputusan desain dan konten.  
4. [panduan-penggunaan.md](panduan-penggunaan.md) — berguna agar fitur yang dibuat **masuk akal** untuk user non-teknis (misalnya teks error, alur isi sheet).

### Saya desainer / konten

1. [desain-undangan.md](desain-undangan.md) — tempat utama mengisi brief visual dan copy.  
2. [spesifikasi-proyek.md](spesifikasi-proyek.md) — bagian struktur section dan conditional akad/resepsi agar desain **selaras** dengan data `tipe` undangan.  
3. [panduan-penggunaan.md](panduan-penggunaan.md) — memahami apa yang panitia dan tamu alami di lapangan.

---

## Konsistensi antar dokumen

- **Tautan undangan** selalu dijelaskan sebagai: spreadsheet + rumus (atau salin manual), **bukan** tombol di aplikasi.  
- **Bahasa Indonesia** dipakai di seluruh dokumen di folder ini; istilah teknis global (Next.js, API, CDN) tetap dipakai jika sudah umum di industri, dengan penjelasan singkat di panduan pengguna bila perlu.  
- Jika ada perubahan besar alur (misalnya kolom sheet tambahan atau RSVP dua jalur untuk “keduanya”), **perbarui** `spesifikasi-proyek.md` terlebih dahulu, lalu sesuaikan `panduan-penggunaan.md` dan bagian relevan di `desain-undangan.md`.

---

## Menambah dokumen baru di folder ini

Jika nanti ada dokumen tambahan (misalnya checklist hari-H, template pesan WA), tambahkan barisnya ke **tabel Daftar dokumen** di atas dan sebutkan di [README root](../README.md) jika dokumen itu penting untuk semua peran.

---

*Indeks dokumentasi proyek undangan. Perbarui tabel dan urutan baca ketika isi proyek bertambah.*
