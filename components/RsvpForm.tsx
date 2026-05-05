"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

import type { SlideConfig } from "./CinematicScroll";

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

const DATE_FRAME = "/assets/frame/reservation.webp";

export type TRsvpSlideProps = {
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
        "min-h-0 w-full max-w-full min-w-0 rounded-lg border px-[1.6cqw] py-[1.35cqw] text-[length:1.4cqw] font-medium leading-snug transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a882]/55 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
        "disabled:pointer-events-none disabled:opacity-45",
        selected
          ? "border-[#fbfbfa]/55 bg-[rgb(251_251_250_/_0.18)] text-[#f4ebe3] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.12)]"
          : "border-[#fbfbfa]/22 bg-[rgb(8_6_8_/_0.15)] text-[#e8dcd0] hover:border-[#c9a882]/45 hover:bg-[rgb(255_255_255_/_0.06)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/** Form RSVP di dalam slide cinematic — pola sama seperti slide dresscode / lokasi. */
function RsvpCinematicForm({
  refs,
  slug,
  invitationKind,
  initialRsvpRaw,
}: TRsvpSlideProps & {
  refs: ((el: HTMLDivElement | null) => void)[];
}) {
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

  const stopWheelBubble = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        ref={(el) => {
          refs[0]?.(el);
        }}
        className="relative origin-center [container-type:inline-size]"
        style={{
          width: "125%",
          marginLeft: "-12.5%",
          marginRight: "-12.5%",
          marginTop: "-8%",
          marginBottom: "-8%",
        }}
      >
        <img
          src={DATE_FRAME}
          alt=""
          onError={(e) => {
            e.currentTarget.src = DATE_FRAME;
          }}
          className="pointer-events-none h-auto w-full select-none drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
        />

        <div
          data-cinematic-observe-ignore
          className="absolute inset-0 z-20 flex min-h-0 flex-col overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch] touch-pan-y"
          style={{
            top: "18%",
            bottom: "19%",
            left: "26%",
            right: "26%",
          }}
          onWheel={stopWheelBubble}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="flex min-h-full flex-col justify-center py-[2.8cqw]">
            <div className="mx-auto flex w-full min-w-0 max-w-[min(100%,36cqw)] flex-col items-center gap-y-[2.4cqw] text-center">
              <header className="flex w-full flex-col items-center gap-y-[1.6cqw]">
                <div
                  data-cinematic-line
                  className="flex flex-col items-center"
                >
                  <Mail
                    className="mb-[1.2cqw] h-[3.2cqw] w-[3.2cqw] min-h-[14px] min-w-[14px] text-[#c9a882] opacity-95"
                    strokeWidth={1.35}
                    aria-hidden
                  />
                  <div
                    className="h-px w-[10cqw] max-w-[120px] bg-gradient-to-r from-transparent via-[#c9a882]/70 to-transparent"
                    aria-hidden
                  />
                </div>

                <p
                  data-cinematic-line
                  className="text-[length:1.4cqw] font-semibold uppercase tracking-[0.24em] text-[#c9a882] drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]"
                >
                  {UI_RSVP_SECTION_KICKER}
                </p>

                <h2
                  data-cinematic-line
                  className="text-[length:3.1cqw] font-medium leading-[1.12] tracking-[0.03em] text-[#e8d5c4] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] [font-family:var(--font-display)]"
                >
                  {UI_RSVP_FORM_TITLE}
                </h2>

                <p
                  data-cinematic-line
                  className="text-pretty text-[length:1.7cqw] leading-[1.48] text-[#e0d6cc] [font-family:var(--font-cormorant),serif] drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
                >
                  {UI_RSVP_SECTION_INTRO}
                </p>
              </header>

              <form
                data-cinematic-line
                onSubmit={onSubmit}
                className="flex w-full min-w-0 max-w-full flex-col items-center gap-y-[2.2cqw]"
                noValidate
              >
            {invitationKind === INVITATION_KIND_BOTH ? (
              <div className="flex w-full max-w-[min(34cqw,100%)] flex-col gap-y-[2.1cqw]">
                <fieldset className="flex w-full flex-col gap-y-[1.25cqw] border-0 p-0">
                  <legend className="w-full text-center text-[length:1.3cqw] font-medium uppercase tracking-[0.12em] text-[#d4c4b0]/95">
                    {UI_RSVP_AKAD_LABEL}
                  </legend>
                  <div className="flex w-full min-w-0 flex-col gap-y-[1.05cqw]">
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

                <fieldset className="flex w-full flex-col gap-y-[1.25cqw] border-0 p-0">
                  <legend className="w-full text-center text-[length:1.3cqw] font-medium uppercase tracking-[0.12em] text-[#d4c4b0]/95">
                    {UI_RSVP_RESEPSI_LABEL}
                  </legend>
                  <div className="flex w-full min-w-0 flex-col gap-y-[1.05cqw]">
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
              <fieldset className="flex w-full max-w-[min(34cqw,100%)] flex-col gap-y-[1.35cqw] border-0 p-0">
                <legend className="w-full text-pretty text-center text-[length:1.6cqw] font-normal leading-snug text-[#e0d6cc] [font-family:var(--font-cormorant),serif]">
                  {UI_RSVP_SINGLE_PROMPT}
                </legend>
                <div
                  className="flex w-full min-w-0 flex-col gap-y-[1.05cqw]"
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

            <div className="flex w-full max-w-[min(34cqw,100%)] justify-center pt-[0.35cqw]">
              <button
                type="submit"
                disabled={submitDisabled}
                className={[
                  "box-border w-full max-w-full min-w-0 rounded-xl border border-[#c9a882]/40 px-[2cqw] py-[1.55cqw] text-[length:1.5cqw] font-semibold tracking-[0.06em] text-[#f4ebe3] shadow-[0_10px_26px_rgba(0,0,0,0.35)] transition",
                  "bg-gradient-to-br from-[#184234] via-[#245c48] to-[#153a2d] hover:brightness-[1.12] active:scale-[0.99]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a882]/55",
                ].join(" ")}
              >
                {status === "loading" ? UI_RSVP_SUBMITTING : UI_RSVP_SUBMIT}
              </button>
            </div>

            {message ? (
              <p
                role="status"
                className={[
                  "max-w-[min(34cqw,100%)] rounded-lg px-[1.75cqw] py-[1.4cqw] text-center text-[length:1.6cqw] leading-snug [font-family:var(--font-cormorant),serif]",
                  status === "ok"
                    ? "bg-[rgb(36_92_72_/_0.25)] text-[#c8e8d8]"
                    : "bg-[rgb(123_35_50_/_0.22)] text-[#f0d0d4]",
                ].join(" ")}
              >
                {message}
              </p>
            ) : null}
              </form>
            </div>
          </div>
        </div>

        <div
          ref={(el) => {
            refs[1]?.(el);
          }}
          className="absolute z-10 pointer-events-none"
          style={{ top: "8%", right: "-10%", width: "75%", aspectRatio: "1" }}
        >
          <img
            src="/assets/opening/flower-1.webp"
            alt=""
            onError={(e) => {
              e.currentTarget.src = "/assets/opening/flower-1.webp";
            }}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
        <div
          ref={(el) => {
            refs[2]?.(el);
          }}
          className="absolute z-10 pointer-events-none"
          style={{ bottom: "10%", left: "-10%", width: "75%", aspectRatio: "1" }}
        >
          <img
            src="/assets/opening/flower-2.webp"
            alt=""
            onError={(e) => {
              e.currentTarget.src = "/assets/opening/flower-2.webp";
            }}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

/** Slide RSVP untuk `OpeningGate` / `CinematicScroll` — pola = Event Date / Location / Dresscode. */
export function createRsvpSlide(props: TRsvpSlideProps): SlideConfig {
  return {
    id: "rsvp",
    refCount: 3,
    exitOrder: [
      { refIndex: 1, type: "flower" },
      { refIndex: 2, type: "flower" },
      { refIndex: 0, type: "frame" },
    ],
    enterOrder: [
      { refIndex: 0, type: "frame" },
      { refIndex: 1, type: "flower" },
      { refIndex: 2, type: "flower" },
    ],
    render: (refs) => <RsvpCinematicForm refs={refs} {...props} />,
  };
}
