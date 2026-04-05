/** POST /api/rsvp JSON body (field names fixed for client contract). */
export type TRsvpRequestBody = {
  slug?: string;
  konfirmasi?: string;
  konfirmasiAkad?: string;
  konfirmasiResepsi?: string;
};

export type TRsvpSubmitSuccess = {
  ok: true;
  confirmationStored: string;
};

export type TRsvpSubmitFailure = {
  ok: false;
  httpStatus: number;
  userMessage: string;
};

export type TRsvpSubmitResult = TRsvpSubmitSuccess | TRsvpSubmitFailure;
