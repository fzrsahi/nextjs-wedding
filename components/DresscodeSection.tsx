"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import {
  UI_DRESSCODE_DO_BODY_AFTER,
  UI_DRESSCODE_DO_BODY_BEFORE,
  UI_DRESSCODE_DO_EMPHASIS,
  UI_DRESSCODE_DO_LABEL,
  UI_DRESSCODE_DONT_BODY,
  UI_DRESSCODE_DONT_LABEL,
  UI_DRESSCODE_TITLE,
} from "@/lib/constants/messages.id";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

/** Swatch warna gelap — bentuk organik mirip kelopak / blob */
function DarkToneSwatch() {
  return (
    <div
      className="mx-auto mt-5 h-[4.25rem] w-[4.25rem] shadow-[inset_0_-6px_14px_rgba(0,0,0,0.22),0_10px_22px_rgba(44,24,20,0.18)] ring-1 ring-black/10"
      style={{
        borderRadius: "46% 54% 52% 48% / 48% 45% 55% 52%",
        background:
          "radial-gradient(circle at 32% 28%, rgb(72 48 42), rgb(28 18 16) 55%, rgb(18 12 11))",
      }}
      aria-hidden
    />
  );
}

/** Kotak terang + garis diagonal — “larangan putih” */
function NoWhiteSwatch() {
  return (
    <div
      className="relative mx-auto mt-5 flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-md border border-[#d4cbc2] bg-[#ebe4dd] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.65)]"
      aria-hidden
    >
      <span className="absolute h-[2.5px] w-[130%] rotate-45 rounded-full bg-[var(--inv-accent)] shadow-[0_1px_2px_rgb(123_35_50_/_0.35)]" />
    </div>
  );
}

export function DresscodeSection() {
  const reduceMotion = useReducedMotion();
  const blend = SECTION_SCROLL_BLEND.dresscode;

  return (
    <motion.section
      aria-label={UI_DRESSCODE_TITLE}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden px-5 py-14 sm:px-8 sm:py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(175deg,#fffefb_0%,#f8f3ed_45%,#efe8e0_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgb(var(--inv-accent-rgb)/0.08),transparent_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.42]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(36 92 72 / 0.032) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <SectionScrollBlend top={blend.top} bottom={blend.bottom} />

      <div className="relative z-10 mx-auto w-full max-w-md text-center">
        <h2 className="text-[1.65rem] font-medium leading-tight tracking-tight text-[var(--inv-accent)] [font-family:var(--font-display)] sm:text-[1.85rem]">
          {UI_DRESSCODE_TITLE}
        </h2>

        <div className="mt-12 space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.04 }}
          >
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#8a7568]">
              {UI_DRESSCODE_DO_LABEL}
            </p>
            <p className="mx-auto mt-2 max-w-[28ch] text-[0.9375rem] leading-relaxed text-[var(--inv-ink)] [font-family:var(--font-geist-sans)]">
              {UI_DRESSCODE_DO_BODY_BEFORE}
              <strong className="font-semibold text-[var(--inv-ink)]">
                {UI_DRESSCODE_DO_EMPHASIS}
              </strong>
              {UI_DRESSCODE_DO_BODY_AFTER}
            </p>
            <DarkToneSwatch />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 0.1 }}
          >
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[#8a7568]">
              {UI_DRESSCODE_DONT_LABEL}
            </p>
            <p className="mx-auto mt-2 max-w-[28ch] text-[0.9375rem] leading-relaxed text-[var(--inv-ink)] [font-family:var(--font-geist-sans)]">
              {UI_DRESSCODE_DONT_BODY}
            </p>
            <NoWhiteSwatch />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
