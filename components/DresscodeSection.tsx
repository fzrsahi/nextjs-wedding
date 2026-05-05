import { Shirt } from "lucide-react";

import type { SlideConfig } from "./CinematicScroll";

import { UI_DRESSCODE_BODY, UI_DRESSCODE_TITLE } from "@/lib/constants/messages.id";

const DATE_FRAME = "/assets/frame/reservation.webp";

/** Visual cue: white is reserved, so avoid dominant white outfits. */
function NoWhiteSwatch() {
  return (
    <div
      className="mx-auto mt-[3.2cqw] flex flex-col items-center gap-[1cqw]"
      aria-hidden
    >
      <div className="relative h-[4.6rem] w-[4.6rem] rounded-full border border-[#f5e5d5]/60 bg-[radial-gradient(circle_at_34%_28%,#ffffff_0%,#f6efe8_48%,#d9cabd_100%)] shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),0_10px_24px_rgba(0,0,0,0.3)]">
        <div className="absolute inset-[9%] rounded-full border border-[#7b2332]/65" />
        <div className="absolute left-1/2 top-1/2 h-[118%] w-[0.34rem] -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-[#7b2332] shadow-[0_0_0_1px_rgba(255,255,255,0.35)]" />
      </div>
    </div>
  );
}

/**
 * Slide dresscode — memakai frame `date.png` (pola = `EventDateSection` / `EventLocationSection`).
 * Tipografi krem & emas, bukan putih dominan; isi satu paragraf rapi.
 */
export function createDresscodeSlide(): SlideConfig {
  return {
    id: "dresscode",
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
    render: (refs) => (
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={refs[0]}
          className="relative origin-center animate-float"
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
            className="h-auto w-full animate-frame-pulse drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
          />

          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{
              top: "26%",
              bottom: "29%",
              left: "26%",
              right: "26%",
              padding: "0 2%",
            }}
          >
            <div data-cinematic-line className="mb-[3cqw] flex flex-col items-center">
              <Shirt
                size="3.2cqw"
                color="#c9a882"
                className="mb-[2cqw] opacity-90 animate-wiggle"
                strokeWidth={1.35}
                aria-hidden
              />
              <div
                className="h-[1px] w-14 bg-gradient-to-r from-transparent via-[#c9a882]/70 to-transparent animate-sparkle-line sm:w-16"
                aria-hidden
              />
            </div>

            <h2
              data-cinematic-line
              className="animate-sway text-[length:5.2cqw] font-medium leading-tight tracking-[0.06em] text-[#e8d5c4] drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] [font-family:var(--font-display)] sm:text-[length:4.8cqw]"
            >
              {UI_DRESSCODE_TITLE}
            </h2>

            <p
              data-cinematic-line
              className="mx-auto mt-[4cqw] max-w-[32ch] text-[length:2.6cqw] font-normal leading-[1.7] text-[#e0d6cc] [font-family:var(--font-cormorant),serif] drop-shadow-[0_1px_8px_rgba(0,0,0,0.4)] sm:max-w-[36ch] sm:text-[length:2.3cqw]"
            >
              {UI_DRESSCODE_BODY.split(/(white)/i).map((segment, i) =>
                segment.toLowerCase() === "white" ? (
                  <strong key={i} className="font-semibold text-[#f0d0c0]">
                    {segment}
                  </strong>
                ) : (
                  <span key={i}>{segment}</span>
                ),
              )}
            </p>

            <div data-cinematic-line>
              <NoWhiteSwatch />
            </div>
          </div>

          <div
            ref={refs[1]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "8%", right: "-12%", width: "75%", aspectRatio: "1" }}
          >
            <img
              src="/assets/flowers/flower-new-1.webp"
              alt=""
              onError={(e) => {
                e.currentTarget.src = "/assets/flowers/flower-new-1.webp";
              }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out"
            />
          </div>
          <div
            ref={refs[2]}
            className="absolute z-10 pointer-events-none"
            style={{ bottom: "10%", left: "-12%", width: "75%", aspectRatio: "1" }}
          >
            <img
              src="/assets/flowers/flower-new-2.webp"
              alt=""
              onError={(e) => {
                e.currentTarget.src = "/assets/flowers/flower-new-2.webp";
              }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out-delayed"
            />
          </div>
        </div>
      </div>
    ),
  };
}
