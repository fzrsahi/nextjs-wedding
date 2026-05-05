import { COMMENT_MAX_LENGTH } from "@/lib/constants/comments";

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

/** Layar awal sementara gambar & font undangan disiapkan */
export const UI_INVITE_INITIAL_LOADING = "Loading...";

/** Pratinjau tautan (Open Graph / WhatsApp, iMessage, dll.) */
export const UI_OG_SITE_NAME = "Undangan Pernikahan";

/** Judul & deskripsi bila tautan dibuka tanpa `?to=` (pratinjau tanpa konteks tamu) */
export const UI_OG_INCOMPLETE_TITLE = "Undangan pernikahan";
export const UI_OG_INCOMPLETE_DESCRIPTION =
  "Mohon buka tautan lengkap dari pesan undangan Anda (WhatsApp, email, atau undangan cetak). Pratinjau ini tidak menampilkan detail acara.";

/** Pratinjau bila slug tamu tidak dikenal */
export const UI_OG_NOT_FOUND_TITLE = "Undangan tidak ditemukan";
export const UI_OG_NOT_FOUND_DESCRIPTION =
  "Tautan ini tidak cocok dengan daftar tamu. Periksa penulisan alamat atau minta tautan terbaru kepada mempelai.";

/** Judul pratinjau undangan valid — `coupleHeading` dari env (mis. nama mempelai) */
export function uiOgInviteTitle(guestDisplayName: string): string {
  return `Hi ${guestDisplayName}, You're Invited to Our Wedding`;
}

/** Deskripsi pratinjau undangan personal — `guestDisplayName` dari spreadsheet */
export function uiOgInviteDescription(): string {
  return "Come witness our little forever begin. Bring your smiles, prayers, and maybe a happy tear or two.";
}

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

export const API_COMMENT_SHEETS_NOT_READY =
  "Komentar belum dikonfigurasi (sheet komentar belum siap).";
export const API_COMMENT_INVALID_JSON = "Body JSON tidak valid.";
export const API_COMMENT_SLUG_REQUIRED = "Field slug wajib diisi.";
export const API_COMMENT_GUEST_NOT_FOUND = "Tamu tidak ditemukan.";
export const API_COMMENT_MESSAGE_REQUIRED = "Pesan wajib diisi.";
export const API_COMMENT_MESSAGE_TOO_LONG = `Pesan maksimal ${COMMENT_MAX_LENGTH} karakter.`;
export const API_COMMENT_SHEET_WRITE_FAILED =
  "Gagal menulis komentar ke spreadsheet.";

/** RSVP slide cinematic — English (readable on narrow oval frame). */
export const UI_RSVP_SECTION_KICKER = "RSVP";
export const UI_RSVP_FORM_TITLE = "Attendance";
export const UI_RSVP_SECTION_INTRO =
  "It would mean the world to have you with us. Please let us know if you can make it.";
export const UI_RSVP_AKAD_LABEL = "Akad Nikah";
export const UI_RSVP_RESEPSI_LABEL = "Resepsi";
export const UI_RSVP_ATTENDING = "Attending";
export const UI_RSVP_NOT_ATTENDING = "Unable to attend";
export const UI_RSVP_SINGLE_PROMPT = "Will you be joining us?";
export const UI_RSVP_SUBMIT = "Submit";
export const UI_RSVP_SUBMITTING = "Sending…";
export const UI_RSVP_SUCCESS = "Saved. Thank you!";
export const UI_RSVP_ERROR_GENERIC = "Something went wrong.";
export const UI_RSVP_ERROR_NETWORK = "Network error. Please try again.";

export const UI_DEV_SHEETS_BANNER =
  "Mode dev: Google Sheets belum dikonfigurasi. Isi .env.local (lihat .env.example).";

export const UI_STORY_ROADMAP_KICKER = "Perjalanan kami";
export const UI_STORY_ROADMAP_TITLE = "Cerita awal kami";

export const UI_DRESSCODE_TITLE = "Dresscode";
/** Satu pesan: tanpa menyarankan warna gelap — fokus hindari dominan putih. */
export const UI_DRESSCODE_BODY =
  "To keep the day beautifully balanced, we kindly suggest avoiding all-white outfits. Let the bride have her tiny main-character moment.";

