# Panduan Penggunaan — Undangan Digital

Panduan ini untuk **siapa saja** yang mengurus data tamu atau membuka undangan: **tidak perlu paham pemrograman**. Kalau ada istilah teknis di bagian bawah, itu hanya tambahan penjelasan singkat.

---

## Ini sistemnya buat apa?

- Satu **situs undangan** yang tampilannya bisa **menyapa nama tamu** lewat **tautan khusus** per orang.
- Daftar tamu dan jawaban “datang / tidak” tersimpan di **Google Spreadsheet** (seperti Excel online) — mudah diedit bareng keluarga atau panitia.
- Tamu membuka tautan di HP atau laptop, baca informasi acara, lalu bisa **mengisi konfirmasi kehadiran (RSVP)** di situs tersebut.

---

## Peran: Anda sebagai panitia / pemilik data

Anda yang:

1. Mengisi atau mengubah data tamu di spreadsheet.
2. Membuat **tautan undangan** per tamu (bisa pakai **rumus** di spreadsheet — mirip formula Excel).
3. Mengirim tautan itu ke tamu (WhatsApp, SMS, email, dll.).
4. Memantau kolom **konfirmasi** untuk melihat siapa sudah menjawab.

**Catatan:** Situs undangan **tidak punya tombol “buat link otomatis”** di dalamnya. Membuat tautan dilakukan di spreadsheet dengan rumus atau disalin manual — supaya fleksibel tanpa ribet di website.

---

## Mengenal kolom di spreadsheet

Pastikan judul kolom mengikuti yang disepakati (supaya situs dan spreadsheet cocok). Arti singkat dalam bahasa sehari-hari:

| Kolom | Arti untuk Anda |
|-------|------------------|
| **no** | Nomor urut saja (memudahkan cari baris). |
| **group** | Kategori tamu, misalnya: keluarga, teman kantor, teman kuliah. Hanya untuk penataan Anda; tidak wajib tampil ke tamu. |
| **nama** | Nama yang **akan tampil** di undangan, misalnya: “Budi Santoso”. Tulis dengan benar ejaannya. |
| **ket** | Catatan internal Anda sebelum tamu jawab, misalnya perkiraan: datang / tidak / mungkin. Boleh dikosongkan jika tidak dipakai. |
| **tipe** | **Jenis undangan** — isi `akad`, `resepsi`, atau `keduanya` (huruf kecil / campuran, akan dinormalisasi). **Boleh dikosongkan:** sistem menganggap **keduanya** (akad + resepsi tampil). |
| **link** | **Tautan pribadi** untuk tamu ini (header kolom ditulis persis: `link`). Biasanya diisi otomatis dengan **rumus** dari nama atau kode pendek, lalu Anda salin untuk dikirim. |
| **konfirmasi** | Diisi **otomatis dari situs** setelah tamu mengirim RSVP. Anda **tidak perlu** mengetik manual di sini untuk jawaban resmi tamu. Kalau tamu mengubah jawaban, nilai di sini akan **diganti** dengan jawaban terbaru. |

---

## Arti “tipe” undangan (penting)

Ini menentukan **apa yang tamu lihat** di situs:

| Isi kolom **tipe** | Yang tamu lihat |
|--------------------|-----------------|
| **akad** | Informasi **akad** saja. |
| **resepsi** | Informasi **resepsi** saja. |
| **keduanya** | **Akad dan resepsi** keduanya ditampilkan. |

RSVP untuk tamu **keduanya** bisa lebih detail (misalnya jawab terpisah untuk akad dan resepsi), tergantung versi situs yang sudah jadi — intinya: **tipe** mengatur isi halaman.

---

## Cara menambah tamu baru (langkah sederhana)

1. Buka spreadsheet undangan.
2. Tambah **satu baris** di bawah data yang sudah ada.
3. Isi **no** (opsional tapi membantu), **group** (opsional), **nama** (wajib benar).
4. Isi **tipe** dengan salah satu: `akad`, `resepsi`, atau `keduanya`.
5. Isi **ket** jika Anda punya catatan internal (opsional).
6. Untuk kolom **link**:
   - Jika sudah ada **rumus** di baris atas, seret / salin rumus ke baris baru supaya tautan terbentuk sendiri, **atau**
   - Minta bantuan satu kali ke yang mengurus teknis untuk **contoh rumus** yang cocok dengan struktur kolom Anda.
7. **Jangan mengubah** isi kolom **konfirmasi** secara manual untuk jawaban tamu — biarkan dari situs. Kecuali Anda sengaja mengoreksi data secara administratif dan sepakat dengan tim.

Setelah kolom **link** terisi, **salin** isi sel itu dan kirim ke tamu.

