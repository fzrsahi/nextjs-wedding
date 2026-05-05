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
  title: "Our Sweet Gallery",
  intro:
    "Tiny snapshots of our happiest day. Tap around and enjoy every little moment with us.",
  close: "Close gallery",
  previous: "Previous photo",
  next: "Next photo",
} as const;

const DEFAULT_GALLERY_VIDEO_URL =
  "https://res.cloudinary.com/dg4xtvqwc/video/upload/v1777979011/video_f5r8yl.webm";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const mounted = useClientMounted();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const paths = imagePaths.filter(Boolean);
  const galleryItems = paths.map((src, index) => ({ src, index }));
  const displayGalleryItems =
    galleryItems.length > 1
      ? [
          galleryItems[galleryItems.length - 1]!,
          ...galleryItems.slice(1, -1),
          galleryItems[0]!,
        ]
      : galleryItems;

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

  useEffect(() => {
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.warn("Video autoplay failed:", err);
        }
      }
    };
    playVideo();
  }, []);

  return (
    <div
      data-cinematic-allow-scroll
      className="absolute inset-0 z-30 flex items-center justify-center px-4 py-5 sm:px-6"
    >
      <div
        ref={(el) => {
          mountCallbacks[0]?.(el);
        }}
        className="relative w-full max-w-[500px] origin-center"
        style={{ width: "100%" }}
      >
        <div className="pointer-events-none absolute -left-9 top-14 z-[2] h-24 w-24 opacity-55">
          <Image
            src="/assets/opening/flower-1.webp"
            alt=""
            fill
            sizes="96px"
            className="object-contain animate-zoom-in-out"
            loading="lazy"
          />
        </div>
        <div className="pointer-events-none absolute -right-9 top-20 z-[2] h-24 w-24 opacity-55">
          <Image
            src="/assets/opening/flower-2.webp"
            alt=""
            fill
            sizes="96px"
            className="object-contain animate-zoom-in-out-delayed"
            loading="lazy"
          />
        </div>

        <div className="relative z-10">
          <header className="relative px-1 text-center">
            <div
              className="mx-auto w-[min(90vw,27rem)] rounded-[2.2rem] border border-[#ffe1c4]/18 bg-[radial-gradient(ellipse_at_center,rgba(28,8,14,0.76)_0%,rgba(28,8,14,0.56)_52%,rgba(9,42,31,0.22)_84%)] px-4 py-3 shadow-[0_16px_36px_rgba(0,0,0,0.34)] backdrop-blur-[1.5px]"
            >
              <h2
                id={headingId}
                data-cinematic-line
                className="text-[2.15rem] leading-none text-[#fff0dd] animate-glow-text"
                style={{
                  fontFamily: "'Brittany Signature', serif",
                  textShadow:
                    "0 2px 1px rgba(28,8,14,0.95), 0 8px 22px rgba(0,0,0,0.9), 0 0 18px rgba(255,224,194,0.28)",
                }}
              >
                {EN_GALLERY.title}
              </h2>
              <div className="mx-auto mt-2 flex w-44 items-center justify-center gap-2">
                <span className="h-px flex-1 bg-[linear-gradient(90deg,transparent,rgba(255,231,202,0.8))]" />
                <span className="h-1.5 w-1.5 rotate-45 border border-[#ffe1c4]/80 bg-[#f4c89d]/65 shadow-[0_0_12px_rgba(244,200,157,0.7)]" />
                <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,231,202,0.8),transparent)]" />
              </div>
              <p
                data-cinematic-line
                className="mx-auto mt-2.5 px-2 text-center text-[0.78rem] leading-relaxed text-[#fff4e8]/96 animate-drift"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  textShadow: "0 2px 8px rgba(0,0,0,0.88)",
                }}
              >
                {EN_GALLERY.intro}
              </p>
            </div>
          </header>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {displayGalleryItems.slice(0, 2).map(({ src, index }) => (
              <button
                key={`gallery-top-${index}-${src.slice(0, 28)}`}
                type="button"
                className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-[#f8dcc0]/38 text-left shadow-[0_12px_26px_rgba(0,0,0,0.34)]"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open photo ${index + 1}`}
              >
                {isPublicStaticImage(src) ? (
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 44vw, 180px"
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
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(34,9,16,0.5)_0%,transparent_70%)]" />
              </button>
            ))}
          </div>

          <div className="mt-2.5">
            <div className="group relative overflow-hidden rounded-[1.45rem] border border-[#f8dcc0]/65 bg-black/65 text-left shadow-[0_24px_58px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08),0_0_36px_rgba(244,200,157,0.16)]">
              <div className="relative aspect-video w-full">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-contain"
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                >
                  {/* 1. Prioritaskan MP4 dari CDN karena Safari/iOS sangat rewel dengan format WebM */}
                  <source src={DEFAULT_GALLERY_VIDEO_URL.replace(".webm", ".mp4")} type="video/mp4" />
                  
                  {/* 2. WebM dari CDN untuk Chrome/Android/Firefox yang mendukungnya dengan baik */}
                  <source src={DEFAULT_GALLERY_VIDEO_URL} type="video/webm" />

                  {/* 3. Fallback ke file lokal jika CDN bermasalah */}
                  <source src="/assets/video/video.webm" type="video/webm" />
                  
                  Maaf, browser Anda tidak mendukung pemutaran video.
                </video>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(34,9,16,0.48)_0%,rgba(34,9,16,0.08)_45%,transparent_78%)]" />
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {displayGalleryItems.slice(2).map(({ src, index }) => {
              return (
              <button
                key={`gallery-bottom-${index}-${src.slice(0, 28)}`}
                type="button"
                className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-[#f8dcc0]/38 text-left shadow-[0_12px_26px_rgba(0,0,0,0.34)]"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open photo ${index + 1}`}
              >
                {isPublicStaticImage(src) ? (
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 29vw, 130px"
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
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(34,9,16,0.5)_0%,transparent_70%)]" />
              </button>
              );
            })}
          </div>

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
