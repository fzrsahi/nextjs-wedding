import Image from "next/image";
import { Camera } from "lucide-react";
import type { SlideConfig } from "./CinematicScroll";

/**
 * Detail Couples Slide
 * Using /assets/frame/couple.png
 */
export function createCoupleDetailSlide(): SlideConfig {
  return {
    id: "couple-details",
    refCount: 3, // 0=content, 1=flower1, 2=flower2
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
        {/* 
          Container for the frame. 
          Following the story frame logic:
          - We want the visible area to be stable.
          - We use negative margins to "zoom" into the central area if the raw png has large transparent borders.
        */}
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
            src="/assets/frame/couple.webp"
            alt=""
            onError={(e) => { e.currentTarget.src = "/assets/frame/couple.webp"; }}
            className="h-auto w-full animate-frame-pulse drop-shadow-[0_20px_45px_rgba(0,0,0,0.35)]"
          />

          {/* 
            Content Area
          */}
          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{
              top: "18%",
              bottom: "22%",
              left: "22%",
              right: "22%",
              padding: "0 2%",
            }}
          >
            {/* Bride Section */}
            <div data-cinematic-line className="flex flex-col items-center mb-[4.5cqw] w-full max-w-[85%]">
              <h3
                className="mb-[1.2cqw] animate-sway"
                style={{ 
                  fontFamily: "'Brittany Signature', serif", 
                  lineHeight: 1.25,
                  fontSize: "clamp(22px, 6.2cqw, 33px)",
                  color: "#fbfbfa"
                }}
              >
                Aca
              </h3>
              <p
                className="mt-[1.6cqw] whitespace-nowrap uppercase tracking-[0.16em] font-bold leading-tight animate-glow-text"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(9px, 2.15cqw, 12px)",
                  color: "rgba(251, 251, 250, 0.95)"
                }}
              >
                Syafa’ Tasya Nabila Zees, S.I.P.
              </p>
              <div className="flex items-center justify-center mt-2 animate-float-rotate">
                <a
                  href="https://instagram.com/syafatazya"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 transition hover:scale-110"
                  aria-label="Instagram Syafatazya"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="5cqw"
                    height="5cqw"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(251, 251, 250, 0.9)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
              <div 
                className="w-8 h-[0.5px] my-2 animate-sparkle-line" 
                style={{ backgroundColor: "rgba(251, 251, 250, 0.4)" }}
              />
              <p
                className="italic leading-snug animate-drift"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(10px, 2.2cqw, 13px)",
                  color: "rgba(251, 251, 250, 0.85)"
                }}
              >
                Putri pertama dari <br /> Alm. Bapak H. Nazir S Zees, S.P., M.Si. <br /> dan Ibu Hj. Sofya Taludio, S.Pd., M.Pd.
              </p>
            </div>

            {/* Separator */}
            <div data-cinematic-line className="flex items-center justify-center w-full mb-[4.5cqw] animate-breathe">
              <div className="h-[0.5px] w-8" style={{ backgroundColor: "rgba(251, 251, 250, 0.4)" }} />
              <span 
                className="mx-2 italic" 
                style={{ 
                  fontFamily: "serif", 
                  fontSize: "clamp(9px, 2.5cqw, 12px)",
                  color: "#fbfbfa"
                }}
              >
                dan
              </span>
              <div className="h-[0.5px] w-8" style={{ backgroundColor: "rgba(251, 251, 250, 0.4)" }} />
            </div>

            {/* Groom Section */}
            <div data-cinematic-line className="flex flex-col items-center w-full max-w-[85%]">
              <h3
                className="-mt-[0.8cqw] mb-[1.2cqw] animate-sway"
                style={{ 
                  fontFamily: "'Brittany Signature', serif", 
                  lineHeight: 1.25,
                  fontSize: "clamp(22px, 6.2cqw, 33px)",
                  color: "#fbfbfa"
                }}
              >
                Fauzan
              </h3>
              <p
                className="mt-[1.6cqw] uppercase tracking-[0.16em] font-bold leading-tight animate-glow-text"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(9px, 2.15cqw, 12px)",
                  color: "rgba(251, 251, 250, 0.95)"
                }}
              >
                Fauzan Kurnia, S.T., M.T.
              </p>
              <div className="flex items-center justify-center mt-2 animate-float-rotate">
                <a
                  href="https://instagram.com/fznkurnia"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 transition hover:scale-110"
                  aria-label="Instagram fznkurnia"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="5cqw"
                    height="5cqw"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(251, 251, 250, 0.9)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
              <div 
                className="w-8 h-[0.5px] my-2 animate-sparkle-line" 
                style={{ backgroundColor: "rgba(251, 251, 250, 0.4)" }}
              />
              <p
                className="italic leading-snug animate-drift"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(10px, 2.2cqw, 13px)",
                  color: "rgba(251, 251, 250, 0.85)"
                }}
              >
                Putra kedua dari <br /> Alm. Bapak Karim D Sahi <br /> dan Ibu Hj. Tety N Mowuu
              </p>
            </div>
          </div>

          {/* Decorative Flowers (Swapped positions) */}
          <div
            ref={refs[1]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "11%", right: "-20%", width: "75%", aspectRatio: "1" }}
          >
            <img 
              src="/assets/flowers/flower-new-3.webp" 
              alt="" 
              onError={(e) => { e.currentTarget.src = "/assets/flowers/flower-new-3.webp"; }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out" 
            />
          </div>
          <div
            ref={refs[2]}
            className="absolute z-10 pointer-events-none"
            style={{ bottom: "10%", left: "-15%", width: "75%", aspectRatio: "1" }}
          >
            <img 
              src="/assets/flowers/flower-new-1.webp" 
              alt="" 
              onError={(e) => { e.currentTarget.src = "/assets/flowers/flower-new-1.webp"; }}
              className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out-delayed" 
            />
          </div>
        </div>
      </div>
    ),
  };
}