---

## Tentang tautan undangan (tanpa istilah rumit)

- Bentuknya mirip: `https://alamat-situs-anda.com?to=nama-dengan-strip`
- Bagian setelah `to=` adalah **kode pendek** dari nama (biasanya huruf kecil, spasi jadi tanda `-`).
- Contoh nama di undangan: **Budi Santoso** → kode di tautan bisa seperti **budi-santoso**.
- **Satu tamu, satu tautan.** Jangan tukar tautan antar orang, supaya nama yang muncul di situs sesuai.

**Mengapa pakai rumus di spreadsheet?**  
Supaya Anda tidak perlu mengetik tautan panjang satu per satu. Spreadsheet bisa menggabungkan alamat situs + kode nama secara otomatis — sama seperti Anda pakai formula di Excel.

Kalau rumus error, cek: apakah **nama** sudah diisi, apakah huruf kolom dalam rumus sudah benar, dan apakah alamat situs sudah benar (termasuk `https://`).

---

## Setelah data siap: kirim ke tamu

1. Pastikan situs undangan **sudah online** (alamat yang dipakai di tautan sudah benar).
2. Uji **satu tautan** dulu di HP Anda: nama tamu muncul, informasi acara sesuai **tipe**.
3. Baru kirim ke tamu yang lain.

Cara kirim bebas: WhatsApp, email, SMS, dll. Yang penting tamu membuka **tautan mereka sendiri**.

---

## Peran: Anda sebagai tamu

1. Buka **tautan** yang dikirim panitia (biasanya dari chat).
2. Gulir halaman mengikuti alur undangan: biasanya **pembuka (opening)** → **quotes/ayat** → **pengenalan pengantin** (visual) → **detail acara dan hitung mundur** → **RSVP** → **gift** (jika ada) → **penutup (closing)**. Nama Anda biasanya muncul di bagian pengenalan; jadwal yang tampil mengikuti jenis undangan Anda.
3. Baca bagian **jadwal / lokasi** yang tampil — jumlahnya tergantung undangan Anda (hanya akad, hanya resepsi, atau keduanya).
4. Gulir ke bagian **RSVP** (konfirmasi kehadiran).
5. Pilih opsi yang tersedia, lalu kirim sesuai petunjuk di layar.
6. Jika Anda **mengubah pikiran**, kirim lagi RSVP — jawaban terbaru yang akan tercatat (mengganti yang lama).

### Jika muncul “Undangan tidak ditemukan”

Artinya tautan tidak cocok dengan data di spreadsheet. **Jangan panik:**

- Cek apakah tautan **lengkap** (tidak terpotong saat diteruskan).
- Pastikan Anda membuka tautan **yang memang untuk Anda**, bukan milik orang lain.
- Hubungi panitia agar mereka cek **nama / kode di tautan** di spreadsheet.

---

## Memantau siapa yang sudah RSVP (panitia)

1. Buka spreadsheet yang sama.
2. Lihat kolom **konfirmasi** pada baris tamu.
3. Nilai di situ diisi dari situs setelah tamu mengirim form.

Jika perlu laporan ke keluarga, Anda bisa **menyaring / mengurutkan** baris di spreadsheet seperti biasa (fitur filter Google Sheets / Excel).

---

## Yang mungkin hadir nanti (bukan fitur awal)

- **Komentar / buku tamu** dari pengunjung situs masih **pertimbangan** untuk ke depan — belum tentu ada di versi pertama.

---

## Glosarium singkat (kalau Anda bertemu istilah ini)

| Istilah | Arti singkat |
|---------|----------------|
| **Spreadsheet** | Lembar kerja berisi tabel (Google Sheets atau Excel). |
| **Tautan / link** | Alamat yang dibuka di browser, biasanya diawali `https://`. |
| **RSVP** | Konfirmasi dari tamu: datang atau tidak (dan variasi lain jika situs mendukung). |
| **Slug / kode di tautan** | Bagian nama yang dipendekkan dan diseragamkan untuk URL, misalnya `budi-santoso`. |

---

## Butuh bantuan teknis?

Hal teknis (pasang situs, koneksi spreadsheet, unggah foto) biasanya ditangani orang yang mengurus **website / IT**. Panduan untuk mereka ada di **[spesifikasi proyek](./spesifikasi-proyek.md)**. Tampilan undangan secara teknis di **[desain undangan teknis](./desain-undangan-teknis.md)**; kebutuhan dari klien di **[brief desain klien](./brief-desain-klien.md)**.

---

*Panduan ini disusun agar mudah dibaca; jika alur di situs final sedikit berbeda, sesuaikan dengan petunjuk dari tim yang mengerjakan website.*
