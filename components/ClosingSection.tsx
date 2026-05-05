import Image from "next/image";
import type { SlideConfig } from "./CinematicScroll";

type TCreateClosingSlideArgs = {
  coupleHeading: string;
  guestName: string;
};

export function createClosingSlide({ coupleHeading, guestName }: TCreateClosingSlideArgs): SlideConfig {
  return {
    id: "closing",
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
      <div className="absolute inset-0 z-30 flex items-center justify-center px-5 py-6 sm:px-6">
        <div
          ref={refs[0]}
          className="relative h-full w-full max-w-[430px] origin-center"
        >
          <div className="absolute inset-x-0 top-[8%] z-30 text-center">
            <h2
              data-cinematic-line
              className="text-[3.35rem] leading-none text-[#fff0dd] animate-glow-text"
              style={{
                fontFamily: "'Brittany Signature', serif",
                textShadow:
                  "0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(255,224,194,0.32), 0 0 2px rgba(255,255,255,0.9)",
              }}
            >
              Thank You
            </h2>
            <p
              data-cinematic-line
              className="mx-auto mt-3 max-w-[31ch] text-[1rem] font-bold leading-[1.48] text-[#fff7e8]"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow:
                  "0 3px 12px rgba(0,0,0,0.98), 0 0 18px rgba(0,0,0,0.72), 0 0 1px rgba(255,255,255,0.9)",
              }}
            >
              Dear {guestName}, it would mean so much to us to have you there,
              sharing your prayers and love as we begin this new chapter.
            </p>
            <p
              data-cinematic-line
              className="mx-auto mt-5 max-w-[31ch] text-[0.94rem] font-extrabold leading-relaxed text-[#fff7e8]"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow:
                  "0 3px 12px rgba(0,0,0,0.98), 0 0 1px rgba(255,255,255,0.9)",
              }}
            >
              With love and warm regards.
            </p>
          </div>

          <div
            data-cinematic-line
            className="absolute bottom-[17%] right-[2%] z-30 -rotate-6 text-right"
          >
            <p
              className="text-[4.35rem] leading-none text-[#fff7e8] animate-glow-text"
              style={{
                fontFamily: "'Brittany Signature', serif",
                textShadow:
                  "0 5px 18px rgba(0,0,0,1), 0 0 26px rgba(255,224,194,0.34), 0 0 2px rgba(255,255,255,0.9)",
              }}
            >
              Aca
            </p>
          </div>

          <div
            data-cinematic-line
            className="absolute bottom-[21%] right-[35%] z-30 translate-x-1/2 text-center"
          >
            <p
              className="text-[2.5rem] leading-none text-[#fff0dd]"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow:
                  "0 5px 18px rgba(0,0,0,1), 0 0 18px rgba(255,224,194,0.22)",
              }}
            >
              &amp;
            </p>
          </div>

          <div
            data-cinematic-line
            className="absolute bottom-[8%] right-[3%] z-30 rotate-3 text-right"
          >
            <p
              className="text-[4.15rem] leading-none text-[#fff7e8] animate-glow-text"
              style={{
                fontFamily: "'Brittany Signature', serif",
                textShadow:
                  "0 5px 18px rgba(0,0,0,1), 0 0 26px rgba(255,224,194,0.34), 0 0 2px rgba(255,255,255,0.9)",
              }}
            >
              Fauzan
            </p>
          </div>

          <div
            data-cinematic-line
            className="absolute -bottom-8 -left-16 z-20 h-[27rem] w-[23rem]"
          >
            <Image
              src="/assets/frame/anime.webp"
              alt=""
              fill
              sizes="352px"
              className="object-contain object-bottom drop-shadow-[0_28px_42px_rgba(0,0,0,0.56)]"
              priority={false}
            />
          </div>

          <div
            ref={refs[1]}
            className="absolute -left-12 bottom-4 z-[1] h-28 w-28 opacity-50"
          >
            <Image
              src="/assets/opening/flower-1.webp"
              alt=""
              fill
              sizes="112px"
              className="object-contain animate-zoom-in-out"
              loading="lazy"
            />
          </div>
          <div
            ref={refs[2]}
            className="absolute -right-14 bottom-20 z-[1] h-28 w-28 opacity-45"
          >
            <Image
              src="/assets/opening/flower-2.webp"
              alt=""
              fill
              sizes="112px"
              className="object-contain animate-zoom-in-out-delayed"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    ),
  };
}
