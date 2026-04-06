"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";
import type { TEventScheduleBlock } from "@/lib/types/event.types";

type TDetailAcaraSectionProps = {
  showAkad: boolean;
  showResepsi: boolean;
  akad: TEventScheduleBlock;
  resepsi: TEventScheduleBlock;
};

function EventLine({
  schedule,
  order,
}: {
  schedule: TEventScheduleBlock;
  order: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden px-1 py-4 first:pt-1"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgb(var(--inv-accent-rgb)/0.08),transparent_42%),radial-gradient(circle_at_90%_90%,rgb(var(--inv-primary-rgb)/0.1),transparent_45%)]" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--inv-ink-muted)]/70">
              Rangkaian {order}
            </p>
            <h3 className="mt-1 text-[2rem] leading-none text-[var(--inv-primary)] [font-family:var(--font-display)]">
              {schedule.title}
            </h3>
          </div>
          <Sparkles className="mt-1 h-4 w-4 text-[var(--inv-accent)]/75" strokeWidth={1.8} />
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex gap-2.5 text-[0.86rem] text-[var(--inv-ink)]">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[var(--inv-primary)]/80" strokeWidth={1.9} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--inv-ink-muted)]/75">
                Tanggal
              </p>
              <p className="font-medium">{schedule.date || "—"}</p>
            </div>
          </div>
          <div className="flex gap-2.5 text-[0.86rem] text-[var(--inv-ink)]">
            <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--inv-primary)]/80" strokeWidth={1.9} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--inv-ink-muted)]/75">
                Waktu
              </p>
              <p className="font-medium">{schedule.time || "—"}</p>
            </div>
          </div>
          <div className="flex gap-2.5 text-[0.86rem] text-[var(--inv-ink)]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--inv-primary)]/80" strokeWidth={1.9} />
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--inv-ink-muted)]/75">
                Lokasi
              </p>
              <p className="whitespace-pre-line font-medium">{schedule.venue || "—"}</p>
            </div>
          </div>
        </div>

        {schedule.mapUrl ? (
          <a
            href={schedule.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--inv-primary)] underline decoration-[var(--inv-accent)]/70 underline-offset-4 transition hover:text-[var(--inv-accent)]"
          >
            Buka peta
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        ) : null}
      </div>
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-[var(--inv-primary)]/30 to-transparent" />
    </motion.article>
  );
}

export function DetailAcaraSection({
  showAkad,
  showResepsi,
  akad,
  resepsi,
}: TDetailAcaraSectionProps) {
  if (!showAkad && !showResepsi) return null;
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.16, 1.09, 1.02]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "6%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.22, 0.34, 0.28]);

  return (
    <section
      ref={sectionRef}
      aria-label="Detail acara"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <motion.div
        aria-hidden
        animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-6 top-8 z-20 h-28 w-28 opacity-42"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/17.png" alt="" className="h-full w-full object-contain" />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, 9, 0], rotate: [0, 2.5, 0] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
        className="pointer-events-none absolute -right-6 top-16 z-20 h-28 w-28 opacity-40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/30.png" alt="" className="h-full w-full object-contain" />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.8 }}
        className="pointer-events-none absolute -right-3 bottom-10 z-20 h-24 w-24 opacity-36"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/22.png" alt="" className="h-full w-full object-contain" />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
        className="pointer-events-none absolute -left-4 bottom-16 z-20 h-24 w-24 opacity-36"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/19.png" alt="" className="h-full w-full object-contain" />
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, 7, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 8.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.2 }}
        className="pointer-events-none absolute right-8 top-4 z-20 h-18 w-18 opacity-32"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/26.png" alt="" className="h-full w-full object-contain" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(160deg,#f8f9f9_0%,#eef2f2_54%,#e4e8eb_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0">
        <motion.img
          src="/assets/opening/foto-berdua.jpeg"
          alt=""
          initial={{ opacity: 0, scale: 1.22 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ scale: bgScale, y: bgY, opacity: bgOpacity }}
          className="h-full w-full object-cover object-center grayscale-[10%] saturate-[0.82] contrast-[0.9] sepia-[4%]"
        />
          <div className="absolute inset-0 bg-[linear-gradient(165deg,rgb(var(--inv-surface-rgb)/0.54),rgb(var(--inv-surface-rgb)/0.46)_50%,rgb(var(--inv-surface-rgb)/0.58))]" />
      </div>

      <div className="relative z-10 min-h-screen px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgb(var(--inv-accent-rgb)/0.14),transparent_30%),radial-gradient(circle_at_86%_18%,rgb(var(--inv-primary-rgb)/0.16),transparent_32%),radial-gradient(circle_at_50%_88%,rgb(var(--inv-primary-rgb)/0.1),transparent_35%)]" />
        </div>

        <motion.div
          aria-hidden
          animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-11 top-6 h-28 w-28 opacity-50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/flowers/28.png" alt="" className="h-full w-full object-contain" />
        </motion.div>
        <motion.div
          aria-hidden
          animate={{ y: [0, 10, 0], rotate: [0, 2.5, 0] }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
          className="pointer-events-none absolute -right-10 bottom-8 h-28 w-28 opacity-45"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/flowers/32.png" alt="" className="h-full w-full object-contain" />
        </motion.div>
        <motion.div
          aria-hidden
          animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.1 }}
          className="pointer-events-none absolute right-6 top-5 h-20 w-20 opacity-35"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/flowers/31.png" alt="" className="h-full w-full object-contain" />
        </motion.div>
        <div className="pointer-events-none absolute left-1/2 top-16 h-52 w-52 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--inv-primary-rgb)/0.12),transparent_72%)]" />
        <div className="pointer-events-none absolute left-6 right-6 top-[10rem] h-px bg-gradient-to-r from-transparent via-[var(--inv-accent)]/42 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pb-8 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--inv-ink-muted)]/75">
              Wedding Ceremony
            </p>
            <h2 className="mt-1 text-[2.15rem] leading-none text-[var(--inv-primary)] [font-family:var(--font-display)]">
              Detail Acara
            </h2>
            <div className="mx-auto mt-3 flex items-center justify-center gap-2 text-[var(--inv-accent)]/80">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
              <div className="h-px w-28 bg-gradient-to-r from-transparent via-[var(--inv-accent)]/70 to-transparent" />
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
          </motion.div>

          <div className="space-y-4">
            {showAkad ? <EventLine schedule={akad} order="01" /> : null}
            {showResepsi ? <EventLine schedule={resepsi} order="02" /> : null}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            className="mt-5 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--inv-ink-muted)]/80"
          >
            <CalendarDays className="h-3.5 w-3.5 text-[var(--inv-primary)]/80" strokeWidth={2} />
            <span>Save The Date</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

