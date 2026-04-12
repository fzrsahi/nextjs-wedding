"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type TOpeningGateProps = {
  guestName: string;
  coupleHeading: string;
  children: React.ReactNode;
};

const FLOWERS = [
  // atas (rapat, saling overlap)
  { src: "/assets/flowers/29.png", size: 84, left: "-2%", top: "-7%", delay: 0, rotate: -10 },
  { src: "/assets/flowers/24.png", size: 78, left: "8%", top: "-9%", delay: 0.03, rotate: -6 },
  { src: "/assets/flowers/31.png", size: 86, left: "19%", top: "-8%", delay: 0.06, rotate: -4 },
  { src: "/assets/flowers/25.png", size: 80, left: "31%", top: "-9%", delay: 0.09, rotate: -2 },
  { src: "/assets/flowers/28.png", size: 92, left: "43%", top: "-8%", delay: 0.12, rotate: 0 },
  { src: "/assets/flowers/21.png", size: 98, left: "56%", top: "-9%", delay: 0.15, rotate: 3 },
  { src: "/assets/flowers/22.png", size: 90, left: "69%", top: "-8%", delay: 0.18, rotate: 6 },
  { src: "/assets/flowers/30.png", size: 86, left: "82%", top: "-9%", delay: 0.21, rotate: 10 },

  // kiri (rapat)
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

  // kanan (rapat)
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

  // bawah (rapat, nutup frame)
  { src: "/assets/flowers/24.png", size: 84, left: "-1%", top: "88%", delay: 0.56, rotate: -8 },
  { src: "/assets/flowers/31.png", size: 78, left: "11%", top: "90%", delay: 0.59, rotate: -6 },
  { src: "/assets/flowers/25.png", size: 84, left: "24%", top: "89%", delay: 0.62, rotate: -3 },
  { src: "/assets/flowers/28.png", size: 94, left: "38%", top: "90%", delay: 0.65, rotate: -1 },
  { src: "/assets/flowers/21.png", size: 98, left: "52%", top: "89%", delay: 0.68, rotate: 2 },
  { src: "/assets/flowers/22.png", size: 90, left: "66%", top: "90%", delay: 0.71, rotate: 5 },
  { src: "/assets/flowers/30.png", size: 86, left: "79%", top: "89%", delay: 0.74, rotate: 8 },
  { src: "/assets/flowers/29.png", size: 82, left: "91%", top: "88%", delay: 0.77, rotate: 10 },
] as const;

