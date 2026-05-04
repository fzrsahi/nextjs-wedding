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
            src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857466/couple_hq7hmk.png"
            alt=""
            onError={(e) => { e.currentTarget.src = "/assets/frame/couple.png"; }}
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
            <div className="flex flex-col items-center mb-[4.5cqw] w-full max-w-[85%]">
              <h3
                className="animate-sway"
                style={{ 
                  fontFamily: "'Brittany Signature', serif", 
                  lineHeight: 1.1,
                  fontSize: "clamp(24px, 7cqw, 36px)",
                  color: "#fbfbfa"
                }}
              >
                Aca
              </h3>
              <p
                className="mt-1 uppercase tracking-widest font-bold leading-tight animate-glow-text"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(10px, 2.4cqw, 13px)",
                  color: "rgba(251, 251, 250, 0.95)"
                }}
              >
                Syafa’ Tasya Nabila Zees, S.I.P.
              </p>
              <div className="flex items-center gap-[1cqw] mt-1 animate-float-rotate">
                <Camera size="2.2cqw" color="rgba(251, 251, 250, 0.7)" />
                <p 
                  className="tracking-wider font-medium" 
                  style={{ 
                    fontSize: "clamp(8px, 1.8cqw, 10px)",
                    color: "rgba(251, 251, 250, 0.7)"
                  }}
                >
                  @Syafatazya
                </p>
              </div>
              <div 
                className="w-8 h-[0.5px] my-2 animate-sparkle-line" 
                style={{ backgroundColor: "rgba(251, 251, 250, 0.4)" }}
              />
              <p
                className="italic leading-snug animate-drift"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(9px, 2cqw, 12px)",
                  color: "rgba(251, 251, 250, 0.85)"
                }}
              >
                The first daughter of <br /> The Late Mr. H. Nazir S Zees, S.P., M.Si. <br /> and Mrs. Hj. Sofya Taludio, S.Pd., M.Pd.
              </p>
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center w-full mb-[4.5cqw] animate-breathe">
              <div className="h-[0.5px] w-8" style={{ backgroundColor: "rgba(251, 251, 250, 0.4)" }} />
              <span 
                className="mx-2 italic" 
                style={{ 
                  fontFamily: "serif", 
                  fontSize: "clamp(9px, 2.5cqw, 12px)",
                  color: "#fbfbfa"
                }}
              >
                and
              </span>
              <div className="h-[0.5px] w-8" style={{ backgroundColor: "rgba(251, 251, 250, 0.4)" }} />
            </div>

            {/* Groom Section */}
            <div className="flex flex-col items-center w-full max-w-[85%]">
              <h3
                className="animate-sway"
                style={{ 
                  fontFamily: "'Brittany Signature', serif", 
                  lineHeight: 1.1,
                  fontSize: "clamp(24px, 7cqw, 36px)",
                  color: "#fbfbfa"
                }}
              >
                Fauzan
              </h3>
              <p
                className="mt-1 uppercase tracking-widest font-bold leading-tight animate-glow-text"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(10px, 2.4cqw, 13px)",
                  color: "rgba(251, 251, 250, 0.95)"
                }}
              >
                Fauzan Kurnia, S.T., M.T.
              </p>
              <div className="flex items-center gap-[1cqw] mt-1 animate-float-rotate">
                <Camera size="2.2cqw" color="rgba(251, 251, 250, 0.7)" />
                <p 
                  className="tracking-wider font-medium" 
                  style={{ 
                    fontSize: "clamp(8px, 1.8cqw, 10px)",
                    color: "rgba(251, 251, 250, 0.7)"
                  }}
                >
                  @fznkurnia
                </p>
              </div>
              <div 
                className="w-8 h-[0.5px] my-2 animate-sparkle-line" 
                style={{ backgroundColor: "rgba(251, 251, 250, 0.4)" }}
              />
              <p
                className="italic leading-snug animate-drift"
                style={{ 
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(9px, 2cqw, 12px)",
                  color: "rgba(251, 251, 250, 0.85)"
                }}
              >
                The second son of <br /> The Late Mr. Karim D Sahi <br /> and Mrs. Hj. Tety N Mowuu
              </p>
            </div>
          </div>

          {/* Decorative Flowers (Swapped positions) */}
          <div
            ref={refs[1]}
            className="absolute z-10 pointer-events-none"
            style={{ top: "8%", right: "-20%", width: "75%", aspectRatio: "1" }}
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
            style={{ bottom: "10%", left: "-20%", width: "75%", aspectRatio: "1" }}
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
