# Brief desain dari klien

Dokumen ini berisi **jawaban klien** (kebutuhan non-teknis) dan alur singkat. Spesifikasi implementasi UI ada di **[desain undangan teknis](./desain-undangan-teknis.md)**.

---

## Alurnya

1. Klien mengisi kebutuhan desain (sudah tercatat di dokumen ini).
2. Tim menerjemahkan ke tampilan undangan di website.
3. Panitia mengisi data tamu di spreadsheet; tiap tamu mendapat **link khusus**.
4. Tamu membuka link → melihat undangan (nama mereka) → mengisi **konfirmasi hadir (RSVP)**.

Yang **sudah otomatis** dari sistem: nama tamu per link, undangan akad/resepsi sesuai jenis tamu, form RSVP.

---

## Jawaban klien

| # | Pertanyaan | Jawaban |
|---|------------|---------|
| 1 | Tema undangan | Bunga, minimalis |
| 2 | Base warna (warna utama) | Silver, white, deep green |
| 3 | Warna tambahan / kombinasi (opsional) | Maroon |
| 4 | Gaya desain | Elegant simple |
| 5 | Referensi desain | [TikTok 1](https://vt.tiktok.com/ZSuVUHuwE/), [TikTok 2](https://vt.tiktok.com/ZSHUa7Gad/), [TikTok 3](https://vt.tiktok.com/ZSHUmt39g/) |
| 6 | Font / gaya tulisan | Klasik santai |
| 7 | Foto yang digunakan | Prewedding |
| 8 | Jumlah foto galeri | Banyak |
| 9 | Background music | Ya |
| 10 | Jenis / referensi lagu | Lany — *Soft* |
| 11 | Animasi saat membuka undangan | Ya — **selaras dengan feel di link referensi** (TikTok) |
| 12 | Gaya bahasa undangan (isi teks) | Formal |

### Section yang diinginkan

- Opening screen  
- Section quotes / ayat Al-Qur’an *(simple, elegan)*  
- Visual panel — **pengenalan pengantin** *(ornamen floral + panel/kartu aesthetic seperti referensi; bisa mencakup foto, nama tamu, story singkat, galeri sesuai desain final)*  
- Detail acara + **countdown**  
- RSVP / konfirmasi kehadiran tamu *(form)*  
- Gift / amplop digital *(butuh copy teks + data rekening/QR dari klien saat implementasi)*  
- **Closing** — penutup *(ucapan terima kasih / salam penutup, dekor ringan)*  

Urutan flow yang diinginkan:
1) Opening → 2) Quotes/ayat → 3) Visual panel (pengenalan pengantin) → 4) Detail acara + countdown → 5) RSVP → 6) Gift → 7) Closing

---

## Catatan singkat untuk tim

- **Musik di HP:** biasanya perlu interaksi pengguna (tombol play) dulu; tidak memutar otomatis keras.
- **Ucapan tamu di halaman** (buku tamu digital): belum di versi awal proyek — jika diminta, direncanakan terpisah.
- **Referensi TikTok:** jadikan acuan mood, transisi, dan “feel” buka undangan; hindari menyalin aset berhak cipta tanpa izin.

---

- **Desain teknis (token, komponen, motion, audio):** [desain-undangan-teknis.md](./desain-undangan-teknis.md)  
- **Data, API, sheet:** [spesifikasi-proyek.md](./spesifikasi-proyek.md)  
- **Panitia & tamu:** [panduan-penggunaan.md](./panduan-penggunaan.md)
