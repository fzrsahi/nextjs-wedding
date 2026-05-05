/** Header row keys (normalized to lowercase in code). */
export const SHEET_COL_INDEX = "no";
export const SHEET_COL_GROUP = "group";
export const SHEET_COL_DISPLAY_NAME = "nama";
export const SHEET_COL_NOTE = "ket";
export const SHEET_COL_INVITATION_KIND = "tipe";
export const SHEET_COL_INVITATION_LINK = "link";
export const SHEET_COL_RSVP = "konfirmasi";
export const SHEET_COL_COMMENT_MARKER = "komentar";
export const SHEET_COL_COMMENT_CREATED_AT = "waktu";
export const SHEET_COL_COMMENT_SLUG = "slug";
export const SHEET_COL_COMMENT_DISPLAY_NAME = "nama_tampil";
export const SHEET_COL_COMMENT_SENDER_NAME = "nama_pengirim";
export const SHEET_COL_COMMENT_ANONYMOUS = "anonim";
export const SHEET_COL_COMMENT_MESSAGE = "pesan";

export const SHEET_REQUIRED_HEADERS = [
  SHEET_COL_DISPLAY_NAME,
  SHEET_COL_INVITATION_KIND,
  SHEET_COL_RSVP,
] as const;

export const DEFAULT_SHEET_TAB_NAME = "Sheet1";
export const DEFAULT_COMMENTS_SHEET_TAB_NAME = "Comments";

export const SHEET_COMMENT_HEADERS = [
  SHEET_COL_COMMENT_CREATED_AT,
  SHEET_COL_COMMENT_SLUG,
  SHEET_COL_COMMENT_DISPLAY_NAME,
  SHEET_COL_COMMENT_SENDER_NAME,
  SHEET_COL_COMMENT_ANONYMOUS,
  SHEET_COL_COMMENT_MESSAGE,
] as const;

export const SHEET_GRID_MAX_ROWS = 8000;
/** Exclusive end column index (0-based): columns A–Z → 26. */
export const SHEET_GRID_END_COLUMN_EXCLUSIVE = 26;
