import type { TGuest } from "@/lib/types/guest.types";

/** Loaded guest list plus indices required for RSVP writes. */
export type TGuestsSheetData = {
  guests: TGuest[];
  konfirmasiColumnIndex: number;
  sheetTabTitle: string;
  sheetId: number;
};

export type TSheetTabInfo = {
  sheetId: number;
  title: string;
};
