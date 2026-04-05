/** Invitation sections to show on the page (maps from sheet `tipe` column). */
export type TInvitationKind = "akad" | "resepsi" | "keduanya";

/** RSVP answer values stored in the sheet and sent by the API (Indonesian copy for guests). */
export type TRsvpAttendance = "datang" | "tidak";

/** Guest row mapped from Google Sheet (display copy stays Indonesian where needed). */
export type TGuest = {
  /** 1-based row index in the spreadsheet (header is row 1). */
  sheetRowIndex: number;
  indexNo: string;
  group: string;
  /** Guest name shown on the invitation (sheet column `nama`). */
  displayName: string;
  /** Admin note (sheet column `ket`). */
  note: string;
  invitationKind: TInvitationKind;
  invitationLink: string;
  /** Raw cell value for RSVP column `konfirmasi`. */
  rsvpRaw: string;
  slug: string;
};

/** Parsed composite RSVP when `invitationKind` is `keduanya`. */
export type TCompositeRsvpParts = {
  akad: TRsvpAttendance;
  resepsi: TRsvpAttendance;
};
