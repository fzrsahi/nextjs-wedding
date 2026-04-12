"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import type { TEventScheduleBlock } from "@/lib/types/event.types";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

type TDetailAcaraSectionProps = {
  showAkad: boolean;
  showResepsi: boolean;
  akad: TEventScheduleBlock;
  resepsi: TEventScheduleBlock;
};

function getTimeLeft() {
  const target = process.env.NEXT_PUBLIC_COUNTDOWN_TARGET?.trim() || "2026-12-12T09:00:00+07:00";
  const targetMs = new Date(target).getTime();
  const now = Date.now();
  const diff = Math.max(0, targetMs - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const STATIC_TIME_LEFT = { days: 0, hours: 0, minutes: 0, seconds: 0 };

/** Timer 1 detik di sini supaya parent tidak re-render → latar foto tidak kedip. */
function DetailAcaraCountdown() {
  const [timeLeft, setTimeLeft] = useState(STATIC_TIME_LEFT);
  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

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
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="mb-5"
    >
      <div className="rounded-[1.4rem] border border-[var(--inv-silver)]/65 bg-white/72 p-2 shadow-[0_12px_28px_rgb(var(--inv-primary-rgb)/0.1)] backdrop-blur-[2px]">
        <div className="grid grid-cols-4 gap-2">
          {items.map((item) => (
            <div
              key={item.label}
              className="relative overflow-hidden rounded-[1rem] border border-[var(--inv-silver)]/60 bg-[linear-gradient(155deg,rgb(var(--inv-surface-rgb)/0.94),rgb(var(--inv-surface-rgb)/0.82)_55%,rgb(var(--inv-surface-rgb)/0.94))] px-2 py-3 text-center"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-7 bg-[radial-gradient(circle_at_50%_0%,rgb(var(--inv-accent-rgb)/0.18),transparent_70%)]" />
              <p className="relative text-[1.35rem] leading-none font-semibold text-[var(--inv-primary)] [font-family:var(--font-display)]">
                {String(item.value).padStart(2, "0")}
              </p>
              <p className="relative mt-1 text-[10px] uppercase tracking-[0.14em] text-[var(--inv-ink-muted)]/80">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EventLine({
  schedule,
  order,
  mapUrl,
  enableMapDetail,
}: {
  schedule: TEventScheduleBlock;
  order: string;
  mapUrl?: string;
  enableMapDetail: boolean;
}) {
  const [showMapDetail, setShowMapDetail] = useState(false);

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
              {enableMapDetail && mapUrl ? (
                <button
                  type="button"
                  onClick={() => setShowMapDetail((prev) => !prev)}
                  className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--inv-accent)] underline decoration-[var(--inv-accent)]/65 underline-offset-3 transition hover:text-[var(--inv-primary)]"
                >
                  {showMapDetail ? "Tutup detail lokasi" : "Click me - lihat detail lokasi"}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {enableMapDetail && showMapDetail && mapUrl ? (
            <motion.div
              key={`map-detail-${order}`}
              initial={{ opacity: 0, y: 12, clipPath: "inset(0 0 100% 0 round 0.9rem)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0 round 0.9rem)" }}
              exit={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0 round 0.9rem)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 overflow-hidden rounded-[0.95rem] border border-[var(--inv-silver)]/75 bg-white/78 p-2"
            >
              <div className="overflow-hidden rounded-[0.7rem] border border-[var(--inv-silver)]/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/detail-acara/maps.png"
                  alt="Peta lokasi acara pernikahan"
                  className="w-full object-cover"
                />
              </div>
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--inv-primary)] underline decoration-[var(--inv-accent)]/70 underline-offset-4 transition hover:text-[var(--inv-accent)]"
              >
                Buka lokasi di maps
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
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
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.06, 1.02]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-3%", "4%"]);
  const sharedMapUrlForBoth = akad.mapUrl || resepsi.mapUrl;
  const showMapInAkad = showAkad;
  const showMapInResepsi = !showAkad && showResepsi;
  const blend = SECTION_SCROLL_BLEND.detailAcara;

  return (
    <section
      ref={sectionRef}
      aria-label="Detail acara"
      className="relative min-h-screen w-full overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(162deg,#f2f6f4_0%,#e2ebe6_38%,#d5e4dc_68%,#cadbd4_100%)]" />
      {/*
        Satu lapisan foto: hanya scale+y dari scroll (tanpa opacity anim ganda) + overlay statis
        supaya tidak bentrok whileInView vs useTransform (kedip). overflow-hidden + min size stabilkan crop.
      */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.img
          src="/assets/opening/foto-berdua.jpeg"
          alt=""
          width={1920}
          height={1080}
          decoding="async"
          draggable={false}
          style={{
            scale: bgScale,
            y: bgY,
            willChange: "transform",
          }}
          className="absolute left-1/2 top-1/2 h-[min(140%,120vh)] w-full min-w-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center grayscale-[10%] saturate-[0.82] contrast-[0.9] sepia-[4%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgb(var(--inv-surface-rgb)/0.52),rgb(var(--inv-surface-rgb)/0.44)_50%,rgb(var(--inv-surface-rgb)/0.56))]" />
      </div>

      <SectionScrollBlend top={blend.top} bottom={blend.bottom} />

      <div className="relative z-10 min-h-screen px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgb(var(--inv-primary-rgb)/0.16),transparent_30%),radial-gradient(circle_at_86%_18%,rgb(var(--inv-primary-rgb)/0.2),transparent_34%),radial-gradient(circle_at_50%_88%,rgb(var(--inv-primary-rgb)/0.14),transparent_38%)]" />
        </div>

        <div className="pointer-events-none absolute left-1/2 top-16 h-52 w-52 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(var(--inv-primary-rgb)/0.12),transparent_72%)]" />
        <div className="pointer-events-none absolute left-6 right-6 top-[10rem] h-px bg-gradient-to-r from-transparent via-[var(--inv-accent)]/42 to-transparent" />

        <div className="relative z-10 w-full">
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

          <DetailAcaraCountdown />

          <div className="space-y-4">
            {showAkad ? (
              <EventLine
                schedule={akad}
                order="01"
                enableMapDetail={showMapInAkad}
                mapUrl={showResepsi ? sharedMapUrlForBoth : akad.mapUrl}
              />
            ) : null}
            {showResepsi ? (
              <EventLine
                schedule={resepsi}
                order="02"
                enableMapDetail={showMapInResepsi}
                mapUrl={showAkad ? sharedMapUrlForBoth : resepsi.mapUrl}
              />
            ) : null}
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

