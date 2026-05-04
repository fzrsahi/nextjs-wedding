"use client";

import { Home, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CinematicScrollContainer, type SlideConfig } from "./CinematicScroll";
import { createCoupleStorySlide } from "./CoupleStorySection";
import { createCoupleDetailSlide } from "./CoupleDetailSection";
import { createDresscodeSlide } from "./DresscodeSection";
import { createEventDateSlide } from "./EventDateSection";
import { createEventLocationSlide } from "./EventLocationSection";
import { createRsvpSlide } from "./RsvpForm";

import type { TEventScheduleBlock } from "@/lib/types/event.types";
import type { TInvitationKind } from "@/lib/types/guest.types";
import {
  CDN_AMPL_CLOSED,
  CDN_AMPL_OPEN,
  CDN_AYAT_FRAME,
  FALLBACK_AMPL_CLOSED,
  FALLBACK_AMPL_OPEN,
  FALLBACK_AYAT_FRAME,
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
  children,
}: TOpeningGateProps) {
  const [phase, setPhase] = useState<TOpeningPhase>("closed");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [musicMuted, setMusicMuted] = useState(false);

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
  }, []);

  useEffect(() => {
    playMusic();
  }, [playMusic]);

  const handleBackToOpening = useCallback(() => {
    pauseMusic();
    setPhase("closed");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [pauseMusic, reduceMotion]);

  const handleComplete = useCallback(() => {
    setPhase("opened");
    window.scrollTo(0, 0);
  }, []);

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

          {/* Closed Envelope — ref pada node yang pakai animate-float supaya GSAP tidak berlawanan dengan keyframes */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center">
            <div ref={refs[1]} className="relative mx-auto w-[90%] origin-bottom scale-110 animate-float">
              <img
                src={CDN_AMPL_CLOSED}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_AMPL_CLOSED;
                }}
                className="h-auto w-full drop-shadow-[0_28px_40px_rgba(16,24,40,0.36)] animate-breathe-deep"
              />
              <div ref={refs[2]} className="absolute bottom-[22%] left-[14%] z-10 aspect-square w-[35%] -translate-x-1/4 md:w-[30%]">
                <img 
                  src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857769/flower-1_lyminu.png" 
                  alt="" 
                  onError={(e) => { e.currentTarget.src = "/assets/opening/flower-1.png"; }}
                  className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out" 
                />
              </div>
              <div ref={refs[3]} className="absolute right-[14%] top-[24%] z-10 aspect-square w-[35%] translate-x-1/4 md:w-[30%]">
                <img 
                  src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857841/flower-2_nwx2ki.png" 
                  alt="" 
                  onError={(e) => { e.currentTarget.src = "/assets/opening/flower-2.png"; }}
                  className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out-delayed" 
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
          <div ref={refs[0]} className="relative mx-auto w-[95%] origin-center scale-[1.15] animate-float">
            <img
              src={CDN_AMPL_OPEN}
              alt="Open invitation"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AMPL_OPEN;
              }}
              className="h-auto w-full drop-shadow-[0_30px_42px_rgba(16,24,40,0.4)] animate-breathe-deep"
            />
            <div ref={refs[1]} className="absolute inset-x-0 top-[20%] z-20 flex items-center justify-center px-4">
              <div className="flex flex-col items-center justify-center w-full">
                <h2
                  className="text-[length:7.5cqw] text-[#2b2b2b] flex flex-col items-center justify-center animate-sway"
                  style={{ fontFamily: "'Brittany Signature', serif", lineHeight: 1.1 }}
                >
                  {coupleHeading.includes("&") ? (
                    <>
                      <span data-cinematic-line className="pb-1">{coupleHeading.split("&")[0].trim()}</span>
                      <span data-cinematic-line className="text-[length:4.5cqw] py-1">&amp;</span>
                      <span data-cinematic-line className="pt-1">{coupleHeading.split("&")[1].trim()}</span>
                    </>
                  ) : (
                    <span data-cinematic-line>{coupleHeading}</span>
                  )}
                </h2>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ delay: 1.8, duration: 1 }}
                  className="mt-6 w-32"
                >
                  <svg viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path d="M0 10H50M70 10H120" stroke="#2b2b2b" strokeWidth="0.5" strokeLinecap="round" />
                    <path d="M54 10L60 4L66 10L60 16L54 10Z" stroke="#2b2b2b" strokeWidth="0.5" />
                    <circle cx="60" cy="10" r="1.2" fill="#2b2b2b" />
                  </svg>
                </motion.div>
              </div>
            </div>
            <div ref={refs[2]} className="absolute left-[14%] top-[45%] z-10 aspect-square w-[35%] -translate-x-1/4 -translate-y-1/2 md:w-[30%] origin-center">
              <img 
                src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857769/flower-1_lyminu.png" 
                alt="" 
                onError={(e) => { e.currentTarget.src = "/assets/opening/flower-1.png"; }}
                className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out" 
              />
            </div>
            <div ref={refs[3]} className="absolute bottom-[20%] right-[14%] z-10 aspect-square w-[35%] translate-x-1/4 md:w-[30%] origin-center">
              <img 
                src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857841/flower-2_nwx2ki.png" 
                alt="" 
                onError={(e) => { e.currentTarget.src = "/assets/opening/flower-2.png"; }}
                className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out-delayed" 
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
          <div ref={refs[0]} className="relative mx-auto w-[75%] origin-center animate-float">
            <img
              src={CDN_AYAT_FRAME}
              alt="Frame Ayat"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_AYAT_FRAME;
              }}
              className="h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
              <p
                data-cinematic-line
                className="text-[length:2.8cqw] font-bold text-[#2b2b2b] uppercase mb-2 tracking-[0.3em] opacity-80 animate-glow-text"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                QS. Az-Zariyat: 49
              </p>
              <p
                data-cinematic-line
                className="text-[length:5.5cqw] text-[#2b2b2b] mb-5 leading-relaxed animate-sway"
                style={{ fontFamily: "'Traditional Arabic', serif", direction: "rtl" }}
              >
                وَمِنْ كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ
              </p>
              <p
                data-cinematic-line
                className="text-[length:3.2cqw] text-[#4a4a4a] italic mb-3 leading-relaxed tracking-wide animate-drift"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                &ldquo;And of all things We created pairs, <br /> that you may remember.&rdquo;
              </p>
            </div>
            <div ref={refs[1]} className="absolute -left-[35%] -top-[25%] z-10 aspect-square w-[110%] origin-center pointer-events-none">
              <img 
                src="https://res.cloudinary.com/dg4xtvqwc/image/upload/f_auto,q_auto:good/v1777857790/bunga-ayat_jhrwpf.png" 
                alt="" 
                onError={(e) => { e.currentTarget.src = "/assets/flowers/bunga-ayat.png"; }}
                className="absolute inset-0 h-full w-full object-contain animate-zoom-in-out" 
              />
            </div>
            <div ref={refs[2]} className="absolute -right-[35%] -bottom-[25%] z-10 aspect-square w-[110%] origin-center pointer-events-none">
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
            animate={{ y: [15, -15], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
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
      <audio ref={audioRef} loop playsInline preload="auto" className="hidden">
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
      <div className="fixed bottom-6 right-5 z-[60] flex flex-col gap-3">
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

        <button
          type="button"
          onClick={toggleMusicMute}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--inv-primary)]/20 bg-[#fbfbfa]/80 text-[var(--inv-primary)] shadow-sm backdrop-blur-sm transition active:scale-95"
          aria-label={musicMuted ? "Unmute music" : "Mute music"}
        >
          {musicMuted ? (
            <VolumeX className="h-5 w-5" strokeWidth={2} aria-hidden />
          ) : (
            <Volume2 className="h-5 w-5" strokeWidth={2} aria-hidden />
          )}
        </button>
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
