import type { TInvitationKind, TRsvpAttendance } from "@/lib/types/guest.types";

export const RSVP_ATTENDING: TRsvpAttendance = "datang";
export const RSVP_NOT_ATTENDING: TRsvpAttendance = "tidak";

export const INVITATION_KIND_AKAD: TInvitationKind = "akad";
export const INVITATION_KIND_RESEPSI: TInvitationKind = "resepsi";
export const INVITATION_KIND_BOTH: TInvitationKind = "keduanya";

export function isRsvpAttendanceValue(
  v: string | undefined,
): v is TRsvpAttendance {
  return v === RSVP_ATTENDING || v === RSVP_NOT_ATTENDING;
}

/** JSON keys for POST /api/rsvp (client + server). */
export const RSVP_BODY_KEY_SLUG = "slug" as const;
export const RSVP_BODY_KEY_CONFIRM = "konfirmasi" as const;
export const RSVP_BODY_KEY_AKAD = "konfirmasiAkad" as const;
export const RSVP_BODY_KEY_RESEPSI = "konfirmasiResepsi" as const;
