"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import {
  UI_CLOSING_BODY,
  UI_CLOSING_HEADLINE,
  UI_CLOSING_KICKER,
  UI_CLOSING_NAMES_PREFIX,
  UI_CLOSING_WASSALAM,
} from "@/lib/constants/messages.id";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

const headlineWords = UI_CLOSING_HEADLINE.split(" ");

type TClosingSectionProps = {
  coupleHeading: string;
};

export function ClosingSection({ coupleHeading }: TClosingSectionProps) {
  const reduceMotion = useReducedMotion();
  const blend = SECTION_SCROLL_BLEND.closing;

  return (
    <motion.footer
      aria-label={UI_CLOSING_KICKER}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.6 }}
      className="relative overflow-hidden"
    >
      <div className="relative min-h-[min(88vh,720px)] px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#c4d5cf_0%,#cadcd6_10%,#dfe9e4_32%,#e8efe9_40%,#1a3d2f_72%,#132f25_100%)]" />
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          animate={
            reduceMotion
              ? undefined
              : {
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }
          }
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 20% 30%, rgb(123 35 50 / 0.08), transparent 50%), radial-gradient(ellipse 60% 40% at 80% 70%, rgb(36 92 72 / 0.12), transparent 45%)",
            backgroundSize: "200% 200%",
          }}
        />

        <div className="pointer-events-none absolute left-1/2 top-[12%] h-[min(42vw,280px)] w-[min(42vw,280px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_255_255_/_0.22),transparent_68%)] blur-2xl" />

        <div className="pointer-events-none absolute -left-8 bottom-32 h-28 w-28 opacity-[0.2] sm:h-32 sm:w-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/flowers/21.png"
            alt=""
            className="h-full w-full object-contain brightness-0 invert"
          />
        </div>
        <div className="pointer-events-none absolute -right-6 bottom-40 h-24 w-24 opacity-[0.18] sm:h-28 sm:w-28">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/flowers/32.png"
            alt=""
            className="h-full w-full object-contain brightness-0 invert"
          />
        </div>

        <SectionScrollBlend top={blend.top} />

        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
          <h2 className="mt-6 flex flex-wrap items-center justify-center gap-x-[0.35em] gap-y-1 text-[clamp(2.5rem,9vw,3.75rem)] font-medium leading-none text-[var(--inv-primary)] [font-family:var(--font-display)]">
            {headlineWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{
                  opacity: 0,
                  y: reduceMotion ? 0 : 22,
                  rotate: reduceMotion ? 0 : -2,
                }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.55,
                  delay: reduceMotion ? 0 : 0.08 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: reduceMotion ? 0 : 0.75,
              delay: reduceMotion ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-8 h-px w-48 origin-center bg-gradient-to-r from-transparent via-[var(--inv-accent)]/55 to-transparent sm:w-56"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: reduceMotion ? 0 : 0.55,
              delay: reduceMotion ? 0 : 0.45,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-8 max-w-md text-[0.9375rem] leading-[1.75] text-[var(--inv-ink-muted)]"
          >
            {UI_CLOSING_BODY}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduceMotion ? 0 : 0.6,
              delay: reduceMotion ? 0 : 0.62,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-14 rounded-[2px] border border-white/12 bg-[rgb(0_0_0_/_0.12)] px-8 py-7 shadow-[0_24px_60px_rgba(0,0,0,0.2)] backdrop-blur-[6px] sm:px-10 sm:py-8"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/55">
              {UI_CLOSING_NAMES_PREFIX}
            </p>
            <p className="mt-3 text-[1.65rem] font-medium leading-tight text-[#f5f0e8] [font-family:var(--font-display)] sm:text-[1.9rem]">
              {coupleHeading}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              duration: reduceMotion ? 0 : 0.7,
              delay: reduceMotion ? 0 : 0.85,
            }}
            className="mt-12 max-w-md text-sm leading-relaxed text-white/78"
          >
            {UI_CLOSING_WASSALAM}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: reduceMotion ? 0 : 0.5,
              delay: reduceMotion ? 0 : 1,
            }}
            className="mt-10 flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.42em] text-white/35"
            aria-hidden
          >
            <span className="h-px w-8 bg-white/25" />
            <span>∞</span>
            <span className="h-px w-8 bg-white/25" />
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
