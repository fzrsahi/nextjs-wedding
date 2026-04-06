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
  { src: "/assets/flowers/17.png", size: 84, left: "-3%", top: "8%", delay: 0, rotate: -12 },
  { src: "/assets/flowers/28.png", size: 92, left: "-8%", top: "28%", delay: 0.08, rotate: -10 },
  { src: "/assets/flowers/21.png", size: 102, left: "-7%", top: "52%", delay: 0.16, rotate: -8 },
  { src: "/assets/flowers/30.png", size: 90, left: "-6%", top: "74%", delay: 0.24, rotate: -7 },
  { src: "/assets/flowers/29.png", size: 66, left: "12%", top: "4%", delay: 0.3, rotate: -7 },
  { src: "/assets/flowers/31.png", size: 62, left: "14%", top: "88%", delay: 0.38, rotate: -5 },

  { src: "/assets/flowers/18.png", size: 84, left: "83%", top: "8%", delay: 0.02, rotate: 12 },
  { src: "/assets/flowers/32.png", size: 92, left: "86%", top: "28%", delay: 0.1, rotate: 10 },
  { src: "/assets/flowers/22.png", size: 102, left: "85%", top: "52%", delay: 0.18, rotate: 8 },
  { src: "/assets/flowers/26.png", size: 90, left: "84%", top: "74%", delay: 0.26, rotate: 7 },
  { src: "/assets/flowers/24.png", size: 66, left: "74%", top: "4%", delay: 0.34, rotate: 6 },
  { src: "/assets/flowers/25.png", size: 62, left: "74%", top: "88%", delay: 0.42, rotate: 5 },
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
  const reduceMotion = useReducedMotion();

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
    };
  }, []);

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
          <button
            type="button"
            onClick={handleBackToOpening}
            className="inline-flex min-w-40 items-center justify-center rounded-full border border-[var(--inv-primary)] bg-white/85 px-6 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[var(--inv-primary)] shadow-[0_10px_24px_rgba(16,24,40,0.18)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[var(--inv-primary)] hover:text-white"
          >
            Kembali ke Opening
          </button>
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
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#ffffff_0%,#f1f3f3_34%,#e2e6e8_70%,#d6dbe0_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgb(var(--inv-accent-rgb)/0.23),transparent_48%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_84%_18%,rgb(var(--inv-primary-rgb)/0.24),transparent_46%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_84%,rgb(var(--inv-accent-rgb)/0.14),transparent_42%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-18 mix-blend-multiply [background-image:radial-gradient(rgb(var(--inv-primary-rgb)/0.22)_0.6px,transparent_0.6px)] [background-size:6px_6px]" />

          <div className="pointer-events-none absolute inset-0 z-20">
            {FLOWERS.map((flower) => (
              <motion.div
                key={flower.src}
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

              <div className="relative mx-auto mt-3 h-[430px] w-full max-w-[390px]">
                <motion.div
                  className="absolute inset-x-0 top-4 h-[360px]"
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
                      phase === "opening" || phase === "particles"
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
                      <div className="pointer-events-none absolute left-1/2 top-[6.35rem] z-10 h-[146px] w-[162px] -translate-x-1/2 overflow-hidden rounded-[3px]">
                        <Image
                          src="/assets/opening/foto-berdua.jpeg"
                          alt="Foto berdua mempelai"
                          fill
                          className="object-cover object-center"
                          priority
                        />
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
                        className="pointer-events-none absolute left-1/2 top-[1.2rem] z-50 h-[390px] w-[320px] -translate-x-1/2"
                        initial={{ opacity: 0, y: 80, scale: 0.9 }}
                        animate={{
                          opacity: 1,
                          y: isCoupleHighlight ? -6 : 0,
                          scale: isCoupleHighlight ? 1.16 : 1,
                        }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.85,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <motion.div
                          className="absolute bottom-0 left-0 z-30 h-[372px] w-[202px]"
                          initial={{ opacity: 0, y: 64, x: -18, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, x: -2, scale: 1 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.64,
                            delay: reduceMotion ? 0 : 0.08,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Image
                            src="/assets/opening/woman.png"
                            alt=""
                            fill
                            className="object-contain drop-shadow-[0_14px_20px_rgba(16,24,40,0.26)]"
                            aria-hidden
                            priority
                          />
                        </motion.div>
                        <motion.div
                          className="absolute bottom-0 right-0 z-40 h-[378px] w-[212px]"
                          initial={{ opacity: 0, y: 64, x: 24, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.68,
                            delay: reduceMotion ? 0 : 0.56,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Image
                            src="/assets/opening/man.png"
                            alt=""
                            fill
                            className="object-contain drop-shadow-[0_14px_20px_rgba(16,24,40,0.26)]"
                            aria-hidden
                            priority
                          />
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
                      <motion.div
                        className="pointer-events-none absolute left-1/2 top-[2.2rem] z-20 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.42)_56%,transparent_100%)]"
                        initial={{ opacity: 0, scale: 0.2 }}
                        animate={{
                          opacity: reduceMotion ? 0.8 : 0.88,
                          scale: reduceMotion ? 1 : 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : 0.45 }}
                      />
                      <motion.div
                        className="pointer-events-none absolute left-1/2 top-[2.8rem] z-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--inv-primary-rgb)/0.15)_0%,rgb(var(--inv-primary-rgb)/0.04)_45%,transparent_72%)] blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: reduceMotion ? 0.45 : [0.15, 0.35, 0.22] }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 2.6,
                          repeat: reduceMotion ? 0 : Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </>
                  ) : null}
                </AnimatePresence>

              </div>

              <div className="relative mt-1 min-h-[6.2rem]">
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
