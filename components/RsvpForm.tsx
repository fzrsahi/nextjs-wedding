"use client";

import { useState } from "react";
import {
  UI_RSVP_AKAD_LABEL,
  UI_RSVP_ATTENDING,
  UI_RSVP_ERROR_GENERIC,
  UI_RSVP_ERROR_NETWORK,
  UI_RSVP_FORM_TITLE,
  UI_RSVP_NOT_ATTENDING,
  UI_RSVP_RESEPSI_LABEL,
  UI_RSVP_SINGLE_PROMPT,
  UI_RSVP_SUBMIT,
  UI_RSVP_SUBMITTING,
  UI_RSVP_SUCCESS,
} from "@/lib/constants/messages.id";
import {
  INVITATION_KIND_BOTH,
  RSVP_ATTENDING,
  RSVP_BODY_KEY_AKAD,
  RSVP_BODY_KEY_CONFIRM,
  RSVP_BODY_KEY_RESEPSI,
  RSVP_BODY_KEY_SLUG,
  RSVP_NOT_ATTENDING,
} from "@/lib/constants/rsvp";
import type { TInvitationKind, TRsvpAttendance } from "@/lib/types/guest.types";
import { parseCompositeRsvpValue } from "@/lib/guest";

type TRsvpFormProps = {
  slug: string;
  invitationKind: TInvitationKind;
  initialRsvpRaw: string;
};

export function RsvpForm({
  slug,
  invitationKind,
  initialRsvpRaw,
}: TRsvpFormProps) {
  const parsedDual = parseCompositeRsvpValue(initialRsvpRaw);
  const [single, setSingle] = useState<TRsvpAttendance | "">(() => {
    if (invitationKind === INVITATION_KIND_BOTH) return "";
    const v = initialRsvpRaw.trim().toLowerCase();
    if (v === RSVP_ATTENDING || v === RSVP_NOT_ATTENDING) return v;
    return "";
  });
  const [akad, setAkad] = useState<TRsvpAttendance>(
    parsedDual?.akad ?? RSVP_ATTENDING,
  );
  const [resepsi, setResepsi] = useState<TRsvpAttendance>(
    parsedDual?.resepsi ?? RSVP_ATTENDING,
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const payload =
        invitationKind === INVITATION_KIND_BOTH
          ? {
              [RSVP_BODY_KEY_SLUG]: slug,
              [RSVP_BODY_KEY_AKAD]: akad,
              [RSVP_BODY_KEY_RESEPSI]: resepsi,
            }
          : {
              [RSVP_BODY_KEY_SLUG]: slug,
              [RSVP_BODY_KEY_CONFIRM]: single,
            };
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatus("err");
        setMessage(data.error ?? UI_RSVP_ERROR_GENERIC);
        return;
      }
      setStatus("ok");
      setMessage(UI_RSVP_SUCCESS);
    } catch {
      setStatus("err");
      setMessage(UI_RSVP_ERROR_NETWORK);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 border border-neutral-200 p-4">
      <h2 className="text-sm font-medium">{UI_RSVP_FORM_TITLE}</h2>

      {invitationKind === INVITATION_KIND_BOTH ? (
        <div className="space-y-3">
          <label className="block text-xs">
            <span className="text-neutral-600">{UI_RSVP_AKAD_LABEL}</span>
            <select
              value={akad}
              onChange={(e) => setAkad(e.target.value as TRsvpAttendance)}
              className="mt-1 block w-full border border-neutral-300 bg-white px-2 py-1 text-sm"
            >
              <option value={RSVP_ATTENDING}>{UI_RSVP_ATTENDING}</option>
              <option value={RSVP_NOT_ATTENDING}>{UI_RSVP_NOT_ATTENDING}</option>
            </select>
          </label>
          <label className="block text-xs">
            <span className="text-neutral-600">{UI_RSVP_RESEPSI_LABEL}</span>
            <select
              value={resepsi}
              onChange={(e) => setResepsi(e.target.value as TRsvpAttendance)}
              className="mt-1 block w-full border border-neutral-300 bg-white px-2 py-1 text-sm"
            >
              <option value={RSVP_ATTENDING}>{UI_RSVP_ATTENDING}</option>
              <option value={RSVP_NOT_ATTENDING}>{UI_RSVP_NOT_ATTENDING}</option>
            </select>
          </label>
        </div>
      ) : (
        <div className="space-y-2 text-xs">
          <p className="text-neutral-600">{UI_RSVP_SINGLE_PROMPT}</p>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="konfirmasi"
                value={RSVP_ATTENDING}
                checked={single === RSVP_ATTENDING}
                onChange={() => setSingle(RSVP_ATTENDING)}
              />
              {UI_RSVP_ATTENDING}
            </label>
            <label className="inline-flex items-center gap-1">
              <input
                type="radio"
                name="konfirmasi"
                value={RSVP_NOT_ATTENDING}
                checked={single === RSVP_NOT_ATTENDING}
                onChange={() => setSingle(RSVP_NOT_ATTENDING)}
              />
              {UI_RSVP_NOT_ATTENDING}
            </label>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={
          status === "loading" ||
          (invitationKind !== INVITATION_KIND_BOTH &&
            single !== RSVP_ATTENDING &&
            single !== RSVP_NOT_ATTENDING)
        }
        className="border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-white disabled:opacity-40"
      >
        {status === "loading" ? UI_RSVP_SUBMITTING : UI_RSVP_SUBMIT}
      </button>

      {message ? (
        <p
          className={
            status === "ok" ? "text-xs text-green-700" : "text-xs text-red-600"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
