import type { TGuestComment } from "@/lib/types/comment.types";
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

export type TCommentSheetColumns = {
  markerColumnIndex: number;
  createdAtColumnIndex: number;
  slugColumnIndex: number;
  displayNameColumnIndex: number;
  senderNameColumnIndex: number;
  anonymousColumnIndex: number;
  messageColumnIndex: number;
};

export type TCommentStorageMode =
  | "dedicated-tab"
  | "inline-main-tab"
  | "unavailable";

export type TCommentsSheetData = {
  comments: TGuestComment[];
  sheetTabTitle: string;
  sheetId: number;
  isAvailable: boolean;
  storageMode: TCommentStorageMode;
  columns: TCommentSheetColumns | null;
};
