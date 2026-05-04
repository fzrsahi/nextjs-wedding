"use client";



import { useLayoutEffect, useRef, useCallback, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Cloudinary-optimized background (f_auto = best format, q_auto:good = smart compression, w_1080 = mobile-sized)
const CLOUDINARY_BG =
  "https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good,w_1080/v1777856768/background3_lks3ez.webp";

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
      const BG_DUR = 0.6;

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

        // ── Phase 1: deco exit — flowers spin out wildly, text tilts away ──
        const decoExits = exitSlide.exitOrder.filter(a => a.type !== "frame");
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
              ease: "power3.in",
            }, t);
          } else {
            const tilt = i % 2 === 0 ? -5 : 5;
            tl.to(el, {
              y: up ? -80 : 80,
              rotation: tilt,
              opacity: 0,
              scale: 0.88,
              duration: 0.3,
              ease: "power2.in",
            }, t);
          }
        });

        const decoExitEnd = decoExits.length > 0
          ? (decoExits.length - 1) * STAGGER + 0.45 + 0.03
          : 0;

        // ── Phase 2: frame exit — kill CSS anim conflict, then dramatic slide ──
        const frameExits = exitSlide.exitOrder.filter(a => a.type === "frame");
        const frameExitItems = frameExits.length > 0
          ? frameExits
          : exitSlide.exitOrder.filter(a => a.type === "content");

        frameExitItems.forEach(({ refIndex }, i) => {
          const el = exitEls?.[refIndex];
          if (!el) return;
          const t0 = decoExitEnd + i * 0.06;
          // Kill CSS animation so GSAP transform isn't overridden
          tl.call(() => { el.style.animation = "none"; }, [], t0);
          tl.to(el, {
            y: up ? -vh * 0.9 : vh * 0.9,
            rotation: up ? -6 : 6,
            opacity: 0,
            scale: 0.87,
            duration: 0.5,
            ease: "power3.in",
          }, t0 + 0.01);
        });

        const frameExitEnd = decoExitEnd + frameExitItems.length * 0.06 + 0.5 + 0.02;

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

        frameEnterItems.forEach(({ refIndex }, i) => {
          const el = enterEls?.[refIndex];
          if (!el) return;
          // Kill CSS animation so GSAP y transform isn't overridden by animate-float
          const savedAnimation = el.style.animation || "";
          tl.call(() => { el.style.animation = "none"; }, [], enterStart + i * 0.06);
          tl.fromTo(el,
            { y: up ? vh * 0.95 : -vh * 0.95, opacity: 0, scale: 0.82, rotation: up ? 9 : -9 },
            {
              y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.75, ease: "back.out(2.5)",
              onComplete: () => {
                // Restore CSS animation after GSAP is done
                el.style.animation = savedAnimation;
                gsap.set(el, { clearProps: "y,x,rotation,scale" });
              }
            },
            enterStart + i * 0.06 + 0.01
          );
        });

        // Particle burst as frame settles
        tl.call(() => spawnParticles(14), [], enterStart + 0.35);

        // ── Phase 5: decos explode in ──
        const frameEnterEnd = enterStart + frameEnterItems.length * 0.06 + 0.75 + 0.03;
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
              { y: up ? vh * 0.5 : -vh * 0.5, x: xDir * vw * 0.2, scale: 0.05, rotation: up ? 540 : -540, opacity: 0 },
              { y: 0, x: 0, scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.8)" },
              t
            );
          } else {
            tl.fromTo(el,
              { y: up ? 70 : -70, opacity: 0, scale: 0.85, rotation: i % 2 === 0 ? -3 : 3 },
              { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.5)" },
              t
            );
          }
        });
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

        // Past last slide → complete
        if (currentIndex >= currentSlides.length) {
          gsap.to(containerRef.current, {
            yPercent: -100,
            opacity: 0,
            duration: 1.2,
            ease: "power3.inOut",
            onComplete: () => {
              isAnimating = false;
              onCompleteRef.current();
            },
          });
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
        type: "wheel,touch,pointer",
        onUp: () => { onInteractionRef.current?.(); gotoNext(); },
        onDown: () => { onInteractionRef.current?.(); gotoPrev(); },
        tolerance: 20,
        preventDefault: true,
        wheelSpeed: 1,
      });

      return () => { observer.kill(); };
    }, containerRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className="fixed inset-0 z-50 overflow-hidden touch-none"
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
      <div className="relative z-30 mx-auto flex h-full w-full flex-col items-center justify-center py-4">
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
