"use client";

import { motion } from "framer-motion";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

export function QuotesSection() {
  const b = SECTION_SCROLL_BLEND.quotes;
  return (
    <motion.section
      aria-label="Quotes dan ayat"
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-[68vh] items-center justify-center overflow-hidden px-6 py-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,#ffffff_0%,#f4f9f6_58%,#e8f2ed_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_bottom,transparent_0%,rgb(var(--inv-primary-rgb)/0.08)_100%)]" />
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

