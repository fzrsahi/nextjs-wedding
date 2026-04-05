import { NextResponse } from "next/server";
import { API_RSVP_INVALID_JSON } from "@/lib/constants/messages.id";
import { createLogger } from "@/lib/logger";
import { submitGuestRsvp } from "@/lib/services/rsvp.service";
import type { TRsvpRequestBody } from "@/lib/types/rsvp.types";

const log = createLogger("api:rsvp");

export async function POST(request: Request) {
  let body: TRsvpRequestBody;
  try {
    body = (await request.json()) as TRsvpRequestBody;
  } catch {
    log.debug("RSVP request body is not valid JSON");
    return NextResponse.json({ error: API_RSVP_INVALID_JSON }, { status: 400 });
  }

  const result = await submitGuestRsvp(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.userMessage },
      { status: result.httpStatus },
    );
  }

  return NextResponse.json({
    ok: true,
    konfirmasi: result.confirmationStored,
  });
}