export const UI_GALLERY_KICKER = "Momen";
export const UI_GALLERY_TITLE = "Galeri foto";
export const UI_GALLERY_INTRO =
  "Beberapa potret yang kami kenang bersama—dengan penuh sukacita kami ingin berbagi kehangatannya dengan Anda.";
export const UI_GALLERY_LIGHTBOX_CLOSE = "Tutup";
export const UI_GALLERY_LIGHTBOX_PREV = "Foto sebelumnya";
export const UI_GALLERY_LIGHTBOX_NEXT = "Foto berikutnya";
export const UI_GALLERY_TAP_TO_EXPAND = "Ketuk foto untuk tampilan layar penuh";
export const UI_GALLERY_HOVER_HINT = "Layar penuh";

export const UI_GIFT_KICKER = "Amplop digital";
export const UI_GIFT_TITLE = "Hadiah & angpao";
export const UI_GIFT_INTRO =
  "Kehadiran Anda adalah berkah terindah. Bila berkenan menyisihkan tanda kasih, kami menyediakan rekening berikut—tanpa ada paksaan.";
export const UI_GIFT_BANK_LABEL = "Bank";
export const UI_GIFT_ACCOUNT_NAME_LABEL = "Atas nama";
export const UI_GIFT_ACCOUNT_NUMBER_LABEL = "Nomor rekening";
export const UI_GIFT_COPY_NUMBER = "Salin nomor";
export const UI_GIFT_COPIED = "Tersalin";
export const UI_GIFT_COPY_FAILED = "Gagal menyalin — coba pilih manual";

export const UI_CLOSING_KICKER = "Penutup";
export const UI_CLOSING_HEADLINE = "Terima kasih";
export const UI_CLOSING_BODY =
  "Atas segala doa, restu, dan kehadiran yang telah Anda persiapkan, kami ucapkan terima kasih yang tulus. Semoga Allah membalas kebaikan Anda berlipat ganda.";
export const UI_CLOSING_NAMES_PREFIX = "Kami yang berbahagia,";
export const UI_CLOSING_WASSALAM =
  "Wassalamu'alaikum warahmatullahi wabarakatuh";

export const UI_COMMENT_BUTTON = "Notes";
export const UI_COMMENT_KICKER = "Guestbook";
export const UI_COMMENT_TITLE = "Sweet Wishes";
export const UI_COMMENT_INTRO =
  "Leave a soft little note for the couple. Every message can also drift gently across the invitation.";
export const UI_COMMENT_EMPTY =
  "No notes yet. Be the first to leave a warm wish for the happy couple.";
export const UI_COMMENT_LIST_ARIA = "Guest comments";
export const UI_COMMENT_CLOSE = "Close comments";
export const UI_COMMENT_OPEN = "Open comments";
export const UI_COMMENT_WRITE_LABEL = "Write a note";
export const UI_COMMENT_PLACEHOLDER =
  "Send a prayer, a sweet wish, or a tiny heartfelt message…";
export const UI_COMMENT_SEND_AS_ANONYMOUS = "Send as anonymous";
export const UI_COMMENT_SUBMIT = "Send";
export const UI_COMMENT_SUBMITTING = "Sending…";
export const UI_COMMENT_SUCCESS = "Your note has been sent.";
export const UI_COMMENT_ERROR_GENERIC = "Something went wrong.";
export const UI_COMMENT_ERROR_NETWORK = "Network error. Please try again.";
export const UI_COMMENT_FLOATING_LABEL = "Floating notes";
export const UI_COMMENT_FLOATING_ON = "On";
export const UI_COMMENT_FLOATING_OFF = "Off";
export const UI_COMMENT_SENDING_AS = "Showing as";
export const UI_COMMENT_ANONYMOUS_HELPER =
  "Your message will appear as Anonymous";
export const UI_COMMENT_UNAVAILABLE =
  "Comment storage is not ready yet. The invitation still works normally, but sending notes is temporarily disabled.";
