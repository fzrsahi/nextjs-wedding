import {
  INVITATION_KIND_AKAD,
  INVITATION_KIND_BOTH,
  INVITATION_KIND_RESEPSI,
} from "@/lib/constants/rsvp";
import {
  SHEET_COL_DISPLAY_NAME,
  SHEET_COL_GROUP,
  SHEET_COL_INDEX,
  SHEET_COL_INVITATION_KIND,
  SHEET_COL_INVITATION_LINK,
  SHEET_COL_NOTE,
  SHEET_COL_RSVP,
} from "@/lib/constants/sheets";
import type {
  TCompositeRsvpParts,
  TGuest,
  TInvitationKind,
  TRsvpAttendance,
} from "@/lib/types/guest.types";
import { nameToSlug } from "@/lib/slug";

export type {
  TCompositeRsvpParts,
  TGuest,
  TInvitationKind,
  TRsvpAttendance,
} from "@/lib/types/guest.types";

export function parseInvitationKind(raw: string): TInvitationKind | null {
  const v = raw.trim().toLowerCase();
  if (
    v === INVITATION_KIND_AKAD ||
    v === INVITATION_KIND_RESEPSI ||
    v === INVITATION_KIND_BOTH
  ) {
    return v;
  }
  return null;
}

/** Empty `tipe` cell defaults to both events (sheet name-only rows). */
export function parseInvitationKindOrDefault(raw: string): TInvitationKind | null {
  const trimmed = raw.trim();
  if (!trimmed) return INVITATION_KIND_BOTH;
  return parseInvitationKind(trimmed);
}

export function isAkadSectionVisible(kind: TInvitationKind): boolean {
  return kind === INVITATION_KIND_AKAD || kind === INVITATION_KIND_BOTH;
}

export function isResepsiSectionVisible(kind: TInvitationKind): boolean {
  return kind === INVITATION_KIND_RESEPSI || kind === INVITATION_KIND_BOTH;
}

/** Single-cell composite format for dual-event RSVP. */
export function formatCompositeRsvpValue(
  akad: TRsvpAttendance,
  resepsi: TRsvpAttendance,
): string {
  return `akad:${akad};resepsi:${resepsi}`;
}

export function parseCompositeRsvpValue(
  value: string,
): TCompositeRsvpParts | null {
  const m = value.match(
    /^akad:(datang|tidak);resepsi:(datang|tidak)$/i,
  );
  if (!m) return null;
  return {
    akad: m[1].toLowerCase() as TRsvpAttendance,
    resepsi: m[2].toLowerCase() as TRsvpAttendance,
  };
}

export type TSheetHeaderIndexMap = Record<string, number>;

export function normalizeHeaderLabel(h: string): string {
  return h.trim().toLowerCase();
}

export function buildHeaderIndexMap(headers: string[]): TSheetHeaderIndexMap {
  const map: TSheetHeaderIndexMap = {};
  headers.forEach((h, i) => {
    map[normalizeHeaderLabel(h)] = i;
  });
  return map;
}

export function mapGuestFromSheetRow(
  sheetRowIndex: number,
  cells: string[],
  col: TSheetHeaderIndexMap,
): TGuest | null {
  const cell = (key: string) => cells[col[key]]?.trim() ?? "";
  const displayName = cell(SHEET_COL_DISPLAY_NAME);
  if (!displayName) return null;
  const invitationKind = parseInvitationKindOrDefault(
    cell(SHEET_COL_INVITATION_KIND),
  );
  if (!invitationKind) return null;
  return {
    sheetRowIndex,
    indexNo: cell(SHEET_COL_INDEX),
    group: cell(SHEET_COL_GROUP),
    displayName,
    note: cell(SHEET_COL_NOTE),
    invitationKind,
    invitationLink: cell(SHEET_COL_INVITATION_LINK),
    rsvpRaw: cell(SHEET_COL_RSVP),
    slug: nameToSlug(displayName),
  };
}
