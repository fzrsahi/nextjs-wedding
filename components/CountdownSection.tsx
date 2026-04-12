"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type TCountdownSectionProps = {
  targetIso?: string;
};

function getTimeLeft(targetIso?: string) {
  const fallback = "2026-12-12T09:00:00+07:00";
  const target = new Date(targetIso || fallback).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export function CountdownSection({ targetIso }: TCountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetIso));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetIso));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetIso]);

  const items = useMemo(
    () => [
      { label: "Hari", value: timeLeft.days },
      { label: "Jam", value: timeLeft.hours },
      { label: "Menit", value: timeLeft.minutes },
      { label: "Detik", value: timeLeft.seconds },
    ],
    [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds],
  );

  return (
    <motion.section
      aria-label="Countdown acara"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden px-4 py-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(168deg,rgb(248_249_248/0.48)_0%,rgb(236_241_239/0.42)_55%,rgb(228_235_232/0.4)_100%)]" />
      <div className="relative z-10 w-full max-w-3xl rounded-[2rem] border border-[var(--inv-silver)]/65 bg-white/88 px-4 py-8 shadow-[0_16px_38px_rgb(var(--inv-primary-rgb)/0.14)]">
        <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--inv-ink-muted)]/80">
          Countdown
        </p>
        <h3 className="mt-1 text-[2rem] leading-none text-[var(--inv-primary)] [font-family:var(--font-display)]">
          Menuju Hari Bahagia
        </h3>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--inv-silver)]/65 bg-[linear-gradient(160deg,rgb(var(--inv-surface-rgb)/0.95),rgb(var(--inv-surface-rgb)/0.85))] px-2 py-3 text-center"
          >
            <p className="text-2xl leading-none font-semibold text-[var(--inv-primary)]">
              {String(item.value).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--inv-ink-muted)]/80">
              {item.label}
            </p>
          </div>
        ))}
        </div>
      </div>
    </motion.section>
  );
}

