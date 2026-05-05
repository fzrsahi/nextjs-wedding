import "server-only";

import { revalidateTag } from "next/cache";
import {
  COMMENT_ANONYMOUS_DISPLAY_NAME,
  COMMENT_BODY_KEY_ANONYMOUS,
  COMMENT_BODY_KEY_MESSAGE,
  COMMENT_BODY_KEY_SLUG,
  COMMENT_FETCH_LIMIT,
  COMMENT_MAX_LENGTH,
} from "@/lib/constants/comments";
import { CACHE_TAG_COMMENTS } from "@/lib/constants/cache";
import {
  API_COMMENT_GUEST_NOT_FOUND,
  API_COMMENT_MESSAGE_REQUIRED,
  API_COMMENT_MESSAGE_TOO_LONG,
  API_COMMENT_SHEET_WRITE_FAILED,
  API_COMMENT_SHEETS_NOT_READY,
  API_COMMENT_SLUG_REQUIRED,
} from "@/lib/constants/messages.id";
import { createLogger } from "@/lib/logger";
import {
  appendGuestComment,
  getCommentsData,
  loadCommentsDataFresh,
  loadGuestsDataFresh,
} from "@/lib/sheets";
import type {
  TCommentListResult,
  TCommentRequestBody,
  TCommentSubmitResult,
} from "@/lib/types/comment.types";

const log = createLogger("service:comment");

function failure(
  httpStatus: number,
  userMessage: string,
): Extract<TCommentSubmitResult, { ok: false }> {
  return { ok: false, httpStatus, userMessage };
}

function normalizeCommentMessage(raw: string): string {
  return raw.replace(/\s+/g, " ").trim();
}

export async function listGuestComments(): Promise<TCommentListResult> {
  const data =
    process.env.NODE_ENV === "development"
      ? await loadCommentsDataFresh()
      : await getCommentsData();
  return {
    comments: data.comments.slice(0, COMMENT_FETCH_LIMIT),
    available: data.isAvailable,
  };
}

export async function submitGuestComment(
  body: TCommentRequestBody,
): Promise<TCommentSubmitResult> {
  const slug =
    typeof body[COMMENT_BODY_KEY_SLUG] === "string"
      ? body[COMMENT_BODY_KEY_SLUG].trim()
      : "";
  if (!slug) {
    log.debug("Comment rejected: slug empty");
    return failure(400, API_COMMENT_SLUG_REQUIRED);
  }

  const messageRaw =
    typeof body[COMMENT_BODY_KEY_MESSAGE] === "string"
      ? body[COMMENT_BODY_KEY_MESSAGE]
      : "";
  const message = normalizeCommentMessage(messageRaw);
  if (!message) {
    log.debug("Comment rejected: message empty", { slug });
    return failure(400, API_COMMENT_MESSAGE_REQUIRED);
  }

  if (message.length > COMMENT_MAX_LENGTH) {
    log.debug("Comment rejected: message too long", {
      slug,
      length: message.length,
    });
    return failure(400, API_COMMENT_MESSAGE_TOO_LONG);
  }

  const [commentsData, guestsData] = await Promise.all([
    loadCommentsDataFresh(),
    loadGuestsDataFresh(),
  ]);

  if (!commentsData.isAvailable) {
    log.warn("Comment rejected: comment sheet unavailable", { slug });
    return failure(503, API_COMMENT_SHEETS_NOT_READY);
  }

  const guest = guestsData.guests.find((item) => item.slug === slug);
  if (!guest) {
    log.info("Comment guest not found", { slug });
    return failure(404, API_COMMENT_GUEST_NOT_FOUND);
  }

  const isAnonymous = Boolean(body[COMMENT_BODY_KEY_ANONYMOUS]);

  try {
    const comment = await appendGuestComment({
      commentsData,
      slug,
      senderName: guest.displayName,
      displayName: isAnonymous
        ? COMMENT_ANONYMOUS_DISPLAY_NAME
        : guest.displayName,
      isAnonymous,
      message,
    });
    revalidateTag(CACHE_TAG_COMMENTS, { expire: 0 });
    log.info("Comment saved", { slug, anonymous: isAnonymous });
    return { ok: true, comment };
  } catch (e) {
    log.err("Failed to append comment", e, { slug });
    return failure(502, API_COMMENT_SHEET_WRITE_FAILED);
  }
}
