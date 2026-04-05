import "server-only";

import { revalidateTag } from "next/cache";
import { CACHE_TAG_GUESTS } from "@/lib/constants/cache";
import {
  API_RSVP_DUAL_FIELDS_REQUIRED,
  API_RSVP_GUEST_NOT_FOUND,
  API_RSVP_SHEET_LAYOUT_INVALID,
  API_RSVP_SHEET_WRITE_FAILED,
  API_RSVP_SHEETS_NOT_READY,
  API_RSVP_SINGLE_FIELD_REQUIRED,
  API_RSVP_SLUG_REQUIRED,
} from "@/lib/constants/messages.id";
import {
  INVITATION_KIND_BOTH,
  isRsvpAttendanceValue,
} from "@/lib/constants/rsvp";
import { formatCompositeRsvpValue } from "@/lib/guest";
import { createLogger } from "@/lib/logger";
import {
  isSheetsConfigured,
  loadGuestsDataFresh,
  updateGuestKonfirmasi,
} from "@/lib/sheets";
import type { TRsvpRequestBody } from "@/lib/types/rsvp.types";
import type { TRsvpSubmitResult } from "@/lib/types/rsvp.types";

const log = createLogger("service:rsvp");

function failure(
  httpStatus: number,
  userMessage: string,
): Extract<TRsvpSubmitResult, { ok: false }> {
  return { ok: false, httpStatus, userMessage };
}

function success(
  confirmationStored: string,
): Extract<TRsvpSubmitResult, { ok: true }> {
  return { ok: true, confirmationStored };
}

/**
 * Validates payload, writes RSVP to the sheet, and revalidates the guest cache.
 */
export async function submitGuestRsvp(
  body: TRsvpRequestBody,
): Promise<TRsvpSubmitResult> {
  if (!isSheetsConfigured()) {
    log.warn("RSVP rejected: Google Sheets credentials missing");
    return failure(503, API_RSVP_SHEETS_NOT_READY);
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  if (!slug) {
    log.debug("RSVP rejected: slug empty");
    return failure(400, API_RSVP_SLUG_REQUIRED);
  }

  const sheetData = await loadGuestsDataFresh();
  const guest = sheetData.guests.find((g) => g.slug === slug);
  if (!guest) {
    log.info("RSVP guest not found", { slug });
    return failure(404, API_RSVP_GUEST_NOT_FOUND);
  }

  if (sheetData.konfirmasiColumnIndex < 0 || sheetData.sheetId < 0) {
    log.error("Sheet layout invalid for RSVP write", {
      konfirmasiColumnIndex: sheetData.konfirmasiColumnIndex,
      sheetId: sheetData.sheetId,
    });
    return failure(500, API_RSVP_SHEET_LAYOUT_INVALID);
  }

  let confirmationValue: string;

  if (guest.invitationKind === INVITATION_KIND_BOTH) {
    if (
      !isRsvpAttendanceValue(body.konfirmasiAkad) ||
      !isRsvpAttendanceValue(body.konfirmasiResepsi)
    ) {
      log.debug("RSVP rejected: dual attendance payload incomplete", { slug });
      return failure(400, API_RSVP_DUAL_FIELDS_REQUIRED);
    }
    confirmationValue = formatCompositeRsvpValue(
      body.konfirmasiAkad,
      body.konfirmasiResepsi,
    );
  } else {
    if (!isRsvpAttendanceValue(body.konfirmasi)) {
      log.debug("RSVP rejected: single attendance invalid", { slug });
      return failure(400, API_RSVP_SINGLE_FIELD_REQUIRED);
    }
    confirmationValue = body.konfirmasi;
  }

  try {
    await updateGuestKonfirmasi(
      sheetData.sheetId,
      guest.sheetRowIndex,
      sheetData.konfirmasiColumnIndex,
      confirmationValue,
    );
  } catch (e) {
    log.err("Failed to write RSVP cell to spreadsheet", e, { slug });
    return failure(502, API_RSVP_SHEET_WRITE_FAILED);
  }

  revalidateTag(CACHE_TAG_GUESTS, { expire: 0 });
  log.info("RSVP saved", { slug, invitationKind: guest.invitationKind });
  return success(confirmationValue);
}
