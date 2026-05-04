import Image from "next/image";
import { Calendar } from "lucide-react";
import type { SlideConfig } from "./CinematicScroll";

/**
 * Slide component for the Wedding Date.
 * Reuses the maroon couple frame.
 */
export function createEventDateSlide(): SlideConfig {
  return {
    id: "event-date",
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
            src="/assets/frame/date.png"
            alt=""
            className="h-auto w-full animate-frame-pulse drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
          />

          {/* 
            Content Area
          */}
          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{
              top: "22%",
              bottom: "26%",
              left: "22%",
              right: "22%",
              padding: "0 2%",
            }}
          >
            {/* Header */}
            <div className="flex flex-col items-center mb-[5cqw]">
              <Calendar size="3.5cqw" color="#fbfbfa" className="opacity-80 mb-[1.5cqw] animate-wiggle" strokeWidth={1.5} />
              <p
                className="uppercase tracking-[0.4em] font-bold opacity-90 animate-glow-text"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(10px, 2.5cqw, 14px)",
                  color: "#fbfbfa"
                }}
              >
                Save The Date
              </p>
              <div 
                className="w-16 h-[1px] mt-2 animate-sparkle-line" 
                style={{ background: "linear-gradient(to right, transparent, rgba(251, 251, 250, 0.5), transparent)" }}
              />
            </div>

            {/* Main Date Display */}
            <div className="flex flex-col items-center">
              <h3
                className="animate-sway"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(16px, 4cqw, 24px)",
                  color: "#fbfbfa",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase"
                }}
              >
                Saturday
              </h3>
              
              <div className="flex items-center justify-center my-[2cqw]">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#fbfbfa]/40" />
                <span 
                  className="mx-6 font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] animate-pulse-text" 
                  style={{ 
                    fontFamily: "serif", 
                    fontSize: "clamp(55px, 15cqw, 90px)",
                    color: "#fbfbfa",
                    lineHeight: 0.9,
                    letterSpacing: "-0.02em"
                  }}
                >
                  12
                </span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#fbfbfa]/40" />
              </div>

              <h4
                className="animate-sway"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(14px, 3.8cqw, 22px)",
                  color: "#fbfbfa",
                  fontWeight: 500,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase"
                }}
              >
                December
              </h4>
              
              <p
                className="mt-[3cqw] tracking-[0.4em] font-light animate-float-rotate"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(12px, 2.8cqw, 18px)",
                  color: "rgba(251, 251, 250, 0.9)"
                }}
              >
                2026
              </p>
            </div>

            {/* Footer */}
            <div className="mt-[5cqw]">
               <p
                className="italic opacity-70 animate-drift"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(9px, 2cqw, 12px)",
                  color: "#fbfbfa"
                }}
              >
                Our Journey Towards Forever
              </p>
            </div>
          </div>

          {/* Decorative Flowers (Top-Right and Bottom-Left) */}
          <div
            ref={refs[1]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "8%", right: "-20%", width: "75%", aspectRatio: "1" }}
          >
            <Image 
              src="/assets/flowers/bunga-ayat.png" 
              alt="" 
              fill 
              sizes="(max-width: 768px) 80vw, 50vw" 
              className="object-contain animate-zoom-in-out" 
            />
          </div>
          <div
            ref={refs[2]}
            className="absolute z-10 pointer-events-none"
            style={{ bottom: "10%", left: "-20%", width: "75%", aspectRatio: "1" }}
          >
            <Image 
              src="/assets/flowers/bunga-ayat.png" 
              alt="" 
              fill 
              sizes="(max-width: 768px) 80vw, 50vw" 
              className="object-contain animate-zoom-in-out-delayed" 
            />
          </div>
        </div>
      </div>
    ),
  };
}
