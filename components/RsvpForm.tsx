"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import {
  UI_RSVP_AKAD_LABEL,
  UI_RSVP_ATTENDING,
  UI_RSVP_ERROR_GENERIC,
  UI_RSVP_ERROR_NETWORK,
  UI_RSVP_FORM_TITLE,
  UI_RSVP_NOT_ATTENDING,
  UI_RSVP_RESEPSI_LABEL,
  UI_RSVP_SECTION_INTRO,
  UI_RSVP_SECTION_KICKER,
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
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

type TRsvpFormProps = {
  slug: string;
  invitationKind: TInvitationKind;
  initialRsvpRaw: string;
};

function ChoicePill({
  selected,
  onSelect,
  children,
  disabled,
}: {
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={[
        "min-h-[3rem] w-full rounded-2xl border px-4 py-2.5 text-sm font-medium leading-snug transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inv-primary)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfbf8]",
        "disabled:pointer-events-none disabled:opacity-45",
        selected
          ? "border-[var(--inv-primary)] bg-[rgb(var(--inv-primary-rgb)/0.14)] text-[var(--inv-primary)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.55)]"
          : "border-[#e4dbd6] bg-white/80 text-[var(--inv-ink)] hover:border-[var(--inv-primary)]/40 hover:bg-[rgb(var(--inv-primary-rgb)/0.06)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function RsvpForm({
  slug,
  invitationKind,
  initialRsvpRaw,
}: TRsvpFormProps) {
  const reduceMotion = useReducedMotion();
  const blend = SECTION_SCROLL_BLEND.rsvp;
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

  const submitDisabled =
    status === "loading" ||
    (invitationKind !== INVITATION_KIND_BOTH &&
      single !== RSVP_ATTENDING &&
      single !== RSVP_NOT_ATTENDING);

  return (
    <motion.section
      aria-label={UI_RSVP_FORM_TITLE}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: reduceMotion ? 0 : 0.68, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[#fdfbf8]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.38]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(123 35 50 / 0.04) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <SectionScrollBlend top={blend.top} bottom={blend.bottom} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--inv-accent)]/15 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <header className="text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[var(--inv-primary)]/75">
            {UI_RSVP_SECTION_KICKER}
          </p>
          <h2 className="mt-2 text-[1.85rem] font-medium leading-[1.12] tracking-tight text-[var(--inv-accent)] [font-family:var(--font-display)] sm:text-[2.1rem]">
            {UI_RSVP_FORM_TITLE}
          </h2>
          <p className="mx-auto mt-4 max-w-[32ch] text-[0.9375rem] leading-relaxed text-[var(--inv-ink-muted)] [font-family:var(--font-geist-sans)]">
            {UI_RSVP_SECTION_INTRO}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-10 max-w-[22rem] space-y-8"
          noValidate
        >
          {invitationKind === INVITATION_KIND_BOTH ? (
            <div className="space-y-8">
              <fieldset className="space-y-3 border-0 p-0">
                <legend className="w-full text-center text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#8a7568]">
                  {UI_RSVP_AKAD_LABEL}
                </legend>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <ChoicePill
                    selected={akad === RSVP_ATTENDING}
                    onSelect={() => setAkad(RSVP_ATTENDING)}
                    disabled={status === "loading"}
                  >
                    {UI_RSVP_ATTENDING}
                  </ChoicePill>
                  <ChoicePill
                    selected={akad === RSVP_NOT_ATTENDING}
                    onSelect={() => setAkad(RSVP_NOT_ATTENDING)}
                    disabled={status === "loading"}
                  >
                    {UI_RSVP_NOT_ATTENDING}
                  </ChoicePill>
                </div>
              </fieldset>

              <fieldset className="space-y-3 border-0 p-0">
                <legend className="w-full text-center text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#8a7568]">
                  {UI_RSVP_RESEPSI_LABEL}
                </legend>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <ChoicePill
                    selected={resepsi === RSVP_ATTENDING}
                    onSelect={() => setResepsi(RSVP_ATTENDING)}
                    disabled={status === "loading"}
                  >
                    {UI_RSVP_ATTENDING}
                  </ChoicePill>
                  <ChoicePill
                    selected={resepsi === RSVP_NOT_ATTENDING}
                    onSelect={() => setResepsi(RSVP_NOT_ATTENDING)}
                    disabled={status === "loading"}
                  >
                    {UI_RSVP_NOT_ATTENDING}
                  </ChoicePill>
                </div>
              </fieldset>
            </div>
          ) : (
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="mx-auto block max-w-[28ch] text-center text-[0.9375rem] font-normal leading-relaxed text-[var(--inv-ink-muted)]">
                {UI_RSVP_SINGLE_PROMPT}
              </legend>
              <div
                className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                role="group"
                aria-label={UI_RSVP_SINGLE_PROMPT}
              >
                <ChoicePill
                  selected={single === RSVP_ATTENDING}
                  onSelect={() => setSingle(RSVP_ATTENDING)}
                  disabled={status === "loading"}
                >
                  {UI_RSVP_ATTENDING}
                </ChoicePill>
                <ChoicePill
                  selected={single === RSVP_NOT_ATTENDING}
                  onSelect={() => setSingle(RSVP_NOT_ATTENDING)}
                  disabled={status === "loading"}
                >
                  {UI_RSVP_NOT_ATTENDING}
                </ChoicePill>
              </div>
            </fieldset>
          )}

          <div className="pt-1">
            <button
              type="submit"
              disabled={submitDisabled}
              className={[
                "w-full rounded-2xl px-5 py-3.5 text-sm font-semibold tracking-[0.06em] text-white shadow-[0_14px_32px_rgb(199_154_157_/_0.45)] transition",
                "bg-[#c79a9d] hover:bg-[#b8898d] active:scale-[0.99]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--inv-accent)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdfbf8]",
                "disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none disabled:active:scale-100",
              ].join(" ")}
            >
              {status === "loading" ? UI_RSVP_SUBMITTING : UI_RSVP_SUBMIT}
            </button>
          </div>

          {message ? (
            <motion.p
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={[
                "rounded-xl px-4 py-3 text-center text-sm leading-relaxed",
                status === "ok"
                  ? "bg-[rgb(var(--inv-primary-rgb)/0.1)] text-[var(--inv-primary)]"
                  : "bg-[rgb(var(--inv-accent-rgb)/0.08)] text-[var(--inv-accent)]",
              ].join(" ")}
            >
              {message}
            </motion.p>
          ) : null}
        </form>
      </div>
    </motion.section>
  );
}
