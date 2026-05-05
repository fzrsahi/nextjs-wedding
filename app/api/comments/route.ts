import { NextResponse } from "next/server";
import { API_COMMENT_INVALID_JSON } from "@/lib/constants/messages.id";
import { createLogger } from "@/lib/logger";
import {
  listGuestComments,
  submitGuestComment,
} from "@/lib/services/comment.service";
import type { TCommentRequestBody } from "@/lib/types/comment.types";

const log = createLogger("api:comments");

export async function GET() {
  const result = await listGuestComments();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  let body: TCommentRequestBody & { website?: string };
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    // Simple origin check (only allow requests from the same host in production)
    if (
      process.env.NODE_ENV === "production" &&
      origin &&
      !origin.includes(host || "")
    ) {
      return NextResponse.json(
        { error: "Unauthorized origin" },
        { status: 403 },
      );
    }

    body = (await request.json()) as TCommentRequestBody & { website?: string };

    // Honeypot check: if 'website' is filled, it's likely a bot
    if (body.website) {
      log.warn("Honeypot triggered - bot detected");
      return NextResponse.json({ ok: true }); // Silent success for bots
    }
  } catch {
    log.debug("Comment request body is not valid JSON");
    return NextResponse.json(
      { error: API_COMMENT_INVALID_JSON },
      { status: 400 },
    );
  }

  const result = await submitGuestComment(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.userMessage },
      { status: result.httpStatus },
    );
  }

  return NextResponse.json({
    ok: true,
    comment: result.comment,
  });
}
