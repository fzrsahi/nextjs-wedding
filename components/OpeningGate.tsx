"use client";

import Image from "next/image";
import { EllipsisVertical, Home, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type TOpeningGateProps = {
  guestName: string;
  coupleHeading: string;
  children: React.ReactNode;
};

const GALLERY_IMAGES = [
  "/assets/gallery/1.jpeg",
  "/assets/gallery/2.jpeg",
  "/assets/gallery/3.jpeg",
  "/assets/gallery/4.jpeg",
  "/assets/gallery/5.jpeg",
  "/assets/opening/foto-berdua.jpeg",
  "/assets/opening/foto-berdua-2.jpeg",
  "/assets/visual-blessing/man.jpeg",
  "/assets/visual-blessing/woman.jpeg",
] as const;

/** Setelah amplop terbuka tampil, tunggu dulu sebelum foto satelit mulai (ms). */
const GALLERY_PAUSE_BEFORE_PHOTOS_MS = 1600;
const GALLERY_PAUSE_BEFORE_PHOTOS_REDUCED_MS = 320;
/** Jeda antar tiap foto satelit — pelan. */
const GALLERY_STAGGER_BETWEEN_PHOTOS_MS = 720;
const GALLERY_STAGGER_BETWEEN_PHOTOS_REDUCED_MS = 100;
const GALLERY_HOLD_AFTER_LAST_MS = 800;
const GALLERY_HOLD_AFTER_LAST_MS_REDUCED = 200;

/** Foto satelit lebih besar; % relatif ke kotak — di bawah layer amplop terbuka */
const GALLERY_SATELLITES = [
  { top: "-4%", left: "-8%", w: "42%", rot: -5 },
  { top: "-2%", left: "62%", w: "44%", rot: 6 },
  { top: "30%", left: "-12%", w: "40%", rot: -4 },
  { top: "28%", left: "68%", w: "40%", rot: 5 },
  { top: "58%", left: "-10%", w: "42%", rot: -3 },
  { top: "60%", left: "64%", w: "42%", rot: 5 },
  { top: "14%", left: "28%", w: "38%", rot: 2 },
  { top: "46%", left: "30%", w: "38%", rot: -2 },
  { top: "4%", left: "34%", w: "36%", rot: 0 },
] as const;

const FLOWERS = [
  { src: "/assets/flowers/29.png", size: 84, left: "-2%", top: "-7%", delay: 0, rotate: -10 },
  { src: "/assets/flowers/24.png", size: 78, left: "8%", top: "-9%", delay: 0.03, rotate: -6 },
  { src: "/assets/flowers/31.png", size: 86, left: "19%", top: "-8%", delay: 0.06, rotate: -4 },
  { src: "/assets/flowers/25.png", size: 80, left: "31%", top: "-9%", delay: 0.09, rotate: -2 },
  { src: "/assets/flowers/28.png", size: 92, left: "43%", top: "-8%", delay: 0.12, rotate: 0 },
  { src: "/assets/flowers/21.png", size: 98, left: "56%", top: "-9%", delay: 0.15, rotate: 3 },
  { src: "/assets/flowers/22.png", size: 90, left: "69%", top: "-8%", delay: 0.18, rotate: 6 },
  { src: "/assets/flowers/30.png", size: 86, left: "82%", top: "-9%", delay: 0.21, rotate: 10 },
  { src: "/assets/flowers/17.png", size: 108, left: "-13%", top: "5%", delay: 0.24, rotate: -14 },
  { src: "/assets/flowers/24.png", size: 78, left: "0%", top: "12%", delay: 0.27, rotate: -10 },
  { src: "/assets/flowers/28.png", size: 116, left: "-14%", top: "20%", delay: 0.3, rotate: -10 },
  { src: "/assets/flowers/25.png", size: 78, left: "0%", top: "28%", delay: 0.33, rotate: -8 },
  { src: "/assets/flowers/21.png", size: 124, left: "-13%", top: "37%", delay: 0.36, rotate: -8 },
  { src: "/assets/flowers/18.png", size: 74, left: "1%", top: "45%", delay: 0.39, rotate: -6 },
  { src: "/assets/flowers/26.png", size: 110, left: "-12%", top: "54%", delay: 0.42, rotate: -7 },
  { src: "/assets/flowers/22.png", size: 82, left: "0%", top: "63%", delay: 0.45, rotate: -5 },
  { src: "/assets/flowers/30.png", size: 110, left: "-11%", top: "72%", delay: 0.48, rotate: -7 },
  { src: "/assets/flowers/31.png", size: 84, left: "1%", top: "80%", delay: 0.51, rotate: -4 },
  { src: "/assets/flowers/18.png", size: 108, left: "87%", top: "5%", delay: 0.26, rotate: 14 },
  { src: "/assets/flowers/29.png", size: 78, left: "95%", top: "12%", delay: 0.29, rotate: 10 },
  { src: "/assets/flowers/32.png", size: 116, left: "88%", top: "20%", delay: 0.32, rotate: 10 },
  { src: "/assets/flowers/31.png", size: 78, left: "95%", top: "28%", delay: 0.35, rotate: 8 },
  { src: "/assets/flowers/22.png", size: 124, left: "87%", top: "37%", delay: 0.38, rotate: 8 },
  { src: "/assets/flowers/28.png", size: 74, left: "78%", top: "45%", delay: 0.41, rotate: 6 },
  { src: "/assets/flowers/21.png", size: 110, left: "88%", top: "54%", delay: 0.44, rotate: 7 },
  { src: "/assets/flowers/25.png", size: 82, left: "79%", top: "63%", delay: 0.47, rotate: 5 },
  { src: "/assets/flowers/26.png", size: 110, left: "87%", top: "72%", delay: 0.5, rotate: 7 },
  { src: "/assets/flowers/17.png", size: 84, left: "79%", top: "80%", delay: 0.53, rotate: 6 },
  { src: "/assets/flowers/24.png", size: 84, left: "-1%", top: "88%", delay: 0.56, rotate: -8 },
  { src: "/assets/flowers/31.png", size: 78, left: "11%", top: "90%", delay: 0.59, rotate: -6 },
  { src: "/assets/flowers/25.png", size: 84, left: "24%", top: "89%", delay: 0.62, rotate: -3 },
  { src: "/assets/flowers/28.png", size: 94, left: "38%", top: "90%", delay: 0.65, rotate: -1 },
  { src: "/assets/flowers/21.png", size: 98, left: "52%", top: "89%", delay: 0.68, rotate: 2 },
  { src: "/assets/flowers/22.png", size: 90, left: "66%", top: "90%", delay: 0.71, rotate: 5 },
  { src: "/assets/flowers/30.png", size: 86, left: "79%", top: "89%", delay: 0.74, rotate: 8 },
  { src: "/assets/flowers/29.png", size: 82, left: "91%", top: "88%", delay: 0.77, rotate: 10 },
] as const;

type TOpeningPhase = "closed" | "galleryReveal" | "couple" | "opened";

export function OpeningGate({
  guestName,
  coupleHeading,
  children,
}: TOpeningGateProps) {
  const [phase, setPhase] = useState<TOpeningPhase>("closed");
  const backFabTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  const isOpen = phase === "opened";
  const [galleryVisibleCount, setGalleryVisibleCount] = useState(0);

  const goToCoupleAfterGallery = useCallback(() => {
    setPhase("couple");
  }, []);

  useEffect(() => {
    return () => {
      if (backFabTimerRef.current) {
        window.clearTimeout(backFabTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsFabExpanded(false);
      if (backFabTimerRef.current) {
        window.clearTimeout(backFabTimerRef.current);
      }
    }
  }, [isOpen]);

  const scheduleFabCollapse = useCallback(() => {
    if (backFabTimerRef.current) {
      window.clearTimeout(backFabTimerRef.current);
    }
    backFabTimerRef.current = window.setTimeout(() => {
      setIsFabExpanded(false);
    }, 2800);
  }, []);

  useEffect(() => {
    if (phase !== "galleryReveal") {
      return;
    }
    setGalleryVisibleCount(0);
    const n = GALLERY_IMAGES.length;
    const pause = reduceMotion
      ? GALLERY_PAUSE_BEFORE_PHOTOS_REDUCED_MS
      : GALLERY_PAUSE_BEFORE_PHOTOS_MS;
    const stagger = reduceMotion
      ? GALLERY_STAGGER_BETWEEN_PHOTOS_REDUCED_MS
      : GALLERY_STAGGER_BETWEEN_PHOTOS_MS;
    const hold = reduceMotion ? GALLERY_HOLD_AFTER_LAST_MS_REDUCED : GALLERY_HOLD_AFTER_LAST_MS;
    const ids: number[] = [];
    for (let k = 1; k <= n; k++) {
      ids.push(
        window.setTimeout(() => setGalleryVisibleCount(k), pause + (k - 1) * stagger),
      );
    }
    const finishAt = pause + (n - 1) * stagger + hold;
    ids.push(
      window.setTimeout(() => {
        goToCoupleAfterGallery();
      }, finishAt),
    );
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, [phase, reduceMotion, goToCoupleAfterGallery]);

  const pauseMusic = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  const playMusic = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.85;
    el.muted = musicMuted;
    void el.play().catch(() => {});
  }, [musicMuted]);

  const toggleMusicMute = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    setMusicMuted(next);
    scheduleFabCollapse();
  }, [scheduleFabCollapse]);

  const handleEnvelopeOpen = () => {
    if (phase !== "closed") return;
    playMusic();
    setPhase("galleryReveal");
  };

  const handleContinueFromCouple = () => {
    if (phase !== "couple") return;
    setPhase("opened");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const handleBackToOpening = useCallback(() => {
    pauseMusic();
    setGalleryVisibleCount(0);
    setPhase("closed");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [pauseMusic, reduceMotion]);

  const openFabMenu = useCallback(() => {
    setIsFabExpanded(true);
    scheduleFabCollapse();
  }, [scheduleFabCollapse]);

  const handleFabHome = useCallback(() => {
    handleBackToOpening();
    setIsFabExpanded(false);
    if (backFabTimerRef.current) {
      window.clearTimeout(backFabTimerRef.current);
    }
  }, [handleBackToOpening]);

  return (
    <>
      <audio ref={audioRef} loop playsInline preload="auto" className="hidden">
        <source src="/assets/musics/soft.webm" type="audio/webm" />
        <source src="/assets/musics/soft.mp3" type="audio/mpeg" />
      </audio>

      <main
        className={[
          "min-h-screen w-full space-y-0 p-0 font-sans text-sm",
          "text-[var(--inv-ink)] transition-opacity duration-500",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        {/*
          Hanya opacity di sini: transform/filter pada parent membuat position:fixed
          (FloralScrollFrame) terkontaminasi ancestor — bunga hilang/terpotong.
        */}
        <motion.div
          initial={false}
          animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.65,
            ease: [0.16, 1, 0.32, 1],
          }}
        >
          {children}
        </motion.div>

        <div className="fixed bottom-5 right-4 z-40 sm:right-6">
          <motion.div
            role="toolbar"
            aria-label="Menu undangan"
            animate={{ width: isFabExpanded ? 120 : 46 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex h-11 items-center overflow-hidden rounded-full border border-[var(--inv-primary)] bg-white/90 shadow-[0_10px_28px_rgba(16,24,40,0.2)] backdrop-blur-md"
          >
            {!isFabExpanded ? (
              <button
                type="button"
                onClick={openFabMenu}
                className="flex h-11 w-[46px] shrink-0 items-center justify-center text-[var(--inv-primary)] transition hover:bg-[var(--inv-primary)]/8"
                aria-label="Buka menu"
                aria-expanded={false}
                aria-haspopup="true"
              >
                <EllipsisVertical className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            ) : (
              <div
                className="flex h-11 w-[120px] items-center justify-center gap-1.5 px-2"
                role="group"
                aria-label="Aksi undangan"
              >
                <button
                  type="button"
                  onClick={handleFabHome}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--inv-primary)] transition hover:bg-[var(--inv-primary)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--inv-primary)]"
                  aria-label="Kembali ke opening"
                >
                  <Home className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={toggleMusicMute}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--inv-primary)] transition hover:bg-[var(--inv-primary)]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--inv-primary)]"
                  aria-label={musicMuted ? "Nyalakan musik" : "Bisukan musik"}
                >
                  {musicMuted ? (
                    <VolumeX className="h-5 w-5" strokeWidth={2} aria-hidden />
                  ) : (
                    <Volume2 className="h-5 w-5" strokeWidth={2} aria-hidden />
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {!isOpen ? (
        <AnimatePresence>
          <motion.section
            aria-label="Opening screen"
            className="fixed inset-0 z-50 overflow-x-hidden overflow-y-auto bg-[var(--inv-surface)] text-[var(--inv-ink)]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.35 } }}
          >
            <div className="pointer-events-none absolute inset-0 bg-white" />

            <div className="pointer-events-none absolute inset-0 z-40 [mask-image:linear-gradient(to_bottom,black_0%,black_74%,transparent_100%)]">
              {FLOWERS.map((flower, idx) => (
                <motion.div
                  key={`${flower.src}-${idx}`}
                  className="absolute"
                  style={{
                    left: flower.left,
                    top: flower.top,
                    width: flower.size,
                    height: flower.size,
                  }}
                  initial={{ opacity: 0, y: 24, rotate: flower.rotate }}
                  animate={
                    reduceMotion
                      ? { opacity: 0.95, y: 0, rotate: flower.rotate }
                      : {
                          opacity: 0.95,
                          y: [0, -10, 0, 6, 0],
                          rotate: [
                            flower.rotate,
                            flower.rotate + 4,
                            flower.rotate - 3,
                            flower.rotate,
                          ],
                          scale: [1, 1.02, 1],
                        }
                  }
                  transition={{
                    opacity: { duration: 0.55, delay: flower.delay },
                    y: {
                      duration: 7.2,
                      delay: flower.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 8.4,
                      delay: flower.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    scale: {
                      duration: 6.2,
                      delay: flower.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <Image
                    src={flower.src}
                    alt=""
                    width={flower.size}
                    height={flower.size}
                    className="object-contain opacity-90 drop-shadow-[0_12px_20px_rgba(16,24,40,0.24)]"
                    aria-hidden
                  />
                </motion.div>
              ))}
            </div>

            <div className="relative z-30 mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-6">
              <AnimatePresence mode="sync">
                <motion.div
                  key="openingFlow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.22 } }}
                  className="flex w-full max-w-md flex-col items-center text-center"
                >
                  {/*
                    Satu node sampai couple: crossfade amplop ↔ frame mempelai di area fixed min-height
                    supaya flex justify-center tidak reflow (efek konten “naik dari bawah”).
                  */}
                  <div className="relative mx-auto w-full min-h-[min(86vh,700px)]">
                    <motion.div
                      className="absolute inset-x-0 top-0 z-10 flex w-full flex-col items-center text-center"
                      initial={false}
                      animate={{ opacity: phase === "couple" ? 0 : 1 }}
                      transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeInOut" }}
                      style={{
                        pointerEvents: phase === "couple" ? "none" : "auto",
                        visibility: phase === "couple" ? "hidden" : "visible",
                      }}
                    >
                    <div className="relative mx-auto w-full max-w-[min(96vw,460px)] overflow-visible">
                      {/*
                        Satu kotak tetap: closed + open ditumpuk, crossfade opacity saja.
                        Tanpa ganti key antar closed ↔ galleryReveal supaya tidak ada lompak layout.
                      */}
                      <div className="relative mx-auto h-[min(56vh,520px)] w-full">
                        <motion.div
                          className="pointer-events-none absolute inset-0 z-0"
                          initial={{ opacity: 0 }}
                          animate={{
                            opacity: phase === "galleryReveal" ? 1 : 0,
                          }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.28,
                            ease: "easeInOut",
                          }}
                        >
                          <Image
                            src="/assets/opening/open.png"
                            alt="Undangan terbuka"
                            fill
                            className="object-contain object-bottom drop-shadow-[0_32px_48px_rgba(16,24,40,0.42)]"
                            priority
                          />
                        </motion.div>

                        {phase === "galleryReveal" &&
                          GALLERY_IMAGES.map((src, i) => {
                          const slot = GALLERY_SATELLITES[i];
                          if (!slot) return null;
                          const visible = i < galleryVisibleCount;
                          if (!visible) return null;
                          return (
                            <motion.div
                              key={src}
                              className="pointer-events-none absolute z-[15]"
                              style={{
                                top: slot.top,
                                left: slot.left,
                                width: slot.w,
                                rotate: `${slot.rot}deg`,
                              }}
                              initial={{
                                opacity: 0,
                                scale: 0.88,
                                filter: "blur(6px)",
                              }}
                              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                              transition={{
                                duration: reduceMotion ? 0 : 0.95,
                                ease: [0.2, 1, 0.34, 1],
                              }}
                            >
                              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-white/70 bg-white/40 shadow-[0_16px_40px_rgba(16,24,40,0.22)]">
                                <Image
                                  src={src}
                                  alt=""
                                  fill
                                  sizes="(max-width: 480px) 42vw, 220px"
                                  className="object-cover object-center"
                                />
                              </div>
                            </motion.div>
                          );
                          })}

                        <motion.button
                          type="button"
                          onClick={handleEnvelopeOpen}
                          aria-label="Buka undangan — ketuk amplop"
                          aria-hidden={phase !== "closed"}
                          disabled={phase !== "closed"}
                          tabIndex={phase === "closed" ? 0 : -1}
                          initial={{ opacity: 1 }}
                          animate={{
                            opacity: phase === "closed" ? 1 : 0,
                          }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.28,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 z-10 mx-auto block h-full w-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--inv-primary)] disabled:cursor-default"
                          style={{
                            pointerEvents: phase === "closed" ? "auto" : "none",
                          }}
                        >
                          <span className="sr-only">Buka undangan</span>
                          <motion.div
                            aria-hidden
                            className="pointer-events-none absolute left-1/2 top-[52%] h-[min(72%,420px)] w-[88%] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_50%_50%,rgb(var(--inv-accent-rgb)/0.38),rgb(var(--inv-primary-rgb)/0.12)_42%,transparent_68%)] blur-3xl"
                            animate={
                              reduceMotion
                                ? { opacity: 0.55 }
                                : { opacity: [0.38, 0.72, 0.38], scale: [1, 1.06, 1] }
                            }
                            transition={{
                              duration: reduceMotion ? 0 : 2.6,
                              repeat: reduceMotion ? 0 : Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <motion.span
                              aria-hidden
                              className="absolute h-36 w-36 rounded-full border-[3px] border-white shadow-[0_0_0_4px_rgb(var(--inv-accent-rgb)/0.35),0_0_52px_20px_rgb(var(--inv-primary-rgb)/0.28),0_0_80px_32px_rgb(var(--inv-accent-rgb)/0.15)]"
                              style={{
                                background:
                                  "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.12) 45%, transparent 62%)",
                              }}
                              animate={
                                reduceMotion
                                  ? { opacity: 0.9, scale: 1 }
                                  : { opacity: [0.72, 1, 0.72], scale: [1, 1.08, 1] }
                              }
                              transition={{
                                duration: reduceMotion ? 0 : 2.1,
                                repeat: reduceMotion ? 0 : Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          </div>
                          <div className="relative z-[2] h-full w-full">
                            <Image
                              src="/assets/opening/closed.png"
                              alt=""
                              fill
                              className="object-contain object-bottom drop-shadow-[0_28px_40px_rgba(16,24,40,0.36)]"
                              priority
                            />
                          </div>
                        </motion.button>
                      </div>
                    </div>
                    <div className="mt-8 w-full px-1">
                      <p className="text-4xl italic text-[var(--inv-primary)]/85 [font-family:serif] sm:text-5xl">
                        {`Hi ${guestName},`}
                      </p>
                      <p className="mt-2 text-sm text-[var(--inv-ink-muted)]">
                        You&apos;ve been invited to our wedding
                      </p>
                    </div>
                    </motion.div>

                    <motion.div
                      className="absolute inset-x-0 top-0 z-20 mx-auto flex w-full max-w-sm flex-col items-center text-center"
                      initial={false}
                      animate={{ opacity: phase === "couple" ? 1 : 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeInOut" }}
                      style={{
                        pointerEvents: phase === "couple" ? "auto" : "none",
                        visibility: phase === "couple" ? "visible" : "hidden",
                      }}
                    >
                    <div className="relative mx-auto mt-1 h-[402px] w-full max-w-[390px]">
                      <motion.div
                        className="absolute inset-x-0 top-3 h-[336px]"
                        initial={false}
                        animate={{ opacity: 1 }}
                        transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeInOut" }}
                      >
                        <div className="absolute inset-0">
                          <div className="pointer-events-none absolute inset-0 z-0">
                            <Image
                              src="/assets/opening/open.png"
                              alt="Amplop undangan terbuka"
                              fill
                              className="object-contain drop-shadow-[0_30px_42px_rgba(16,24,40,0.4)]"
                              priority
                            />
                          </div>
                          <div className="pointer-events-none absolute left-1/2 top-[5.95rem] z-10 h-[172px] w-[194px] -translate-x-1/2">
                            <div aria-hidden className="absolute inset-[-18px] z-20">
                              <motion.div
                                aria-hidden
                                animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [-2, 2, -2] }}
                                transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
                                className="pointer-events-none absolute -left-7 -top-7 h-18 w-18"
                              >
                                <Image
                                  src="/assets/flowers/28.png"
                                  alt=""
                                  fill
                                  className="object-contain drop-shadow-[0_10px_18px_rgba(16,24,40,0.25)]"
                                  aria-hidden
                                />
                              </motion.div>
                              <motion.div
                                aria-hidden
                                animate={reduceMotion ? undefined : { y: [0, 5, 0], rotate: [2, -2, 2] }}
                                transition={{ duration: 7.1, repeat: Infinity, ease: "easeInOut", delay: 0.25 }}
                                className="pointer-events-none absolute -right-7 -top-6 h-18 w-18"
                              >
                                <Image
                                  src="/assets/flowers/32.png"
                                  alt=""
                                  fill
                                  className="object-contain drop-shadow-[0_10px_18px_rgba(16,24,40,0.25)]"
                                  aria-hidden
                                />
                              </motion.div>
                              <motion.div
                                aria-hidden
                                animate={reduceMotion ? undefined : { y: [0, 4, 0], rotate: [-2, 2, -2] }}
                                transition={{ duration: 6.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                                className="pointer-events-none absolute -left-6 -bottom-7 h-18 w-18"
                              >
                                <Image
                                  src="/assets/flowers/21.png"
                                  alt=""
                                  fill
                                  className="object-contain drop-shadow-[0_10px_18px_rgba(16,24,40,0.25)]"
                                  aria-hidden
                                />
                              </motion.div>
                              <motion.div
                                aria-hidden
                                animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [2, -2, 2] }}
                                transition={{ duration: 7.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                className="pointer-events-none absolute -right-6 -bottom-7 h-18 w-18"
                              >
                                <Image
                                  src="/assets/flowers/22.png"
                                  alt=""
                                  fill
                                  className="object-contain drop-shadow-[0_10px_18px_rgba(16,24,40,0.25)]"
                                  aria-hidden
                                />
                              </motion.div>
                              <div className="pointer-events-none absolute left-1/2 -top-8 h-14 w-14 -translate-x-1/2 rotate-6 opacity-95">
                                <Image
                                  src="/assets/flowers/29.png"
                                  alt=""
                                  fill
                                  className="object-contain drop-shadow-[0_10px_18px_rgba(16,24,40,0.22)]"
                                  aria-hidden
                                />
                              </div>
                              <div className="pointer-events-none absolute left-1/2 -bottom-8 h-14 w-14 -translate-x-1/2 -rotate-6 opacity-95">
                                <Image
                                  src="/assets/flowers/24.png"
                                  alt=""
                                  fill
                                  className="object-contain drop-shadow-[0_10px_18px_rgba(16,24,40,0.22)]"
                                  aria-hidden
                                />
                              </div>
                              <div className="pointer-events-none absolute -left-8 top-1/2 h-14 w-14 -translate-y-1/2 -rotate-12 opacity-90">
                                <Image
                                  src="/assets/flowers/31.png"
                                  alt=""
                                  fill
                                  className="object-contain drop-shadow-[0_10px_18px_rgba(16,24,40,0.22)]"
                                  aria-hidden
                                />
                              </div>
                              <div className="pointer-events-none absolute -right-8 top-1/2 h-14 w-14 -translate-y-1/2 rotate-12 opacity-90">
                                <Image
                                  src="/assets/flowers/25.png"
                                  alt=""
                                  fill
                                  className="object-contain drop-shadow-[0_10px_18px_rgba(16,24,40,0.22)]"
                                  aria-hidden
                                />
                              </div>
                              <div className="pointer-events-none absolute inset-0 rounded-[12px] border border-[rgba(255,255,255,0.72)] bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.55),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(255,255,255,0.5),transparent_50%)]" />
                            </div>
                            <div className="relative h-full w-full overflow-hidden rounded-[10px]">
                              <Image
                                src="/assets/opening/foto-berdua-2.jpeg"
                                alt="Foto berdua mempelai"
                                fill
                                sizes="200px"
                                className="object-cover object-center"
                                priority
                              />
                            </div>
                          </div>
                          <div
                            className="pointer-events-none absolute left-1/2 top-[1.35rem] z-50 h-[332px] w-[320px] -translate-x-1/2"
                          >
                              <div
                                aria-hidden
                                className="pointer-events-none absolute inset-x-3 bottom-0 z-0"
                              >
                                <div className="relative aspect-[3/4] w-full">
                                  <div className="absolute inset-[-18px] rounded-[2rem] bg-[radial-gradient(circle_at_35%_16%,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.42)_56%,transparent_78%)]" />
                                  <div className="absolute inset-[-26px] rounded-[2.1rem] bg-[radial-gradient(circle_at_60%_22%,rgb(var(--inv-primary-rgb)/0.16)_0%,rgb(var(--inv-primary-rgb)/0.05)_42%,transparent_72%)] blur-xl" />
                                </div>
                              </div>
                              <div className="absolute inset-x-4 bottom-0 z-10 overflow-hidden rounded-[1.6rem] border border-white/75 bg-white/18 shadow-[0_26px_50px_rgba(16,24,40,0.26)]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.5),transparent_42%),radial-gradient(circle_at_80%_90%,rgb(var(--inv-primary-rgb)/0.12),transparent_58%)]" />
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.6rem]">
                                  <Image
                                    src="/assets/opening/foto-berdua-2.jpeg"
                                    alt="Foto berdua mempelai"
                                    fill
                                    sizes="(max-width: 480px) 78vw, 320px"
                                    className="object-cover object-center"
                                    priority
                                  />
                                </div>
                              </div>
                              <div
                                aria-hidden
                                className="pointer-events-none absolute inset-x-4 bottom-0 z-20"
                              >
                                <div className="relative aspect-[3/4] w-full">
                                  <div className="absolute inset-[-10px] rounded-[1.9rem] border border-white/70" />
                                  <div className="absolute -left-10 -top-10 h-22 w-22">
                                    <Image
                                      src="/assets/flowers/28.png"
                                      alt=""
                                      fill
                                      sizes="96px"
                                      className="object-contain drop-shadow-[0_14px_24px_rgba(16,24,40,0.24)]"
                                      aria-hidden
                                    />
                                  </div>
                                  <div className="absolute -right-10 -top-9 h-22 w-22">
                                    <Image
                                      src="/assets/flowers/32.png"
                                      alt=""
                                      fill
                                      sizes="96px"
                                      className="object-contain drop-shadow-[0_14px_24px_rgba(16,24,40,0.24)]"
                                      aria-hidden
                                    />
                                  </div>
                                  <div className="absolute -left-9 -bottom-11 h-22 w-22">
                                    <Image
                                      src="/assets/flowers/21.png"
                                      alt=""
                                      fill
                                      sizes="96px"
                                      className="object-contain drop-shadow-[0_14px_24px_rgba(16,24,40,0.24)]"
                                      aria-hidden
                                    />
                                  </div>
                                  <div className="absolute -right-9 -bottom-11 h-22 w-22">
                                    <Image
                                      src="/assets/flowers/22.png"
                                      alt=""
                                      fill
                                      sizes="96px"
                                      className="object-contain drop-shadow-[0_14px_24px_rgba(16,24,40,0.24)]"
                                      aria-hidden
                                    />
                                  </div>
                                  <div className="absolute left-1/2 -top-9 h-16 w-16 -translate-x-1/2 opacity-95">
                                    <Image
                                      src="/assets/flowers/29.png"
                                      alt=""
                                      fill
                                      className="object-contain drop-shadow-[0_12px_22px_rgba(16,24,40,0.22)]"
                                      aria-hidden
                                    />
                                  </div>
                                  <div className="absolute left-1/2 -bottom-10 h-16 w-16 -translate-x-1/2 opacity-95">
                                    <Image
                                      src="/assets/flowers/24.png"
                                      alt=""
                                      fill
                                      className="object-contain drop-shadow-[0_12px_22px_rgba(16,24,40,0.22)]"
                                      aria-hidden
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      </motion.div>
                    </div>

                    <div className="relative mt-1 min-h-[5.6rem] w-full">
                      <div className="absolute inset-x-0 top-0">
                        <motion.div
                          aria-hidden
                          initial={{ opacity: 0 }}
                          animate={{ opacity: reduceMotion ? 0.35 : [0.16, 0.42, 0.22] }}
                          transition={{
                            duration: reduceMotion ? 0 : 2.2,
                            repeat: reduceMotion ? 0 : Infinity,
                            ease: "easeInOut",
                          }}
                          className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--inv-primary-rgb)/0.24)_0%,transparent_72%)] blur-lg"
                        />
                        <p className="relative text-5xl italic text-[var(--inv-primary)] [font-family:serif] drop-shadow-[0_8px_22px_rgb(var(--inv-primary-rgb)/0.22)]">
                          {coupleHeading}
                        </p>
                        <p className="mt-2 text-sm text-[var(--inv-ink-muted)]">
                          Please proceed to open your invitation
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleContinueFromCouple}
                      className="mt-3 inline-flex min-w-44 items-center justify-center rounded-full border border-[var(--inv-primary)] bg-white/80 px-6 py-3 text-sm font-medium text-[var(--inv-primary)] transition hover:-translate-y-0.5 hover:bg-[var(--inv-primary)] hover:text-white"
                    >
                      Lanjut ke Undangan
                    </button>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.section>
        </AnimatePresence>
      ) : null}
    </>
  );
}