export function OpeningGate({
  guestName,
  coupleHeading,
  children,
}: TOpeningGateProps) {
  const [phase, setPhase] = useState<
    "closed" | "opening" | "particles" | "couple" | "opened"
  >("closed");
  const openTimerRef = useRef<number | null>(null);
  const particleTimerRef = useRef<number | null>(null);
  const coupleTimerRef = useRef<number | null>(null);
  const backFabTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [isBackFabExpanded, setIsBackFabExpanded] = useState(false);

  const isOpen = phase === "opened";
  const isAnimating = phase === "opening";
  const isParticlePhase = phase === "particles";
  const isCoupleHighlight = phase === "couple";
  const showEnvelope = phase !== "opened";
  const showEmergingCouple = phase === "couple";

  useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current);
      }
      if (coupleTimerRef.current) {
        window.clearTimeout(coupleTimerRef.current);
      }
      if (particleTimerRef.current) {
        window.clearTimeout(particleTimerRef.current);
      }
      if (backFabTimerRef.current) {
        window.clearTimeout(backFabTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsBackFabExpanded(false);
      if (backFabTimerRef.current) {
        window.clearTimeout(backFabTimerRef.current);
      }
    }
  }, [isOpen]);

  const handleOpen = () => {
    if (phase === "couple") {
      setPhase("opened");
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }

    if (phase !== "closed") {
      return;
    }

    setPhase("opening");
    openTimerRef.current = window.setTimeout(() => {
      setPhase("particles");
    }, reduceMotion ? 350 : 2000);
    particleTimerRef.current = window.setTimeout(() => {
      setPhase("couple");
    }, reduceMotion ? 700 : 3000);
  };

  const handleBackToOpening = () => {
    setPhase("closed");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const handleBackFabClick = () => {
    if (!isBackFabExpanded) {
      setIsBackFabExpanded(true);
      if (backFabTimerRef.current) {
        window.clearTimeout(backFabTimerRef.current);
      }
      backFabTimerRef.current = window.setTimeout(() => {
        setIsBackFabExpanded(false);
      }, 2400);
      return;
    }
    handleBackToOpening();
  };

  return (
    <>
      <main
        className={[
          "min-h-screen w-full space-y-0 p-0 font-sans text-sm",
          "text-[var(--inv-ink)] transition-opacity duration-500",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        aria-hidden={!isOpen}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
        </motion.div>

        <div className="fixed bottom-5 right-4 z-40 sm:right-6">
          <motion.button
            type="button"
            onClick={handleBackFabClick}
            animate={isBackFabExpanded ? { width: 176 } : { width: 46 }}
            transition={{ duration: reduceMotion ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex h-11 items-center justify-center overflow-hidden rounded-full border border-[var(--inv-primary)] bg-white/88 px-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--inv-primary)] shadow-[0_10px_24px_rgba(16,24,40,0.18)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[var(--inv-primary)] hover:text-white"
          >
            <span className="text-base leading-none">⌂</span>
            <motion.span
              animate={isBackFabExpanded ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              className="ml-2 whitespace-nowrap"
            >
              Kembali ke Opening
            </motion.span>
          </motion.button>
        </div>
      </main>

      {!isOpen ? (
        <AnimatePresence>
          <motion.section
          aria-label="Opening screen"
          className="fixed inset-0 z-50 overflow-hidden bg-[var(--inv-surface)] text-[var(--inv-ink)]"
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

          <div className="relative z-30 mx-auto flex min-h-screen max-w-xl items-center justify-center px-4 py-8">
            <div className="w-full max-w-sm text-center">
            <motion.div
                        aria-hidden
                        className="mt-3 flex items-center justify-center gap-2"
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: reduceMotion ? 0.7 : [0.45, 0.9, 0.45] }}
                        transition={{
                          duration: reduceMotion ? 0 : 1.8,
                          repeat: reduceMotion ? 0 : Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[var(--inv-accent)]/70 to-transparent" />
                        <span className="h-1.5 w-1.5 rotate-45 border border-[var(--inv-accent)]/75" />
                        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[var(--inv-accent)]/70 to-transparent" />
                      </motion.div>

              <div className="relative mx-auto mt-2 h-[402px] w-full max-w-[390px]">
                <motion.div
                  className="absolute inset-x-0 top-3 h-[336px]"
                  initial={false}
                  animate={showEnvelope ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={
                      phase === "closed"
                        ? { y: 0, scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)" }
                        : {
                            y: reduceMotion ? 0 : -90,
                            scale: reduceMotion ? 1 : 0.7,
                            rotate: reduceMotion ? 0 : -8,
                            opacity: 0,
                            filter: reduceMotion ? "blur(0px)" : "blur(4px)",
                          }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Image
                      src="/assets/opening/closed.png"
                      alt="Amplop undangan"
                      fill
                      className="object-contain drop-shadow-[0_26px_36px_rgba(16,24,40,0.38)]"
                      priority
                    />
                  </motion.div>

                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={
                      phase === "opening" || phase === "particles" || phase === "couple"
                        ? {
                            y: 0,
                            scale: 1,
                            rotate: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                          }
                        : {
                            y: reduceMotion ? 0 : 105,
                            scale: reduceMotion ? 1 : 0.66,
                            rotate: reduceMotion ? 0 : 9,
                            opacity: 0,
                            filter: reduceMotion ? "blur(0px)" : "blur(3px)",
                          }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : 0.75,
                      delay: reduceMotion ? 0 : 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {phase === "opening" || phase === "particles" ? (
                      <div className="pointer-events-none absolute left-1/2 top-[5.95rem] z-10 h-[172px] w-[194px] -translate-x-1/2">
                        {/* floral frame */}
                        <motion.div
                          aria-hidden
                          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: 0,
                          }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.6,
                            delay: reduceMotion ? 0 : 0.1,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute inset-[-18px] z-20"
                        >
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

                          {/* tambahan bunga kecil biar rapat mengelilingi */}
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
                        </motion.div>

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
                    ) : null}
                    <Image
                      src="/assets/opening/open.png"
                      alt="Amplop undangan terbuka"
                      fill
                      className="object-contain drop-shadow-[0_30px_42px_rgba(16,24,40,0.4)]"
                      priority
                    />
                  </motion.div>

                  <AnimatePresence>
                    {showEmergingCouple ? (
                      <motion.div
                        className="pointer-events-none absolute left-1/2 top-[1.35rem] z-50 h-[332px] w-[320px] -translate-x-1/2"
                        initial={{ opacity: 0, y: 88, scale: 0.9, filter: "blur(6px)" }}
                        animate={{
                          opacity: 1,
                          y: isCoupleHighlight ? -10 : 0,
                          scale: isCoupleHighlight ? 1.06 : 1,
                          filter: "blur(0px)",
                        }}
                        exit={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.9,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        {/* bubble/spotlight di belakang frame (lebih soft) */}
                        <motion.div
                          aria-hidden
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.04 }}
                          className="pointer-events-none absolute inset-x-3 bottom-0 z-0"
                        >
                          <div className="relative aspect-[3/4] w-full">
                            <div className="absolute inset-[-18px] rounded-[2rem] bg-[radial-gradient(circle_at_35%_16%,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.42)_56%,transparent_78%)]" />
                            <div className="absolute inset-[-26px] rounded-[2.1rem] bg-[radial-gradient(circle_at_60%_22%,rgb(var(--inv-primary-rgb)/0.16)_0%,rgb(var(--inv-primary-rgb)/0.05)_42%,transparent_72%)] blur-xl" />
                          </div>
                        </motion.div>

                        {/* FOTO paling bawah (di dalam bingkai) */}
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

                        {/* BINGKAI + bunga overlay di atas foto */}
                        <motion.div
                          aria-hidden
                          initial={{ opacity: 0, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.08 }}
                          className="pointer-events-none absolute inset-x-4 bottom-0 z-20"
                        >
                          <div className="relative aspect-[3/4] w-full">
                            <div className="absolute inset-[-10px] rounded-[1.9rem] border border-white/70" />
                            <div className="absolute -left-10 -top-10 h-22 w-22">
                              <Image src="/assets/flowers/28.png" alt="" fill sizes="96px" className="object-contain drop-shadow-[0_14px_24px_rgba(16,24,40,0.24)]" aria-hidden />
                            </div>
                            <div className="absolute -right-10 -top-9 h-22 w-22">
                              <Image src="/assets/flowers/32.png" alt="" fill sizes="96px" className="object-contain drop-shadow-[0_14px_24px_rgba(16,24,40,0.24)]" aria-hidden />
                            </div>
                            <div className="absolute -left-9 -bottom-11 h-22 w-22">
                              <Image src="/assets/flowers/21.png" alt="" fill sizes="96px" className="object-contain drop-shadow-[0_14px_24px_rgba(16,24,40,0.24)]" aria-hidden />
                            </div>
                            <div className="absolute -right-9 -bottom-11 h-22 w-22">
                              <Image src="/assets/flowers/22.png" alt="" fill sizes="96px" className="object-contain drop-shadow-[0_14px_24px_rgba(16,24,40,0.24)]" aria-hidden />
                            </div>
                            <div className="absolute left-1/2 -top-9 h-16 w-16 -translate-x-1/2 opacity-95">
                              <Image src="/assets/flowers/29.png" alt="" fill className="object-contain drop-shadow-[0_12px_22px_rgba(16,24,40,0.22)]" aria-hidden />
                            </div>
                            <div className="absolute left-1/2 -bottom-10 h-16 w-16 -translate-x-1/2 opacity-95">
                              <Image src="/assets/flowers/24.png" alt="" fill className="object-contain drop-shadow-[0_12px_22px_rgba(16,24,40,0.22)]" aria-hidden />
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>

                <AnimatePresence>
                  {isParticlePhase ? (
                    <>
                      {[
                        { left: "38%", size: 10, delay: 0 },
                        { left: "44%", size: 14, delay: 0.08 },
                        { left: "50%", size: 9, delay: 0.16 },
                        { left: "56%", size: 16, delay: 0.24 },
                        { left: "62%", size: 12, delay: 0.32 },
                      ].map((bubble, idx) => (
                        <motion.div
                          key={`bubble-${idx}`}
                          className="pointer-events-none absolute bottom-[8.25rem] z-[5] rounded-full border border-white/60 bg-white/30"
                          style={{
                            left: bubble.left,
                            width: bubble.size,
                            height: bubble.size,
                          }}
                          initial={{ opacity: 0, y: 14, scale: 0.8 }}
                          animate={{
                            opacity: [0, 0.95, 0],
                            y: [0, -58],
                            scale: [0.9, 1.1, 0.9],
                          }}
                          transition={{
                            duration: reduceMotion ? 0 : 1.05,
                            delay: reduceMotion ? 0 : bubble.delay,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </>
                  ) : null}

                  {isCoupleHighlight ? (
                    <>
                      {/* spotlight sekarang mengikuti ukuran foto (dipindah ke wrapper foto) */}
                    </>
                  ) : null}
                </AnimatePresence>

              </div>

              <div className="relative mt-0.5 min-h-[5.6rem]">
                <AnimatePresence mode="wait" initial={false}>
                  {phase === "closed" ? (
                    <motion.div
                      key="guest-heading"
                      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
                      transition={{ duration: reduceMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-0 top-0"
                    >
                      <p className="text-5xl italic text-[var(--inv-primary)]/80 [font-family:serif]">
                        {`Hi ${guestName},`}
                      </p>
                      <p className="mt-2 text-sm text-[var(--inv-ink-muted)]">
                        Youve been invited to our wedding
                      </p>
                    </motion.div>
                  ) : phase === "opening" || phase === "particles" ? (
                    <motion.div
                      key="opening-loading"
                      initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                      transition={{ duration: reduceMotion ? 0 : 0.46, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-0 top-0"
                    >
                      <motion.p
                        className="text-4xl italic text-[var(--inv-primary)]/90 [font-family:serif]"
                        initial={{ letterSpacing: "0.02em" }}
                        animate={{ letterSpacing: reduceMotion ? "0.02em" : ["0.02em", "0.08em", "0.02em"] }}
                        transition={{
                          duration: reduceMotion ? 0 : 2.1,
                          repeat: reduceMotion ? 0 : Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        
                      </motion.p>
                      <div className="mt-2 flex items-center justify-center gap-2">
                        {[0, 1, 2].map((dot) => (
                          <motion.span
                            key={`opening-dot-${dot}`}
                            className="h-1.5 w-1.5 rounded-full bg-[var(--inv-accent)]/80"
                            initial={{ opacity: 0.28, y: 0 }}
                            animate={{ opacity: [0.28, 1, 0.28], y: [0, -4, 0] }}
                            transition={{
                              duration: reduceMotion ? 0 : 1.1,
                              repeat: reduceMotion ? 0 : Infinity,
                              delay: dot * 0.16,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <motion.div
                        aria-hidden
                        className="mt-3 flex items-center justify-center gap-2"
                        initial={{ opacity: 0.4 }}
                        animate={{ opacity: reduceMotion ? 0.7 : [0.45, 0.9, 0.45] }}
                        transition={{
                          duration: reduceMotion ? 0 : 1.8,
                          repeat: reduceMotion ? 0 : Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[var(--inv-accent)]/70 to-transparent" />
                        <span className="h-1.5 w-1.5 rotate-45 border border-[var(--inv-accent)]/75" />
                        <span className="h-px w-10 bg-gradient-to-r from-transparent via-[var(--inv-accent)]/70 to-transparent" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="couple-heading"
                      initial={{ opacity: 0, y: 20, scale: 0.96, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-x-0 top-0"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={handleOpen}
                disabled={phase === "opening" || phase === "particles"}
                className="mt-3 inline-flex min-w-44 items-center justify-center rounded-full border border-[var(--inv-primary)] bg-white/80 px-6 py-3 text-sm font-medium text-[var(--inv-primary)] transition hover:-translate-y-0.5 hover:bg-[var(--inv-primary)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {phase === "closed"
                  ? "Buka Undangan"
                  : phase === "couple"
                    ? "Lanjut ke Undangan"
                    : "Membuka..."}
              </button>

           
            </div>
          </div>
          </motion.section>
        </AnimatePresence>
      ) : null}
    </>
  );
}
