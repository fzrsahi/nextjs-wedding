"use client";



import { useLayoutEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Cloudinary-optimized background (f_auto = best format, q_auto:good = smart compression, w_1080 = mobile-sized)
const CLOUDINARY_BG =
  "https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good,w_1080/v1777856768/background3_lks3ez.webp";

// --- Text-line stagger (optional per slide via `data-cinematic-line`) ---
const CINEMATIC_LINE_SEL = "[data-cinematic-line]";
const LINE_STAGGER_TEXT = 0.05;
const LINE_EXIT_DUR = 0.38;
const LINE_ENTER_DUR = 0.44;
/** Frame mulai naik sebelum baris teks selesai — transisi terasa satu aliran, tidak “diam dulu”. */
const FRAME_LINE_OVERLAP = 0.2;
/** Frame exit sedikit lebih awal di akhir fase deco (mengurangi jeda kaku sebelum bingkai jalan). */
const DECO_TO_FRAME_OVERLAP = 0.08;

function getCinematicLines(el: HTMLElement | null): HTMLElement[] {
  if (!el) return [];
  return Array.from(el.querySelectorAll<HTMLElement>(`:scope ${CINEMATIC_LINE_SEL}`));
}

// --- Types ---

export type ElementType = "content" | "flower" | "frame";

export type AnimElement = {
  /** Index into the refSetters array */
  refIndex: number;
  type: ElementType;
};

export type SlideConfig = {
  id: string;
  /** Number of animatable elements in this slide */
  refCount: number;
  /** Order elements exit (first in array exits first with stagger) */
  exitOrder: AnimElement[];
  /** Order elements enter (first in array enters first with stagger) */
  enterOrder: AnimElement[];
  /** Render receives ref callbacks, attach them to your DOM nodes */
  render: (refSetters: ((el: HTMLDivElement | null) => void)[]) => React.ReactNode;
};

type CinematicScrollProps = {
  slides: SlideConfig[];
  backgroundSrc?: string;
  onComplete: () => void;
  onInteraction?: () => void;
  onFirstScroll?: () => void;
  scrollGuide?: React.ReactNode;
};

// --- Component ---

export function CinematicScrollContainer({
  slides,
  backgroundSrc = "/assets/background/background3.webp",
  onComplete,
  onInteraction,
  onFirstScroll,
  scrollGuide,
}: CinematicScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // elementRefs[slideIndex][elementIndex] = HTMLDivElement | null
  const elementRefs = useRef<(HTMLDivElement | null)[][]>(
    slides.map((s) => new Array(s.refCount).fill(null))
  );

  // Store callbacks in refs so useLayoutEffect never re-runs from callback changes
  const onCompleteRef = useRef(onComplete);
  const onInteractionRef = useRef(onInteraction);
  const onFirstScrollRef = useRef(onFirstScroll);
  const slidesRef = useRef(slides);

  // Keep refs synced with latest props
  onCompleteRef.current = onComplete;
  onInteractionRef.current = onInteraction;
  onFirstScrollRef.current = onFirstScroll;
  slidesRef.current = slides;

      const getRefSetter = useCallback(
    (slideIdx: number, elIdx: number) => (el: HTMLDivElement | null) => {
      if (elementRefs.current[slideIdx]) {
        elementRefs.current[slideIdx][elIdx] = el;
      }
    },
    []
  );

  const bgRef = useRef<HTMLDivElement>(null);

  // This effect runs ONCE on mount. It reads from refs so it always has fresh values.
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    // Register plugin inside effect for safety
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      let currentIndex = 0;
      let isAnimating = false;
      let hasScrolled = false;

      const getSlides = () => slidesRef.current;

      // Helper: hide all elements of a slide
      const hideSlide = (slideIdx: number) => {
        const slide = getSlides()[slideIdx];
        if (!slide) return;
        slide.enterOrder.forEach(({ refIndex }) => {
          const el = elementRefs.current[slideIdx]?.[refIndex];
          if (el) gsap.set(el, { visibility: "hidden", opacity: 0 });
        });
      };

      // Helper: make all elements of a slide visible
      const showSlide = (slideIdx: number) => {
        const slide = getSlides()[slideIdx];
        if (!slide) return;
        slide.enterOrder.forEach(({ refIndex }) => {
          const el = elementRefs.current[slideIdx]?.[refIndex];
          if (el) gsap.set(el, { visibility: "visible" });
        });
      };

      // Initial state: hide all slides except first
      const initSlides = getSlides();
      for (let si = 1; si < initSlides.length; si++) {
        const slide = initSlides[si];
        slide.enterOrder.forEach(({ refIndex }) => {
          const el = elementRefs.current[si]?.[refIndex];
          if (!el) return;
          gsap.set(el, { visibility: "hidden", opacity: 0 });
        });
      }

      // ─── Particle burst helper ───
      const spawnParticles = (count = 12) => {
        const el = containerRef.current;
        if (!el) return;
        const colors = ["#fbfbfa", "#c3c9cf", "#7b2332", "#245c48", "#d4af37", "#f0d9c8"];
        Array.from({ length: count }).forEach((_, i) => {
          const dot = document.createElement("div");
          const size = 4 + Math.random() * 7;
          const isSquare = Math.random() > 0.55;
          dot.style.cssText = `
            position:fixed;width:${size}px;height:${size}px;
            background:${colors[i % colors.length]};
            border-radius:${isSquare ? "2px" : "50%"};
            left:50%;top:50%;
            margin-left:${-size / 2}px;margin-top:${-size / 2}px;
            pointer-events:none;z-index:9999;
          `;
          el.appendChild(dot);
          const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
          const dist = 70 + Math.random() * 160;
          gsap.fromTo(dot,
            { x: 0, y: 0, opacity: 1, scale: 1, rotation: Math.random() * 180 },
            {
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0, scale: 0,
              rotation: Math.random() * 720 - 360,
              duration: 0.65 + Math.random() * 0.5,
              delay: Math.random() * 0.15,
              ease: "power2.out",
              onComplete: () => dot.remove(),
            }
          );
        });
      };

      // ─── Shared animation builder ───
      const STAGGER = 0.08;
      const BG_DUR = 0.52;

      const buildExitEnter = (
        tl: gsap.core.Timeline,
        exitSlide: (typeof slidesRef.current)[0],
        exitEls: (HTMLDivElement | null)[] | undefined,
        enterSlide: (typeof slidesRef.current)[0],
        enterEls: (HTMLDivElement | null)[] | undefined,
        direction: "forward" | "backward",
        onEnterReady: () => void
      ) => {
        const up = direction === "forward";
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        /** Bunga: img pakai keyframes zoom — matikan saat GSAP menggerakkan wrapper supaya tidak rebut transform/composite. */
        const flowerImg = (container: HTMLDivElement | null) =>
          container?.querySelector<HTMLImageElement>(":scope > img") ?? null;

        // ── Phase 1: deco exit — flowers spin out wildly, text tilts away ──
        const decoExits = exitSlide.exitOrder.filter(a => a.type !== "frame");
        let decoExitEnd = 0;
        decoExits.forEach(({ refIndex, type }, i) => {
          const el = exitEls?.[refIndex];
          if (!el) return;
          const t = i * STAGGER;
            if (type === "flower") {
            const xDir = i % 2 === 0 ? -1 : 1;
            tl.to(el, {
              y: up ? -vh * 0.85 : vh * 0.85,
              x: xDir * vw * 0.25,
              scale: 0.1,
              rotation: up ? -720 : 720,
              opacity: 0,
              duration: 0.45,
              ease: "power2.inOut",
              force3D: true,
              onStart: () => {
                const img = flowerImg(el);
                if (img) img.style.animation = "none";
              },
            }, t);
            decoExitEnd = Math.max(decoExitEnd, t + 0.45);
          } else {
            const lines = getCinematicLines(el);
            const lineY = Math.min(vh * 0.13, 110);
            if (lines.length > 0) {
              lines.forEach((line, li) => {
                tl.to(line, {
                  y: up ? -lineY : lineY,
                  opacity: 0,
                  duration: LINE_EXIT_DUR,
                  ease: "sine.in",
                  force3D: true,
                }, t + li * LINE_STAGGER_TEXT);
              });
              const afterLines = t + (lines.length - 1) * LINE_STAGGER_TEXT + LINE_EXIT_DUR;
              tl.to(el, { opacity: 0, duration: 0.12 }, afterLines);
              decoExitEnd = Math.max(decoExitEnd, afterLines + 0.12);
            } else {
              const tilt = i % 2 === 0 ? -5 : 5;
              tl.to(el, {
                y: up ? -80 : 80,
                rotation: tilt,
                opacity: 0,
                scale: 0.88,
                duration: 0.3,
                ease: "power2.in",
                force3D: true,
              }, t);
              decoExitEnd = Math.max(decoExitEnd, t + 0.3);
            }
          }
        });
        if (decoExits.length > 0) decoExitEnd += 0.03;

        // ── Phase 2: frame exit — kill CSS anim conflict, then dramatic slide ──
        const frameExits = exitSlide.exitOrder.filter(a => a.type === "frame");
        const frameExitItems = frameExits.length > 0
          ? frameExits
          : exitSlide.exitOrder.filter(a => a.type === "content");

        const lastDeco = decoExits[decoExits.length - 1];
        const decoFrameNudge =
          lastDeco?.type === "content" ? DECO_TO_FRAME_OVERLAP : DECO_TO_FRAME_OVERLAP * 0.45;
        const frameExitBase = Math.max(0, decoExitEnd - decoFrameNudge);

        let frameExitEnd = decoExitEnd;
        frameExitItems.forEach(({ refIndex }, i) => {
          const el = exitEls?.[refIndex];
          if (!el) return;
          const t0 = frameExitBase + i * 0.05;
          const lines = getCinematicLines(el);
          const lineY = Math.min(vh * 0.13, 110);
          let frameMoveStart = t0;
          if (lines.length > 0) {
            const lineBlockEnd = t0 + (lines.length - 1) * LINE_STAGGER_TEXT + LINE_EXIT_DUR;
            frameMoveStart = Math.max(
              t0,
              lineBlockEnd - FRAME_LINE_OVERLAP + 0.02
            );
            lines.forEach((line, li) => {
              tl.to(line, {
                y: up ? -lineY : lineY,
                opacity: 0,
                duration: LINE_EXIT_DUR,
                ease: "sine.in",
                force3D: true,
              }, t0 + li * LINE_STAGGER_TEXT);
            });
          }
          tl.to(el, {
            y: up ? -vh * 0.9 : vh * 0.9,
            rotation: up ? -5 : 5,
            opacity: 0,
            scale: 0.9,
            duration: 0.58,
            ease: "sine.inOut",
            force3D: true,
            onStart: () => {
              el.style.animation = "none";
            },
          }, frameMoveStart);
          const thisEnd = frameMoveStart + 0.58 + 0.02;
          frameExitEnd = Math.max(frameExitEnd, thisEnd);
        });

        if (frameExitItems.length === 0) {
          frameExitEnd = decoExitEnd;
        }

        // ── Phase 3: bg transitions AFTER all assets are gone ──
        if (bgRef.current) {
          tl.to(bgRef.current, {
            y: up ? `-=${vh}` : `+=${vh}`,
            duration: BG_DUR,
            ease: "power2.inOut",
            onComplete: () => { gsap.set(bgRef.current, { y: 0 }); },
          }, frameExitEnd); // waits for ALL assets to exit first
        }

        // ── Phase 4: frame enters AFTER bg settles ──
        onEnterReady();
        const enterStart = frameExitEnd + BG_DUR;
        const frameEnters = enterSlide.enterOrder.filter(a => a.type === "frame");
        const frameEnterItems = frameEnters.length > 0
          ? frameEnters
          : enterSlide.enterOrder.filter(a => a.type === "content");

        let frameEnterEnd = enterStart;

        frameEnterItems.forEach(({ refIndex }, i) => {
          const el = enterEls?.[refIndex];
          if (!el) return;
          const savedAnimation = el.style.animation || "";
          const lines = getCinematicLines(el);
          const tFrame = enterStart + i * 0.05;
          const enterFromY = Math.min(48, vh * 0.07);

          tl.fromTo(el,
            { y: up ? vh * 0.92 : -vh * 0.92, opacity: 0, scale: 0.9, rotation: up ? 5 : -5, force3D: true },
            {
              y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.68, ease: "power2.out",
              force3D: true,
              onStart: () => {
                el.style.animation = "none";
                if (lines.length > 0) {
                  gsap.set(lines, {
                    opacity: 0,
                    y: up ? enterFromY : -enterFromY,
                  });
                }
              },
              onComplete: () => {
                el.style.animation = savedAnimation;
                gsap.set(el, { clearProps: "y,x,rotation,scale" });
              },
            },
            tFrame
          );

          const landAt = tFrame + 0.68;
          if (lines.length > 0) {
            tl.to(lines, {
              opacity: 1,
              y: 0,
              duration: LINE_ENTER_DUR,
              stagger: LINE_STAGGER_TEXT,
              ease: "power3.out",
              force3D: true,
              onComplete: () => {
                gsap.set(lines, { clearProps: "transform,opacity" });
              },
            }, landAt);
          }
          const lineRevealEnd = lines.length > 0
            ? landAt + LINE_ENTER_DUR + (lines.length - 1) * LINE_STAGGER_TEXT
            : landAt;
          frameEnterEnd = Math.max(frameEnterEnd, lineRevealEnd);
        });

        frameEnterEnd += 0.03;
        if (frameEnterItems.length === 0) {
          frameEnterEnd = enterStart + 0.71 + 0.03;
        }

        // Particle burst as frame settles
        tl.call(() => spawnParticles(14), [], enterStart + 0.42);

        // ── Phase 5: decos explode in ──
        const allDecoEnters = enterSlide.enterOrder.filter(a =>
          frameEnters.length > 0 ? a.type !== "frame" : a.type !== "content"
        );

        allDecoEnters.forEach(({ refIndex, type }, i) => {
          const el = enterEls?.[refIndex];
          if (!el) return;
          const t = frameEnterEnd + i * STAGGER;
          if (type === "flower") {
            const xDir = i % 2 === 0 ? -1 : 1;
            tl.fromTo(el,
              { y: up ? vh * 0.5 : -vh * 0.5, x: xDir * vw * 0.2, scale: 0.05, rotation: up ? 540 : -540, opacity: 0, force3D: true },
              {
                y: 0, x: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.72, ease: "power2.out",
                force3D: true,
                onStart: () => {
                  const img = flowerImg(el);
                  if (img) img.style.animation = "none";
                },
                onComplete: () => {
                  const img = flowerImg(el);
                  if (img) img.style.removeProperty("animation");
                },
              },
              t
            );
          } else {
            const lines = getCinematicLines(el);
            const enterFromY = Math.min(56, window.innerHeight * 0.08);
            if (lines.length > 0) {
              tl.call(() => {
                /** Parent kept opacity 0 after init/hideSlide; children cannot show otherwise. */
                gsap.set(el, { opacity: 1 });
                gsap.set(lines, {
                  opacity: 0,
                  y: up ? enterFromY : -enterFromY,
                });
              }, [], t);
              tl.to(lines, {
                opacity: 1,
                y: 0,
                duration: LINE_ENTER_DUR,
                stagger: LINE_STAGGER_TEXT,
                ease: "power3.out",
                force3D: true,
                onComplete: () => {
                  gsap.set(lines, { clearProps: "transform,opacity" });
                },
              }, t + 0.02);
            } else {
              tl.fromTo(el,
                { y: up ? 70 : -70, opacity: 0, scale: 0.85, rotation: i % 2 === 0 ? -3 : 3, force3D: true },
                { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.5)", force3D: true },
                t
              );
            }
          }
        });
      };

      const buildFinalExitToContent = (
        slide: (typeof slidesRef.current)[0],
        slideEls: (HTMLDivElement | null)[] | undefined,
        onDone: () => void
      ) => {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const STAGGER = 0.08;
        const BG_DUR = 0.52;

        const flowerImg = (container: HTMLDivElement | null) =>
          container?.querySelector<HTMLImageElement>(":scope > img") ?? null;

        const tl = gsap.timeline({ onComplete: onDone });

        const decoExits = slide.exitOrder.filter((a) => a.type !== "frame");
        let decoExitEnd = 0;
        decoExits.forEach(({ refIndex, type }, i) => {
          const el = slideEls?.[refIndex];
          if (!el) return;
          const t = i * STAGGER;
          if (type === "flower") {
            const xDir = i % 2 === 0 ? -1 : 1;
            tl.to(
              el,
              {
                y: -vh * 0.85,
                x: xDir * vw * 0.25,
                scale: 0.1,
                rotation: -720,
                opacity: 0,
                duration: 0.45,
                ease: "power2.inOut",
                force3D: true,
                onStart: () => {
                  const img = flowerImg(el);
                  if (img) img.style.animation = "none";
                },
              },
              t
            );
            decoExitEnd = Math.max(decoExitEnd, t + 0.45);
          } else {
            const lines = getCinematicLines(el);
            const lineY = Math.min(vh * 0.13, 110);
            if (lines.length > 0) {
              lines.forEach((line, li) => {
                tl.to(
                  line,
                  {
                    y: -lineY,
                    opacity: 0,
                    duration: LINE_EXIT_DUR,
                    ease: "sine.in",
                    force3D: true,
                  },
                  t + li * LINE_STAGGER_TEXT
                );
              });
              const afterLines = t + (lines.length - 1) * LINE_STAGGER_TEXT + LINE_EXIT_DUR;
              tl.to(el, { opacity: 0, duration: 0.12 }, afterLines);
              decoExitEnd = Math.max(decoExitEnd, afterLines + 0.12);
            } else {
              tl.to(
                el,
                {
                  y: -80,
                  rotation: i % 2 === 0 ? -5 : 5,
                  opacity: 0,
                  scale: 0.88,
                  duration: 0.3,
                  ease: "power2.in",
                  force3D: true,
                },
                t
              );
              decoExitEnd = Math.max(decoExitEnd, t + 0.3);
            }
          }
        });
        if (decoExits.length > 0) decoExitEnd += 0.03;

        const frameExits = slide.exitOrder.filter((a) => a.type === "frame");
        const frameExitItems =
          frameExits.length > 0 ? frameExits : slide.exitOrder.filter((a) => a.type === "content");

        let frameExitEnd = decoExitEnd;
        frameExitItems.forEach(({ refIndex }, i) => {
          const el = slideEls?.[refIndex];
          if (!el) return;
          const t0 = Math.max(0, decoExitEnd - DECO_TO_FRAME_OVERLAP) + i * 0.05;
          const lines = getCinematicLines(el);
          const lineY = Math.min(vh * 0.13, 110);
          let frameMoveStart = t0;

          if (lines.length > 0) {
            const lineBlockEnd = t0 + (lines.length - 1) * LINE_STAGGER_TEXT + LINE_EXIT_DUR;
            frameMoveStart = Math.max(t0, lineBlockEnd - FRAME_LINE_OVERLAP + 0.02);
            lines.forEach((line, li) => {
              tl.to(
                line,
                {
                  y: -lineY,
                  opacity: 0,
                  duration: LINE_EXIT_DUR,
                  ease: "sine.in",
                  force3D: true,
                },
                t0 + li * LINE_STAGGER_TEXT
              );
            });
          }

          tl.to(
            el,
            {
              y: -vh * 0.9,
              rotation: -5,
              opacity: 0,
              scale: 0.9,
              duration: 0.58,
              ease: "sine.inOut",
              force3D: true,
              onStart: () => {
                el.style.animation = "none";
              },
            },
            frameMoveStart
          );
          frameExitEnd = Math.max(frameExitEnd, frameMoveStart + 0.58 + 0.02);
        });

        if (bgRef.current) {
          tl.to(
            bgRef.current,
            {
              y: `-=${vh}`,
              duration: BG_DUR,
              ease: "power2.inOut",
              onComplete: () => {
                gsap.set(bgRef.current, { y: 0 });
              },
            },
            frameExitEnd
          );
        }

        // Handoff halus ke konten utama setelah pola transisi slide selesai.
        tl.to(
          containerRef.current,
          {
            opacity: 0,
            yPercent: -14,
            duration: 0.5,
            ease: "power2.out",
          },
          frameExitEnd + BG_DUR - 0.06
        );
      };

      // --- FORWARD ---
      const gotoNext = () => {
        const currentSlides = getSlides();
        if (isAnimating || currentIndex >= currentSlides.length) return;
        isAnimating = true;

        if (!hasScrolled) {
          hasScrolled = true;
          onFirstScrollRef.current?.();
        }

        currentIndex++;

        // Past last slide → complete (pakai pola transisi yang sama seperti antar-slide)
        if (currentIndex >= currentSlides.length) {
          buildFinalExitToContent(
            currentSlides[currentSlides.length - 1],
            elementRefs.current[currentSlides.length - 1],
            () => {
              isAnimating = false;
              onCompleteRef.current();
            }
          );
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            hideSlide(currentIndex - 1);
            isAnimating = false;
          },
        });

        buildExitEnter(
          tl,
          currentSlides[currentIndex - 1],
          elementRefs.current[currentIndex - 1],
          currentSlides[currentIndex],
          elementRefs.current[currentIndex],
          "forward",
          () => showSlide(currentIndex)
        );
      };

      // --- BACKWARD ---
      const gotoPrev = () => {
        const currentSlides = getSlides();
        if (isAnimating || currentIndex <= 0) return;
        isAnimating = true;
        currentIndex--;

        const tl = gsap.timeline({
          onComplete: () => {
            hideSlide(currentIndex + 1);
            isAnimating = false;
          },
        });

        buildExitEnter(
          tl,
          currentSlides[currentIndex + 1],
          elementRefs.current[currentIndex + 1],
          currentSlides[currentIndex],
          elementRefs.current[currentIndex],
          "backward",
          () => showSlide(currentIndex)
        );
      };

      // Scroll observer
      const observer = ScrollTrigger.observe({
        target: window,
        /** Tanpa `pointer`: alur klik mouse tidak di-hijack Observer (masalah tombol RSVP). */
        type: "wheel,touch",
        onUp: () => { onInteractionRef.current?.(); gotoNext(); },
        onDown: () => { onInteractionRef.current?.(); gotoPrev(); },
        tolerance: 20,
        preventDefault: true,
        allowClicks: true,
        wheelSpeed: 1,
        /**
         * Lebih andal dari `ignore` selector: GSAP memanggil ini untuk wheel/touch/press.
         * `closest` menangkap target di dalam teks/ikon di dalam zona RSVP.
         */
        ignoreCheck: (ev: Event) => {
          const t = ev.target;
          if (!t || !(t instanceof Element)) return false;
          return Boolean(
            t.closest("[data-cinematic-observe-ignore]") ||
              t.closest("button") ||
              t.closest("a") ||
              t.closest("input") ||
              t.closest("textarea") ||
              t.closest("select"),
          );
        },
      });

      return () => { observer.kill(); };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Build ref setters for each slide
  const allRefSetters = useMemo(() => 
    slides.map((slide, si) =>
      Array.from({ length: slide.refCount }, (_, ei) => getRefSetter(si, ei))
    ),
    [slides, getRefSetter]
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden touch-pan-y"
      style={{ overscrollBehavior: "none" }}
    >
      {/* 
        Background — 3 copies (300vh) so there's always image coverage during GSAP movement.
        Primary: Cloudinary (optimized). Fallback: local webp.
        GSAP moves by ±100vh; reset is invisible since all copies are identical.
      */}
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-x-0"
        style={{ top: "-100vh", height: "300vh", willChange: "transform" }}
      >
        {([0, 1, 2] as const).map((i) => (
          <div key={i} className="relative h-screen w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CLOUDINARY_BG}
              alt=""
              onError={(e) => { e.currentTarget.src = backgroundSrc; }}
              className="absolute inset-0 h-full w-full object-cover"
              loading={i === 1 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* All slides layered */}
      <div className="relative z-30 mx-auto flex h-full w-full max-w-full flex-col items-center justify-center touch-manipulation py-4">
        <div className="relative h-full w-full max-w-full text-center">
          {slides.map((slide, si) => (
            <div key={slide.id}>
              {slide.render(allRefSetters[si])}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll guide */}
      {scrollGuide}
    </div>
  );
}
