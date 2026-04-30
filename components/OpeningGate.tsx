"use client";

import Image from "next/image";
import { EllipsisVertical, Home, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TOpeningGateProps = {
  guestName: string;
  coupleHeading: string;
  children: React.ReactNode;
};

type TOpeningPhase = "closed" | "couple" | "opened";

export function OpeningGate({
  guestName,
  coupleHeading,
  children,
}: TOpeningGateProps) {
  const [phase, setPhase] = useState<TOpeningPhase>("closed");
  const containerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const closedEnvRef = useRef<HTMLDivElement>(null);
  const openEnvRef = useRef<HTMLDivElement>(null);
  const ayatRef = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const bg2Ref = useRef<HTMLDivElement>(null);
  const bg3Ref = useRef<HTMLDivElement>(null);
  const closedFlower1Ref = useRef<HTMLDivElement>(null);
  const closedFlower2Ref = useRef<HTMLDivElement>(null);
  const coupleNamesRef = useRef<HTMLDivElement>(null);
  const flower1Ref = useRef<HTMLDivElement>(null);
  const flower2Ref = useRef<HTMLDivElement>(null);
  const ayatFlower1Ref = useRef<HTMLDivElement>(null);
  const ayatFlower2Ref = useRef<HTMLDivElement>(null);

  const backFabTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduceMotion = useReducedMotion();
  const [isFabExpanded, setIsFabExpanded] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);

  const isOpen = phase === "opened";

  const guideTimerRef = useRef<number | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  // Restart idle timer
  const restartGuideTimer = useCallback(() => {
    setShowGuide(false);
    if (guideTimerRef.current) window.clearTimeout(guideTimerRef.current);
    
    if (!isOpen) {
      guideTimerRef.current = window.setTimeout(() => {
        setShowGuide(true);
      }, 5000); // Reappear after 5s of idleness
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (guideTimerRef.current) window.clearTimeout(guideTimerRef.current);
      if (backFabTimerRef.current) window.clearTimeout(backFabTimerRef.current);
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

  useLayoutEffect(() => {
    if (isOpen || !containerRef.current) return;

    let currentIndex = 0;
    let isAnimating = false;

    // Initial setup
    gsap.set(bg2Ref.current, { yPercent: 100 });
    gsap.set(bg3Ref.current, { yPercent: 100 });
    gsap.set(openEnvRef.current, { y: 200, opacity: 0 });
    gsap.set(ayatRef.current, { y: 200, opacity: 0 });
    gsap.set(flower1Ref.current, { scale: 0, rotation: -30 });
    gsap.set(flower2Ref.current, { scale: 0, rotation: 30 });
    gsap.set(ayatFlower1Ref.current, { scale: 0, rotation: -30 });
    gsap.set(ayatFlower2Ref.current, { scale: 0, rotation: 30 });
    gsap.set(coupleNamesRef.current, { opacity: 0, scale: 0.8 });

    const gotoNext = () => {
      if (isAnimating || currentIndex >= 3) return;
      isAnimating = true;
      currentIndex++;
      playMusic();

      if (currentIndex === 1) {
        const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });
        
        // 1. Exit Phase 0 Staggered
        tl.to(closedFlower1Ref.current, { y: -200, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);
        tl.to(closedFlower2Ref.current, { y: -250, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.15);
        tl.to(closedEnvRef.current, { y: -150, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.3);
        tl.to(captionRef.current, { y: -100, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.45);

        // 2. Backgrounds Transition (Starts after exit starts)
        tl.to(bg1Ref.current, { yPercent: -100, duration: 1.2, ease: "power3.inOut" }, 0.8);
        tl.to(bg2Ref.current, { yPercent: 0, duration: 1.2, ease: "power3.inOut" }, 0.8);
        
        // 3. Entrance Phase 1 Staggered
        tl.fromTo(openEnvRef.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 1.4);
        tl.fromTo(flower1Ref.current, { y: 100, scale: 0, rotation: -30 }, { y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.2)" }, 1.8);
        tl.fromTo(flower2Ref.current, { y: 150, scale: 0, rotation: 30 }, { y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.2)" }, 2.0);
        tl.fromTo(coupleNamesRef.current, { y: 30, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 2.3);

      } else if (currentIndex === 2) {
        const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });
        
        // 1. Exit Phase 1 Staggered
        tl.to(flower1Ref.current, { y: -200, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);
        tl.to(flower2Ref.current, { y: -250, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.15);
        tl.to(openEnvRef.current, { y: -150, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.3);
        tl.to(coupleNamesRef.current, { y: -100, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.4);

        // 2. Backgrounds Transition
        tl.to(bg2Ref.current, { yPercent: -100, duration: 1.2, ease: "power3.inOut" }, 0.8);
        tl.to(bg3Ref.current, { yPercent: 0, duration: 1.2, ease: "power3.inOut" }, 0.8);

        // 3. Entrance Phase 2 (Ayat) Staggered
        tl.fromTo(ayatRef.current, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 1.4);
        tl.fromTo(ayatFlower1Ref.current, { y: 100, scale: 0, rotation: -30 }, { y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.2)" }, 1.8);
        tl.fromTo(ayatFlower2Ref.current, { y: 150, scale: 0, rotation: 30 }, { y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.2)" }, 2.0);

      } else if (currentIndex === 3) {
        const tl = gsap.timeline({ 
          onComplete: () => {
            isAnimating = false;
            setPhase("opened");
            window.scrollTo(0, 0);
          } 
        });
        tl.to(containerRef.current, { yPercent: -100, opacity: 0, duration: 1.2, ease: "power3.inOut" }, 0);
      }
    };

    const gotoPrev = () => {
      if (isAnimating || currentIndex <= 0) return;
      isAnimating = true;
      currentIndex--;

      if (currentIndex === 1) {
        const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });
        
        // 1. Exit Phase 2 (Ayat) Downwards
        tl.to(ayatFlower1Ref.current, { y: 200, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);
        tl.to(ayatFlower2Ref.current, { y: 250, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.1);
        tl.to(ayatRef.current, { y: 150, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.2);

        // 2. Background Transition Back
        tl.to(bg3Ref.current, { yPercent: 100, duration: 1.2, ease: "power3.inOut" }, 0.5);
        tl.to(bg2Ref.current, { yPercent: 0, duration: 1.2, ease: "power3.inOut" }, 0.5);

        // 3. Re-entrance Phase 1 Staggered
        tl.fromTo(openEnvRef.current, { y: -150, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 1.0);
        tl.fromTo(flower1Ref.current, { y: -100, scale: 0, rotation: -30 }, { y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.2)" }, 1.3);
        tl.fromTo(flower2Ref.current, { y: -150, scale: 0, rotation: 30 }, { y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.2)" }, 1.4);
        tl.fromTo(coupleNamesRef.current, { y: -30, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 1.6);

      } else if (currentIndex === 0) {
        const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });

        // 1. Exit Phase 1 Downwards
        tl.to(flower1Ref.current, { y: 200, opacity: 0, duration: 0.6, ease: "power2.in" }, 0);
        tl.to(flower2Ref.current, { y: 250, opacity: 0, duration: 0.6, ease: "power2.in" }, 0.1);
        tl.to(openEnvRef.current, { y: 150, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.2);
        tl.to(coupleNamesRef.current, { y: 100, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.3);

        // 2. Background Transition Back
        tl.to(bg2Ref.current, { yPercent: 100, duration: 1.2, ease: "power3.inOut" }, 0.6);
        tl.to(bg1Ref.current, { yPercent: 0, duration: 1.2, ease: "power3.inOut" }, 0.6);

        // 3. Re-entrance Phase 0 Staggered
        tl.fromTo(closedEnvRef.current, { y: -150, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 1.1);
        tl.fromTo(closedFlower1Ref.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 1.4);
        tl.fromTo(closedFlower2Ref.current, { y: -150, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 1.5);
        tl.fromTo(captionRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, 1.7);
      }
    };

    const hideGuide = () => {
      restartGuideTimer();
    };

    const observer = ScrollTrigger.observe({
      target: window,
      type: "wheel,touch,pointer",
      onUp: () => { hideGuide(); gotoPrev(); },
      onDown: () => { hideGuide(); gotoNext(); },
      tolerance: 30,
      preventDefault: true,
      wheelSpeed: -1
    });

    return () => {
      observer.kill();
    };
  }, [isOpen, playMusic, restartGuideTimer]);

  const handleBackToOpening = useCallback(() => {
    pauseMusic();
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

        <div className="fixed bottom-5 right-4 z-40">
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
              >
                <EllipsisVertical className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            ) : (
              <div
                className="flex h-11 w-[120px] items-center justify-center gap-1.5 px-2"
                role="group"
              >
                <button
                  type="button"
                  onClick={handleFabHome}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--inv-primary)] transition hover:bg-[var(--inv-primary)]/10"
                  aria-label="Kembali ke opening"
                >
                  <Home className="h-5 w-5" strokeWidth={2} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={toggleMusicMute}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--inv-primary)] transition hover:bg-[var(--inv-primary)]/10"
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

      {!isOpen && (
        <div ref={containerRef} className="fixed inset-0 z-50 overflow-hidden bg-[var(--inv-surface)]">
          <div ref={bg1Ref} className="pointer-events-none absolute inset-0">
            <Image src="/assets/background/background3.webp" alt="" fill priority className="object-cover opacity-100 animate-slow-pan" />
          </div>
          <div ref={bg2Ref} className="pointer-events-none absolute inset-0">
            <Image src="/assets/background/background3.webp" alt="" fill priority className="object-cover opacity-100 animate-slow-pan" />
          </div>
          <div ref={bg3Ref} className="pointer-events-none absolute inset-0">
            <Image src="/assets/background/background3.webp" alt="" fill priority className="object-cover opacity-100 animate-slow-pan" />
          </div>

          <div className="relative z-30 mx-auto flex h-full w-full flex-col items-center justify-center py-4">
            <div className="relative h-full w-full max-w-full text-center">
              
              <div ref={captionRef} className="absolute inset-0 z-10 flex flex-col items-center pt-[6vh]">
                <div className="relative inline-block animate-float">
                  <p 
                    className="text-[length:10cqw] text-white drop-shadow-md relative z-10"
                    style={{ fontFamily: "'Brittany Signature', serif", lineHeight: 1.3 }}
                  >
                    Hi,  <br />
                    <span className="relative inline-block mt-3 px-2">
                      <span 
                        className="absolute -inset-x-6 bottom-[18%] top-[42%] -z-10 -rotate-2 rounded-sm"
                        style={{
                          background: "linear-gradient(to right, transparent 0%, rgba(128, 0, 32, 0.6) 5%, rgba(128, 0, 32, 0.7) 50%, rgba(128, 0, 32, 0.6) 95%, transparent 100%)",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)"
                        }}
                      ></span>
                      <span className="relative z-10 text-[length:12.5cqw] text-white drop-shadow-md">{guestName}</span>
                    </span>
                  </p>
                </div>
                <div className="mt-2 mx-auto inline-block relative px-10 py-4">
                  <div className="flex flex-col items-center justify-center space-y-1 relative z-10 mt-6">
                    <p 
                      className="text-[length:4cqw] font-bold uppercase tracking-normal text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                      style={{ fontFamily: "serif" }}
                    >
                      You&apos;re Invited
                    </p>
                    <div className="h-[1px] w-24 bg-white/30 my-1"></div>
                    <p 
                      className="text-[length:3cqw] font-medium uppercase tracking-wide text-white/90"
                      style={{ fontFamily: "serif" }}
                    >
                      To Our Wedding
                    </p>
                  </div>
                </div>
              </div>

              <div ref={closedEnvRef} className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center">
                 <div className="relative mx-auto w-[90%] origin-bottom scale-110 animate-float">
                  <img src="/assets/opening/amplop-closed.png" alt="" className="h-auto w-full drop-shadow-[0_28px_40px_rgba(16,24,40,0.36)]" />
                   <div ref={closedFlower1Ref} className="absolute bottom-[22%] left-[14%] z-10 aspect-square w-[35%] -translate-x-1/4 md:w-[30%]">
                    <Image src="/assets/opening/flower-1.png" alt="" fill className="object-contain animate-zoom-in-out" />
                  </div>
                  <div ref={closedFlower2Ref} className="absolute right-[14%] top-[24%] z-10 aspect-square w-[35%] translate-x-1/4 md:w-[30%]">
                    <Image src="/assets/opening/flower-2.png" alt="" fill className="object-contain animate-zoom-in-out-delayed" />
                  </div>
                </div>
              </div>

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
                        <path d="M12 11V4c0-1.1-.9-2-2-2s-2 .9-2 2v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11h2.5a2.5 2.5 0 0 1 2.5 2.5v3.5a4.5 4.5 0 0 1-4.5 4.5h-2.5a4.5 4.5 0 0 1-4.5-4.5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                    <span className="text-white/90 text-[10px] font-medium tracking-[0.2em] uppercase mt-2 drop-shadow-md">Scroll</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={openEnvRef} className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                <div className="relative mx-auto w-[95%] origin-center scale-[1.15] animate-float">
                  <img src="/assets/opening/amplop-open.png" alt="Undangan terbuka" className="h-auto w-full drop-shadow-[0_30px_42px_rgba(16,24,40,0.4)]" />
                  <div ref={coupleNamesRef} className="absolute inset-x-0 top-[20%] flex items-center justify-center px-4">
                    <h2 
                      className="text-[length:7.5cqw] text-[#2b2b2b] flex flex-col items-center justify-center"
                      style={{ fontFamily: "'Brittany Signature', serif", lineHeight: 1.1 }}
                    >
                      {coupleHeading.includes('&') ? (
                        <>
                          <span className="pb-1">{coupleHeading.split('&')[0].trim()}</span>
                          <span className="text-[length:4.5cqw] py-1">&amp;</span>
                          <span className="pt-1">{coupleHeading.split('&')[1].trim()}</span>
                        </>
                      ) : (
                        <span>{coupleHeading}</span>
                      )}
                    </h2>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.5, scale: 1 }} transition={{ delay: 1.8, duration: 1 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40"
                    >
                      <svg viewBox="0 0 120 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 10H50M70 10H120" stroke="#2b2b2b" strokeWidth="0.5" strokeLinecap="round"/>
                        <path d="M54 10L60 4L66 10L60 16L54 10Z" stroke="#2b2b2b" strokeWidth="0.5"/>
                        <circle cx="60" cy="10" r="1.2" fill="#2b2b2b"/>
                      </svg>
                    </motion.div>
                  </div>
                  <div ref={flower1Ref} className="absolute left-[14%] top-[45%] z-10 aspect-square w-[35%] -translate-x-1/4 -translate-y-1/2 md:w-[30%] origin-center">
                    <Image src="/assets/opening/flower-1.png" alt="" fill className="object-contain animate-zoom-in-out" />
                  </div>
                  <div ref={flower2Ref} className="absolute bottom-[20%] right-[14%] z-10 aspect-square w-[35%] translate-x-1/4 md:w-[30%] origin-center">
                    <Image src="/assets/opening/flower-2.png" alt="" fill className="object-contain animate-zoom-in-out-delayed" />
                  </div>
                </div>
              </div>

              <div ref={ayatRef} className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                <div className="relative mx-auto w-[75%] origin-center animate-float">
                  <img src="/assets/frame/ayat.png" alt="Frame Ayat" className="h-auto w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-14 text-center">
                    <p 
                      className="text-[length:2.8cqw] font-bold text-[#2b2b2b] uppercase mb-2 tracking-[0.3em] opacity-80"
                      style={{ fontFamily: "serif" }}
                    >
                      QS. Az-Zariyat: 49
                    </p>
                    <p 
                      className="text-[length:5.5cqw] text-[#2b2b2b] mb-5 leading-relaxed" 
                      style={{ fontFamily: "'Traditional Arabic', serif", direction: 'rtl' }}
                    >
                      وَمِنْ كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ
                    </p>
                    <p 
                      className="text-[length:3.2cqw] text-[#4a4a4a] italic mb-3 leading-relaxed tracking-wide"
                      style={{ fontFamily: "serif" }}
                    >
                      &ldquo;And of all things We created pairs, <br/> that you may remember.&rdquo;
                    </p>
                 
                  </div>
                  <div ref={ayatFlower1Ref} className="absolute -left-[35%] -top-[25%] z-10 aspect-square w-[110%] origin-center pointer-events-none">
                    <Image src="/assets/flowers/bunga-ayat.png" alt="" fill className="object-contain animate-zoom-in-out" />
                  </div>
                  <div ref={ayatFlower2Ref} className="absolute -right-[35%] -bottom-[25%] z-10 aspect-square w-[110%] origin-center pointer-events-none">
                    <Image src="/assets/flowers/bunga-ayat.png" alt="" fill className="object-contain animate-zoom-in-out-delayed" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
