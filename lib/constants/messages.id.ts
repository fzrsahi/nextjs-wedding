/**
 * Indonesian copy for UI and JSON API responses only.
 * Code, logs, and types remain English elsewhere.
 */

export const UI_INVITE_LINK_INCOMPLETE_TITLE = "Tautan undangan tidak lengkap";
export const UI_INVITE_LINK_INCOMPLETE_DESC =
  "Pastikan Anda membuka undangan lewat tautan yang dikirim panitia (berisi parameter to).";

export const UI_GUEST_NOT_FOUND_TITLE = "Undangan tidak ditemukan";
export const UI_GUEST_NOT_FOUND_DESC =
  "Periksa kembali tautan atau hubungi panitia jika menurut Anda ini kesalahan.";

export const API_RSVP_SHEETS_NOT_READY =
  "RSVP belum dikonfigurasi (Google Sheets).";
export const API_RSVP_INVALID_JSON = "Body JSON tidak valid.";
export const API_RSVP_SLUG_REQUIRED = "Field slug wajib diisi.";
export const API_RSVP_GUEST_NOT_FOUND = "Tamu tidak ditemukan.";
export const API_RSVP_SHEET_LAYOUT_INVALID = "Struktur sheet tidak valid.";
export const API_RSVP_DUAL_FIELDS_REQUIRED =
  "Untuk undangan akad + resepsi, kirim konfirmasiAkad dan konfirmasiResepsi (datang|tidak).";
export const API_RSVP_SINGLE_FIELD_REQUIRED =
  "Field konfirmasi wajib: datang atau tidak.";
export const API_RSVP_SHEET_WRITE_FAILED = "Gagal menulis ke spreadsheet.";

export const UI_RSVP_FORM_TITLE = "Konfirmasi kehadiran";
export const UI_RSVP_AKAD_LABEL = "Kehadiran di akad";
export const UI_RSVP_RESEPSI_LABEL = "Kehadiran di resepsi";
export const UI_RSVP_ATTENDING = "Datang";
export const UI_RSVP_NOT_ATTENDING = "Tidak dapat hadir";
export const UI_RSVP_SINGLE_PROMPT = "Apakah Anda dapat hadir?";
export const UI_RSVP_SUBMIT = "Kirim konfirmasi";
export const UI_RSVP_SUBMITTING = "Mengirim…";
export const UI_RSVP_SUCCESS = "Konfirmasi tersimpan. Terima kasih!";
export const UI_RSVP_ERROR_GENERIC = "Terjadi kesalahan.";
export const UI_RSVP_ERROR_NETWORK = "Jaringan bermasalah. Coba lagi.";

export const UI_DEV_SHEETS_BANNER =
  "Mode dev: Google Sheets belum dikonfigurasi. Isi .env.local (lihat .env.example).";
