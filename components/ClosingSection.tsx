import Image from "next/image";
import type { SlideConfig } from "./CinematicScroll";

type TCreateClosingSlideArgs = {
  coupleHeading: string;
  guestName: string;
};

export function createClosingSlide({ coupleHeading, guestName }: TCreateClosingSlideArgs): SlideConfig {
  return {
    id: "closing",
    background: "/assets/background/bg-closing.jpeg",
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
            className="absolute left-[5%] top-[62%] -translate-y-1/2 z-30 flex flex-col items-start gap-2"
          >
            <p
              className="text-[4.35rem] leading-none text-[#fff7e8] animate-glow-text -rotate-6"
              style={{
                fontFamily: "'Brittany Signature', serif",
                textShadow:
                  "0 5px 18px rgba(0,0,0,1), 0 0 26px rgba(255,224,194,0.34), 0 0 2px rgba(255,255,255,0.9)",
              }}
            >
              Aca
            </p>
            <p
              className="text-[2.5rem] leading-none text-[#fff0dd] ml-12"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow:
                  "0 5px 18px rgba(0,0,0,1), 0 0 18px rgba(255,224,194,0.22)",
              }}
            >
              &amp;
            </p>
            <p
              className="text-[4.15rem] leading-none text-[#fff7e8] animate-glow-text rotate-3 ml-6"
              style={{
                fontFamily: "'Brittany Signature', serif",
                textShadow:
                  "0 5px 18px rgba(0,0,0,1), 0 0 26px rgba(255,224,194,0.34), 0 0 2px rgba(255,255,255,0.9)",
              }}
            >
              Fauzan
            </p>
          </div>

          <div className="absolute bottom-[2.5%] left-[4%] z-40 text-left opacity-70 transition-all duration-700 hover:opacity-100 max-w-[85%]">
            <a
              href="https://instagram.com/fzrsahi"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-start gap-0.5"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[7.5px] font-bold uppercase tracking-[0.3em] text-[#fff7e8]/60">
                  Made By
                </span>
                <span className="text-[12px] font-medium tracking-wider text-[#fff7e8] transition-colors group-hover:text-[#f4c89d]">
                  @fzrsahi
                </span>
              </div>
              <p className="text-[7px] italic tracking-wide text-[#fff7e8]/50">
                with 10% Vibe Coding, 40% Passionate & 50% Love
              </p>
            </a>
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
