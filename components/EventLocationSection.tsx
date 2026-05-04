import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import type { SlideConfig } from "./CinematicScroll";

import type { TEventScheduleBlock } from "@/lib/types/event.types";

/**
 * Slide component for the Event Location & Time.
 * Uses the building illustration and maroon frame.
 */
export function createEventLocationSlide(
  akad: TEventScheduleBlock,
  resepsi: TEventScheduleBlock,
  showAkad: boolean,
  showResepsi: boolean
): SlideConfig {
  return {
    id: "event-location",
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
            width: "100%",
            marginTop: "-5%",
            marginBottom: "-5%",
          }}
        >
          {/* Frame image */}
          <img
            src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857425/date_fewkmr.png"
            alt=""
            onError={(e) => { e.currentTarget.src = "/assets/frame/date.png"; }}
            className="h-auto w-full animate-frame-pulse drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
          />

          {/* 
            Content Area
          */}
          <div
            className="absolute flex flex-col items-center justify-between text-center"
            style={{
              top: "25%",
              bottom: "32%",
              left: "22%",
              right: "22%",
              padding: "0",
            }}
          >
            {/* Top Section: Times */}
            <div className="flex flex-col items-center w-full gap-[2cqw]">
              {showAkad && (
                <div className="flex flex-col items-center">
                  <p
                    className="uppercase tracking-[0.25em] font-bold leading-tight mb-1 animate-glow-text"
                    style={{ 
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "clamp(12px, 3cqw, 18px)",
                      color: "#fbfbfa"
                    }}
                  >
                    Wedding <br /> Ceremony
                  </p>
                  <div className="flex items-center gap-[1cqw]">
                    <Clock size="2cqw" color="#fbfbfa" className="opacity-70 animate-wiggle" strokeWidth={1.5} />
                    <p
                      className="opacity-90 font-medium tracking-[0.1em] animate-drift"
                      style={{ 
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "clamp(9px, 2.2cqw, 12px)",
                        color: "#fbfbfa"
                      }}
                    >
                      {akad.time || "08:00 AM - 10:00 AM"}
                    </p>
                  </div>
                </div>
              )}

              {showResepsi && (
                <div className="flex flex-col items-center mt-[1cqw]">
                  <p
                    className="uppercase tracking-[0.25em] font-bold leading-tight mb-1 animate-glow-text"
                    style={{ 
                      fontFamily: "var(--font-cormorant), serif",
                      fontSize: "clamp(12px, 3cqw, 18px)",
                      color: "#fbfbfa"
                    }}
                  >
                    Wedding <br /> Reception
                  </p>
                  <div className="flex items-center gap-[1cqw]">
                    <Clock size="2cqw" color="#fbfbfa" className="opacity-70 animate-wiggle" strokeWidth={1.5} />
                    <p
                      className="opacity-90 font-medium tracking-[0.1em] animate-drift"
                      style={{ 
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "clamp(9px, 2.2cqw, 12px)",
                        color: "#fbfbfa"
                      }}
                    >
                      {resepsi.time || "11:00 AM - 02:00 PM"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Middle Section: Building Illustration */}
            <div className="relative w-[150%] aspect-[2/1] -mt-[5cqw] opacity-100 group z-10">
               <img 
                src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857394/gedung_egnabp.png" 
                alt="Venue Illustration"
                onError={(e) => { e.currentTarget.src = "/assets/frame/gedung.png"; }}
                className="absolute inset-0 h-full w-full object-contain filter brightness-[2.5] contrast-[1.2] animate-breathe-deep drop-shadow-[0_0_10px_rgba(251,251,250,0.3)] transition-transform duration-700 group-hover:scale-105" 
              />
            </div>

            {/* Bottom Section: Venue */}
            <div className="flex flex-col items-center w-full">
              <MapPin size="3.5cqw" color="#fbfbfa" className="opacity-80 mb-[1cqw] animate-wiggle" strokeWidth={1.5} />
              <h3
                className="text-center animate-sway"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(11px, 3cqw, 17px)",
                  color: "#fbfbfa",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  lineHeight: 1.1
                }}
              >
                Hulonthalo <br /> Ballroom
              </h3>
              
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#fbfbfa]/40 to-transparent my-[1.5cqw] animate-sparkle-line" />

              <p
                className="tracking-[0.08em] font-medium leading-relaxed opacity-90 text-center animate-drift"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(8px, 2cqw, 11px)",
                  color: "#fbfbfa"
                }}
              >
                {showResepsi ? resepsi.venue.split("\n").slice(1).join("\n") : akad.venue.split("\n").slice(1).join("\n")}
              </p>
            </div>
          </div>

          {/* Decorative Flowers (Refined Side placement) */}
          <div
            ref={refs[1]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "25%", left: "-20%", width: "75%", aspectRatio: "1" }}
          >
            <img 
              src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857790/bunga-ayat_jhrwpf.png" 
              alt="" 
              onError={(e) => { e.currentTarget.src = "/assets/flowers/bunga-ayat.png"; }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out" 
            />
          </div>
          <div
            ref={refs[2]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "30%", right: "-20%", width: "75%", aspectRatio: "1" }}
          >
            <img 
              src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857790/bunga-ayat_jhrwpf.png" 
              alt="" 
              onError={(e) => { e.currentTarget.src = "/assets/flowers/bunga-ayat.png"; }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out-delayed" 
            />
          </div>
        </div>
      </div>
    ),
  };
}
