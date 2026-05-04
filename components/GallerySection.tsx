"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import type { SlideConfig } from "./CinematicScroll";

type TGallerySlideProps = {
  imagePaths: string[];
};

type TLightboxProps = {
  paths: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  reduceMotion: boolean | null;
  titleId: string;
};

function isPublicStaticImage(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

function subscribeToNothing() {
  return () => {};
}

function useClientMounted() {
  return useSyncExternalStore(subscribeToNothing, () => true, () => false);
}

const EN_GALLERY = {
  kicker: "Our Sweet Moments",
  title: "Wedding Gallery",
  intro:
    "Tiny snapshots of our happiest day. Tap around and enjoy every little moment with us.",
  tap: "Tap any photo to open",
  hint: "Tap to view",
  close: "Close gallery",
  previous: "Previous photo",
  next: "Next photo",
} as const;

function GalleryLightbox({
  paths,
  index,
  onClose,
  onPrev,
  onNext,
  reduceMotion,
  titleId,
}: TLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const src = paths[index];

  useEffect(() => {
    closeRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-cinematic-observe-ignore
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.22 }}
    >
      <button
        type="button"
        aria-label={EN_GALLERY.close}
        data-cinematic-observe-ignore
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        data-cinematic-observe-ignore
        className="relative z-10 flex w-full max-w-[min(96vw,960px)] flex-col items-center"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={EN_GALLERY.close}
          data-cinematic-observe-ignore
          className="absolute -top-1 right-0 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/55 text-white transition hover:bg-black/70"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="relative flex min-h-[220px] max-h-[min(76vh,700px)] w-full items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: reduceMotion ? 0 : 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
              transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-[min(76vh,700px)] min-h-[220px] w-full max-w-full items-center justify-center"
            >
              {isPublicStaticImage(src) ? (
                <Image
                  src={src}
                  alt=""
                  fill
                  priority
                  sizes="min(96vw, 960px)"
                  className="object-contain"
                  decoding="async"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={src}
                  alt=""
                  className="max-h-[min(76vh,700px)] w-full max-w-full object-contain"
                  decoding="async"
                  fetchPriority="high"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {paths.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-4">
            <motion.button
              type="button"
              whileTap={{ scale: reduceMotion ? 1 : 0.92 }}
              onClick={onPrev}
              aria-label={EN_GALLERY.previous}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/28 bg-black/45 text-white transition hover:bg-black/65"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </motion.button>
            <span className="min-w-[4.5rem] text-center text-xs font-medium tracking-[0.2em] text-white/88">
              {index + 1} / {paths.length}
            </span>
            <motion.button
              type="button"
              whileTap={{ scale: reduceMotion ? 1 : 0.92 }}
              onClick={onNext}
              aria-label={EN_GALLERY.next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/28 bg-black/45 text-white transition hover:bg-black/65"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </motion.button>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

function GalleryCinematicSlide({
  mountCallbacks,
  imagePaths,
}: {
  mountCallbacks: ((el: HTMLDivElement | null) => void)[];
  imagePaths: string[];
}) {
  const headingId = useId();
  const reduceMotion = useReducedMotion();
  const mounted = useClientMounted();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const paths = imagePaths.filter(Boolean);
  const safeActiveIndex = paths.length > 0 ? activeIndex % paths.length : 0;
  const sideCount = Math.max(0, Math.min(4, paths.length - 1));

  useEffect(() => {
    if (reduceMotion || paths.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((cur) => (cur + 1) % paths.length);
    }, 3800);
    return () => window.clearInterval(id);
  }, [paths.length, reduceMotion]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenIndex(null);
      }
      if (e.key === "ArrowLeft" && paths.length > 1) {
        e.preventDefault();
        setOpenIndex((i) => (i === null ? null : (i - 1 + paths.length) % paths.length));
      }
      if (e.key === "ArrowRight" && paths.length > 1) {
        e.preventDefault();
        setOpenIndex((i) => (i === null ? null : (i + 1) % paths.length));
      }
    },
    [openIndex, paths.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown, openIndex]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center px-3 py-4 sm:px-4">
      <div
        ref={(el) => {
          mountCallbacks[0]?.(el);
        }}
        className="relative w-full max-w-[460px] origin-center animate-float"
        style={{ width: "100%" }}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.38)_55%,transparent_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_55%_at_50%_0%,rgba(255,255,255,0.12),transparent_62%)]" />
        <div className="pointer-events-none absolute -left-8 top-8 z-[2] h-28 w-28 opacity-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/opening/flower-1.png"
            alt=""
            className="h-full w-full object-contain animate-zoom-in-out"
          />
        </div>
        <div className="pointer-events-none absolute -right-8 top-8 z-[2] h-28 w-28 opacity-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/opening/flower-2.png"
            alt=""
            className="h-full w-full object-contain animate-zoom-in-out-delayed"
          />
        </div>

        <div className="relative z-10">
          <header className="px-1 text-center">
            <p
              data-cinematic-line
              className="text-[1.95rem] leading-none text-[#7b2233]"
              style={{
                fontFamily: "'Brittany Signature', serif",
                textShadow: "0 2px 12px rgba(0,0,0,0.42)",
              }}
            >
              {EN_GALLERY.kicker}
            </p>
            <h2
              id={headingId}
              data-cinematic-line
              className="mt-1 text-[1.3rem] font-semibold leading-[1.03] tracking-[0.12em] uppercase text-[#f4e6d8]"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              {EN_GALLERY.title}
            </h2>
            <div className="mx-auto mt-1 h-px w-36 bg-[linear-gradient(90deg,transparent,rgba(240,226,212,0.65),transparent)]" />
            <p
              data-cinematic-line
              className="mx-auto mt-1.5 max-w-[34ch] text-[0.74rem] leading-relaxed text-[#f3e8de]/95"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              {EN_GALLERY.intro}
            </p>
            <p
              className="mt-2 text-[0.62rem] font-medium tracking-wide text-[#f3e8dd]/74"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                textShadow: "0 2px 10px rgba(0,0,0,0.4)",
              }}
            >
              {EN_GALLERY.tap}
            </p>
          </header>

          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            <button
              type="button"
              className="group relative col-span-2 row-span-2 aspect-[4/5] overflow-hidden rounded-2xl text-left sm:aspect-[5/6]"
              onClick={() => setOpenIndex(safeActiveIndex)}
              aria-label={`Open highlighted photo ${safeActiveIndex + 1}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`hero-${safeActiveIndex}`}
                  initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
                  transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  {isPublicStaticImage(paths[safeActiveIndex] ?? "") ? (
                    <Image
                      src={paths[safeActiveIndex] ?? paths[0] ?? ""}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 58vw, 360px"
                      className="object-cover object-center transition duration-700 group-hover:scale-[1.06]"
                      priority
                      decoding="async"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={paths[safeActiveIndex] ?? paths[0] ?? ""}
                      alt=""
                      className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.06]"
                      decoding="async"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,3,5,0.68)_0%,transparent_58%)]" />
              <span className="absolute bottom-2.5 left-2.5 text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-white/74">
                Highlight
              </span>
            </button>

            <div className="col-span-1 row-span-2 flex flex-col gap-2.5">
              {Array.from({ length: Math.max(0, Math.min(2, sideCount)) }).map((_, i) => {
                const idx = (safeActiveIndex + i + 1) % paths.length;
                const src = paths[idx]!;
                return (
                  <button
                    key={`side-${idx}-${src.slice(0, 32)}`}
                    type="button"
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl text-left"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Set photo ${idx + 1} as highlight`}
                  >
                    {isPublicStaticImage(src) ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 24vw, 140px"
                        className="object-cover object-center transition duration-500 group-hover:scale-[1.06]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.06]"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,3,5,0.6)_0%,transparent_62%)]" />
                  </button>
                );
              })}
            </div>

            {Array.from({ length: Math.max(0, Math.min(3, paths.length - 1)) }).map((_, i) => {
              const idx = (safeActiveIndex + i + 3) % paths.length;
              const src = paths[idx]!;
              return (
                <button
                  key={`bottom-${idx}-${src.slice(0, 28)}`}
                  type="button"
                  className="group relative aspect-[4/3] overflow-hidden rounded-xl text-left"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Set photo ${idx + 1} as highlight`}
                >
                  {isPublicStaticImage(src) ? (
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 28vw, 120px"
                      className="object-cover object-center transition duration-500 group-hover:scale-[1.06]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.06]"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,3,5,0.55)_0%,transparent_65%)]" />
                </button>
              );
            })}
          </div>

          <p className="mt-1 text-center text-[0.52rem] font-semibold uppercase tracking-[0.26em] text-[#e7d0bb]/48">
            {EN_GALLERY.hint}
          </p>
        </div>
      </div>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {openIndex !== null ? (
                <GalleryLightbox
                  key="gallery-lightbox"
                  paths={paths}
                  index={openIndex}
                  onClose={() => setOpenIndex(null)}
                  onPrev={() =>
                    setOpenIndex((idx) =>
                      idx === null ? null : (idx - 1 + paths.length) % paths.length,
                    )
                  }
                  onNext={() =>
                    setOpenIndex((idx) => (idx === null ? null : (idx + 1) % paths.length))
                  }
                  reduceMotion={reduceMotion}
                  titleId={headingId}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}

export function createGallerySlide({ imagePaths }: TGallerySlideProps): SlideConfig {
  return {
    id: "gallery",
    refCount: 1,
    exitOrder: [{ refIndex: 0, type: "frame" }],
    enterOrder: [{ refIndex: 0, type: "frame" }],
    render: (refs) => <GalleryCinematicSlide mountCallbacks={refs} imagePaths={imagePaths} />,
  };
}
