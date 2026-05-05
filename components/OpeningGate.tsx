"use client";

import Image from "next/image";
import { BookOpen, Home, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CinematicScrollContainer, type SlideConfig } from "./CinematicScroll";
import { createCoupleStorySlide } from "./CoupleStorySection";
import { createCoupleDetailSlide } from "./CoupleDetailSection";
import { createDresscodeSlide } from "./DresscodeSection";
import { createEventDateSlide } from "./EventDateSection";
import { createEventLocationSlide } from "./EventLocationSection";
import { createGallerySlide } from "./GallerySection";
import { createGiftSlide } from "./GiftSection";
import { createClosingSlide } from "./ClosingSection";
import { createRsvpSlide } from "./RsvpForm";

import type { TEventScheduleBlock } from "@/lib/types/event.types";
import type { TInvitationKind } from "@/lib/types/guest.types";
import {
  CDN_AMPL_CLOSED,
  CDN_AMPL_OPEN,
  CDN_AYAT_FRAME,
} from "@/lib/critical-invite-assets";

type TOpeningGateProps = {
  guestName: string;
  coupleHeading: string;
  akad: TEventScheduleBlock;
  resepsi: TEventScheduleBlock;
  showAkad: boolean;
  showResepsi: boolean;
  slug: string;
  invitationKind: TInvitationKind;
  initialRsvpRaw: string;
  galleryImagePaths: string[];
  children: React.ReactNode;
};

type TOpeningPhase = "closed" | "couple" | "opened";

