"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

export function QuotesSection() {
  const b = SECTION_SCROLL_BLEND.quotes;
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      aria-label="Quotes dan ayat"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-[68vh] items-center justify-center overflow-hidden px-6 py-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(158deg,#fefefe_0%,#f0f5f3_38%,#e4eee8_72%,#dce8e2_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_50%_at_15%_20%,rgb(var(--inv-silver-rgb)/0.35),transparent_50%),radial-gradient(ellipse_70%_45%_at_88%_75%,rgb(var(--inv-primary-rgb)/0.1),transparent_52%),radial-gradient(circle_at_50%_100%,rgb(var(--inv-accent-rgb)/0.07),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_bottom,transparent_0%,rgb(var(--inv-primary-rgb)/0.06)_55%,rgb(var(--inv-primary-rgb)/0.11)_100%)]" />
      <SectionScrollBlend bottom={b.bottom} />
      <div className="relative z-10 w-full text-center">
        <p className="mt-2 text-[1.6rem] leading-tight text-[var(--inv-primary)] [font-family:var(--font-display)]">
          وَمِنْ كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ
        </p>
        <p className="mt-3 text-sm italic text-[var(--inv-ink-muted)]">
          &ldquo;Dan segala sesuatu Kami ciptakan berpasang-pasangan.&rdquo;
        </p>
        <p className="mt-1 text-xs tracking-[0.18em] text-[var(--inv-accent)]/80">
          QS. Az-Zariyat: 49
        </p>
      </div>
    </motion.section>
  );
}
