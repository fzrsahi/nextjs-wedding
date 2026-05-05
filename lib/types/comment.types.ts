/** Guest comment row stored in the comment sheet or returned by `/api/comments`. */
export type TGuestComment = {
  id: string;
  sheetRowIndex: number;
  slug: string;
  displayName: string;
  senderName: string;
  isAnonymous: boolean;
  message: string;
  createdAt: string;
};

/** POST /api/comments JSON body (field names fixed for client contract). */
export type TCommentRequestBody = {
  slug?: string;
  pesan?: string;
  anonim?: boolean;
};

export type TCommentListResult = {
  comments: TGuestComment[];
  available: boolean;
};

export type TCommentSubmitSuccess = {
  ok: true;
  comment: TGuestComment;
};

export type TCommentSubmitFailure = {
  ok: false;
  httpStatus: number;
  userMessage: string;
};

export type TCommentSubmitResult =
  | TCommentSubmitSuccess
  | TCommentSubmitFailure;