export function OpeningGate({
  guestName,
  coupleHeading,
  akad,
  resepsi,
  showAkad,
  showResepsi,
  slug,
  invitationKind,
  initialRsvpRaw,
  galleryImagePaths,
  children,
}: TOpeningGateProps) {
  const [phase, setPhase] = useState<TOpeningPhase>("closed");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [musicMuted, setMusicMuted] = useState(true);

  const isOpen = phase === "opened";

  const guideTimerRef = useRef<number | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const restartGuideTimer = useCallback(() => {
    setShowGuide(false);
    if (guideTimerRef.current) window.clearTimeout(guideTimerRef.current);
    if (!isOpen) {
      guideTimerRef.current = window.setTimeout(() => {
        setShowGuide(true);
      }, 5000);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (guideTimerRef.current) window.clearTimeout(guideTimerRef.current);
    };
  }, []);

  const pauseMusic = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  }, []);

  const playMusic = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0.85;
    // Try audible autoplay first. If blocked by browser policy, fallback to muted.
    el.muted = false;
    try {
      await el.play();
      setMusicMuted(false);
      return;
    } catch {
      el.muted = true;
      setMusicMuted(true);
      void el.play().catch(() => {});
    }
  }, []);

  const toggleMusicMute = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const nextMuted = !musicMuted;
    el.volume = 0.85;
    el.muted = nextMuted;
    setMusicMuted(nextMuted);

    if (!nextMuted) {
      void el.play().catch(() => {
        el.muted = true;
        setMusicMuted(true);
      });
    }
  }, [musicMuted]);

  const handleBackToOpening = useCallback(() => {
    pauseMusic();
    setPhase("closed");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [pauseMusic, reduceMotion]);

  const handleComplete = useCallback(() => {
    setPhase("opened");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    void playMusic();
  }, [isOpen, playMusic]);

  // ─── SLIDE DEFINITIONS ───
  // Each slide: refCount, exitOrder, enterOrder, render
  // Ref indices are arbitrary per-slide; just need to be consistent.

  const slides = useMemo<SlideConfig[]>(() => [
    // ── SLIDE 0: Closed Envelope ──
    {
      id: "closed",
      refCount: 4, // 0=caption, 1=envelope(FRAME), 2=flower1, 3=flower2
      exitOrder: [
        { refIndex: 2, type: "flower" },
        { refIndex: 3, type: "flower" },
        { refIndex: 0, type: "content" },
        { refIndex: 1, type: "frame" },
      ],
      enterOrder: [
        { refIndex: 1, type: "frame" },
        { refIndex: 2, type: "flower" },
        { refIndex: 3, type: "flower" },
        { refIndex: 0, type: "content" },
      ],
      render: (refs) => (
        <>
          {/* Caption */}
          <div ref={refs[0]} className="absolute inset-0 z-10 flex flex-col items-center pt-[6vh]">
            <div className="relative inline-block animate-float">
              <div data-cinematic-line className="relative inline-block">
                <p
                  className="text-[length:10cqw] text-white drop-shadow-md relative z-10"
                  style={{ fontFamily: "'Brittany Signature', serif", lineHeight: 1.3 }}
                >
                  Hi, <br />
                  <span className="relative inline-block mt-3 px-2">
                    <span
                      className="absolute -inset-x-6 bottom-[18%] top-[42%] -z-10 -rotate-2 rounded-sm"
                      style={{
                        background: "linear-gradient(to right, transparent 0%, rgba(128, 0, 32, 0.6) 5%, rgba(128, 0, 32, 0.7) 50%, rgba(128, 0, 32, 0.6) 95%, transparent 100%)",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                    <span className="relative z-10 text-[length:12.5cqw] text-white drop-shadow-md animate-sway">{guestName}</span>
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-2 mx-auto inline-block relative px-10 py-4">
              <div className="flex flex-col items-center justify-center space-y-1 relative z-10 mt-6">
                <p
                  data-cinematic-line
                  className="text-[length:4cqw] font-bold uppercase tracking-normal text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] animate-glow-text"
                  style={{ fontFamily: "serif" }}
                >
                  You&apos;re Invited
                </p>
                <div className="h-[1px] w-24 bg-white/30 my-1" />
                <p
                  data-cinematic-line
                  className="text-[length:3cqw] font-medium uppercase tracking-wide text-white/90 animate-drift"
                  style={{ fontFamily: "serif" }}
                >
                  To Our Wedding
                </p>
              </div>
            </div>
          </div>

          {/* Closed Envelope — statis, kurangi beban animasi di mobile Safari */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center">
            <div ref={refs[1]} className="relative mx-auto w-[90%] origin-bottom scale-110">
              <Image
                src={CDN_AMPL_CLOSED}
                alt=""
                width={828}
                height={748}
                sizes="90vw"
                className="h-auto w-full drop-shadow-[0_28px_40px_rgba(16,24,40,0.36)]"
                priority
              />
              <div ref={refs[2]} className="absolute bottom-[20%] left-[12%] z-10 aspect-square w-[48%] -translate-x-1/4 md:w-[42%]">
                <Image
                  src="/assets/opening/flower-1.webp"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 44vw, 260px"
                  className="object-contain animate-zoom-in-out"
                  loading="lazy"
                />
              </div>
              <div ref={refs[3]} className="absolute right-[12%] top-[20%] z-10 aspect-square w-[48%] translate-x-1/4 md:w-[42%]">
                <Image
                  src="/assets/opening/flower-2.webp"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 44vw, 260px"
                  className="object-contain animate-zoom-in-out-delayed"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </>
      ),
    },

    // ── SLIDE 1: Open Envelope ──
    {
      id: "open",
      refCount: 4, // 0=envelope(FRAME), 1=coupleNames, 2=flower1, 3=flower2
      exitOrder: [
        { refIndex: 2, type: "flower" },
        { refIndex: 3, type: "flower" },
        { refIndex: 1, type: "content" },
        { refIndex: 0, type: "frame" },
      ],
      enterOrder: [
        { refIndex: 0, type: "frame" },
        { refIndex: 2, type: "flower" },
        { refIndex: 3, type: "flower" },
        { refIndex: 1, type: "content" },
      ],
      render: (refs) => (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
          <div ref={refs[0]} className="relative mx-auto w-[95%] origin-center scale-[1.15]">
            <Image
              src={CDN_AMPL_OPEN}
              alt="Open invitation"
              width={828}
              height={1124}
              sizes="95vw"
              className="h-auto w-full drop-shadow-[0_30px_42px_rgba(16,24,40,0.4)]"
              priority
            />
            <div ref={refs[1]} className="absolute inset-x-0 top-[20%] z-20 flex items-center justify-center px-4">
              <div className="flex flex-col items-center justify-center w-full">
                <h2
                  className="flex flex-col items-center justify-center text-[length:8.4cqw] text-[#184234]"
                  style={{
                    fontFamily: "'Brittany Signature', serif",
                    lineHeight: 1.05,
                    textShadow:
                      "0 1px 0 rgba(255,255,255,0.82), 0 10px 20px rgba(24,66,52,0.18)",
                  }}
                >
                  {coupleHeading.includes("&") ? (
                    <>
                      <span data-cinematic-line className="pb-1">
                        <motion.span
                          className="inline-block text-[#184234] drop-shadow-[0_6px_14px_rgba(24,66,52,0.18)] will-change-transform"
                          animate={{ x: reduceMotion ? 0 : [-2, 2, -2] }}
                          transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {coupleHeading.split("&")[0].trim()}
                        </motion.span>
                      </span>
                      <span
                        data-cinematic-line
                        className="mb-[2cqw] mt-[3cqw] flex items-center justify-center text-[length:5.4cqw] text-[#8a2436] drop-shadow-[0_5px_12px_rgba(138,36,54,0.18)]"
                        style={{
                          fontFamily: "var(--font-cormorant), serif",
                          fontStyle: "italic",
                          lineHeight: 0.75,
                          textShadow: "0 1px 0 rgba(255,255,255,0.72)",
                        }}
                      >
                        &amp;
                      </span>
                      <span data-cinematic-line className="pt-1">
                        <motion.span
                          className="inline-block text-[#184234] drop-shadow-[0_6px_14px_rgba(24,66,52,0.18)] will-change-transform"
                          animate={{ x: reduceMotion ? 0 : [2, -2, 2] }}
                          transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          {coupleHeading.split("&")[1].trim()}
                        </motion.span>
                      </span>
                    </>
                  ) : (
                    <span
                      data-cinematic-line
                      className="text-[#184234]"
                    >
                      {coupleHeading}
                    </span>
                  )}
                </h2>
              </div>
            </div>
            <div ref={refs[2]} className="absolute bottom-[8%] left-[10%] z-10 aspect-square w-[48%] -translate-x-1/4 md:w-[42%] origin-center">
              <Image
                src="/assets/opening/flower-1.webp"
                alt=""
                fill
                sizes="(max-width: 768px) 44vw, 260px"
                className="object-contain animate-zoom-in-out"
                loading="lazy"
              />
            </div>
            <div ref={refs[3]} className="absolute right-[6%] top-[31%] z-10 aspect-square w-[48%] translate-x-1/4 md:w-[42%] origin-center">
              <Image
                src="/assets/opening/flower-2.webp"
                alt=""
                fill
                sizes="(max-width: 768px) 44vw, 260px"
                className="object-contain animate-zoom-in-out-delayed"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      ),
    },

    // ── SLIDE 2: Ayat ──
    {
      id: "ayat",
      refCount: 3, // 0=ayatContent(FRAME), 1=flower1, 2=flower2
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
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
          <div
            ref={refs[0]}
            className="relative origin-center"
            style={{
              width: "130%",
              marginLeft: "-15%",
              marginRight: "-15%",
              marginTop: "-16%",
              marginBottom: "-16%",
            }}
          >
            <Image
              src={CDN_AYAT_FRAME}
              alt="Frame Ayat"
              width={4062}
              height={6249}
              sizes="130vw"
              className="h-auto w-full drop-shadow-[0_28px_55px_rgba(28,8,14,0.34)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-[25%] pb-[28%] pt-[24%] text-center">
              <div
                data-cinematic-line
                className="mb-[1.2cqw] flex h-[6.2cqw] w-[6.2cqw] items-center justify-center rounded-full border border-[#8a2436]/24 bg-[#fff7ef]/46 text-[#8a2436] shadow-[0_8px_18px_rgba(111,29,45,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]"
                aria-hidden
              >
                <BookOpen className="h-[3.2cqw] w-[3.2cqw]" strokeWidth={1.65} />
              </div>
              <p
                data-cinematic-line
                className="relative z-20 mb-[1.4cqw] text-[length:2.35cqw] font-bold uppercase tracking-[0.34em] text-[#8a2436]"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  textShadow: "0 1px 0 rgba(255,255,255,0.74)",
                }}
              >
                QS. Az-Zariyat: 49
              </p>
              <div
                data-cinematic-line
                className="mb-[1.8cqw] h-px w-[22cqw] bg-[linear-gradient(90deg,transparent,rgba(138,36,54,0.68),transparent)]"
                aria-hidden
              />
              <p
                data-cinematic-line
                className="mb-[2.6cqw] text-[length:5.25cqw] font-semibold leading-[1.45] text-[#6f1d2d]"
                style={{
                  fontFamily: "'Traditional Arabic', 'Amiri', serif",
                  direction: "rtl",
                  textShadow: "0 1px 0 rgba(255,255,255,0.8), 0 8px 18px rgba(111,29,45,0.12)",
                }}
              >
                وَمِنْ كُلِّ شَيْءٍ
                <br />
                خَلَقْنَا زَوْجَيْنِ
              </p>
              <p
                data-cinematic-line
                className="mb-[1cqw] text-[length:3.15cqw] font-medium italic leading-[1.45] tracking-[0.03em] text-[#7b2332]"
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  textShadow: "0 1px 0 rgba(255,255,255,0.76)",
                }}
              >
                &ldquo;And of all things We created pairs, <br /> that you may remember.&rdquo;
              </p>
            </div>
            <div
              ref={refs[1]}
              className="absolute z-10 pointer-events-none"
              style={{ top: "10%", left: "-12%", width: "75%", aspectRatio: "1" }}
            >
              <Image
                src="/assets/flowers/bunga-ayat.webp"
                alt=""
                fill
                sizes="75vw"
                className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out"
              />
            </div>
            <div
              ref={refs[2]}
              className="absolute z-10 pointer-events-none"
              style={{ bottom: "12%", right: "-16%", width: "75%", aspectRatio: "1" }}
            >
              <Image
                src="/assets/flowers/bunga-ayat.webp"
                alt=""
                fill
                sizes="75vw"
                className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out-delayed"
              />
            </div>
          </div>
        </div>
      ),
    },

    // ── SLIDE 3: Couple Story ──
    createCoupleStorySlide(),

    // ── SLIDE 4: Couple Details ──
    createCoupleDetailSlide(),

    // ── SLIDE 5: Event Date ──
    createEventDateSlide(),

    // ── SLIDE 6: Event Location ──
    createEventLocationSlide(akad, resepsi, showAkad, showResepsi),

    // ── SLIDE 7: Dresscode (tanpa frame PNG — kartu di atas bg cinematic) ──
    createDresscodeSlide(),

    // ── SLIDE 8: RSVP ──
    createRsvpSlide({ slug, invitationKind, initialRsvpRaw }),

    // ── SLIDE 9: Gallery (masuk di dalam cinematic flow) ──
    createGallerySlide({ imagePaths: galleryImagePaths }),

    // ── SLIDE 10: Gift (masuk di dalam cinematic flow) ──
    createGiftSlide(),

    // ── SLIDE 11: Closing ──
    createClosingSlide({ coupleHeading, guestName }),
  ], [
    guestName,
    coupleHeading,
    akad,
    resepsi,
    showAkad,
    showResepsi,
    slug,
    invitationKind,
    initialRsvpRaw,
    galleryImagePaths,
    reduceMotion,
  ]);


  // ─── Scroll Guide ───
  const scrollGuideEl = useMemo(() => (
    <AnimatePresence>
      {showGuide && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-[6vh] z-40 flex flex-col items-center pointer-events-none"
        >
          <motion.div
            animate={{ y: [6, -6], opacity: [0.15, 0.9, 0.15] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <path d="M12 11V4c0-1.1-.9-2-2-2s-2 .9-2 2v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 11h2.5a2.5 2.5 0 0 1 2.5 2.5v3.5a4.5 4.5 0 0 1-4.5 4.5h-2.5a4.5 4.5 0 0 1-4.5-4.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <span className="text-white/90 text-[10px] font-medium tracking-[0.2em] uppercase mt-2 drop-shadow-md">Scroll</span>
        </motion.div>
      )}
    </AnimatePresence>
  ), [showGuide]);

  return (
    <>
      <audio ref={audioRef} loop playsInline preload="auto" muted={musicMuted} className="hidden">
        <source src="https://res.cloudinary.com/dg4xtvqwc/video/upload/v1777858107/soft_itp0ot.webm" type="audio/webm" />
        <source src="/assets/musics/soft.webm" type="audio/webm" />
        <source src="/assets/musics/soft.mp3" type="audio/mpeg" />
      </audio>

      {/* Main content (visible after opening) */}
      <main
        className={[
          "min-h-screen w-full space-y-0 p-0 font-sans text-sm",
          "text-[var(--inv-ink)]",
          isOpen ? "block opacity-100" : "hidden opacity-0",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
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
      </main>

      {/* Music & Home FAB */}
      <div className="fixed bottom-24 right-5 z-[60] flex flex-col gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.button
              key="home-btn"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              type="button"
              onClick={handleBackToOpening}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--inv-primary)]/20 bg-[#fbfbfa]/80 text-[var(--inv-primary)] shadow-sm backdrop-blur-sm transition active:scale-95"
              aria-label="Back to opening"
            >
              <Home className="h-5 w-5" strokeWidth={2} aria-hidden />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggleMusicMute}
          animate={musicMuted ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={musicMuted ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
          className={[
            "group relative flex min-w-11 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition active:scale-95",
            musicMuted
              ? "h-14 border-[#ffe4c7]/90 bg-[linear-gradient(135deg,#7b2332_0%,#9b2d42_100%)] px-4 text-[#fff7e8] shadow-[0_0_0_2px_rgba(255,228,199,0.35),0_0_40px_rgba(155,45,66,0.7)]"
              : "h-12 border-[#cfe6db]/80 bg-[linear-gradient(135deg,#f7fffb_0%,#e8f8f0_100%)] px-3.5 text-[#1d4f3f] shadow-[0_0_0_1px_rgba(207,230,219,0.8),0_0_24px_rgba(36,92,72,0.22)]",
          ].join(" ")}
          aria-label={musicMuted ? "Play music" : "Mute music"}
        >
          {musicMuted ? (
            <>
              <span className="pointer-events-none absolute -inset-2 -z-10 rounded-full border border-[#ffe6cb]/40" />
              <span className="pointer-events-none absolute -inset-3 -z-20 rounded-full bg-[#f4c89d]/35 blur-xl animate-pulse" />
              <span className="pointer-events-none absolute -top-2 right-0 rounded-full border border-[#ffe1c4]/80 bg-[#fff4e8] px-2 py-[2px] text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7b2332] shadow-[0_8px_18px_rgba(0,0,0,0.3)]">
                Tap to Play
              </span>
            </>
          ) : null}
          {musicMuted ? (
            <>
              <VolumeX className="h-5 w-5" strokeWidth={2.3} aria-hidden />
              <span className="ml-2 text-[11px] font-extrabold uppercase tracking-[0.2em]">
                Muted
              </span>
            </>
          ) : (
            <>
              <Volume2 className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-[0.16em]">
                On
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Cinematic scroll overlay */}
      {!isOpen && (
        <CinematicScrollContainer
          slides={slides}
          onComplete={handleComplete}
          onInteraction={restartGuideTimer}
          onFirstScroll={playMusic}
          scrollGuide={scrollGuideEl}
        />
      )}
    </>
  );
}
