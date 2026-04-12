"use client";

import Image from "next/image";
import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import {
  UI_STORY_ROADMAP_KICKER,
  UI_STORY_ROADMAP_TITLE,
} from "@/lib/constants/messages.id";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

type TCoupleStorySectionProps = {
  story: string;
};

function StoryFlourish({ flipped }: { flipped?: boolean }) {
  const rid = useId().replace(/:/g, "");
  const gidStroke = `${rid}-sf-stroke`;
  const gidAccent = `${rid}-sf-accent`;
  return (
    <svg
      viewBox="0 0 340 72"
      className={[
        "mx-auto h-[4.25rem] w-full max-w-[19rem] text-[var(--inv-primary)]",
        flipped ? "scale-y-[-1]" : "",
      ].join(" ")}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gidStroke} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(36 92 72)" stopOpacity="0.35" />
          <stop offset="50%" stopColor="rgb(36 92 72)" stopOpacity="0.78" />
          <stop offset="100%" stopColor="rgb(36 92 72)" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={gidAccent} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(123 35 50)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="rgb(123 35 50)" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <path
        d="M170 58c-42 0-78-18-102-34-12-9-20-18-24-26m126 60c42 0 78-18 102-34 12-9 20-18 24-26"
        stroke={`url(#${gidStroke})`}
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <path
        d="M170 52c-36-2-62-14-86-30M170 52c36-2 62-14 86-30"
        stroke={`url(#${gidStroke})`}
        strokeWidth="0.95"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M42 38c14-8 28-10 44-6M298 38c-14-8-28-10-44-6"
        stroke={`url(#${gidStroke})`}
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.5"
      />
      <circle cx="170" cy="24" r="5" fill={`url(#${gidAccent})`} opacity="0.92" />
      <circle cx="170" cy="24" r="2.2" fill="#fffdf9" opacity="0.95" />
      <path
        d="M170 14v-9M160 18l-7-6M180 18l7-6"
        stroke="rgb(36 92 72)"
        strokeWidth="1.05"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="118" cy="40" r="3.2" fill="rgb(123 35 50)" opacity="0.55" />
      <circle cx="222" cy="40" r="3.2" fill="rgb(123 35 50)" opacity="0.55" />
      <circle cx="92" cy="48" r="2.2" fill="rgb(36 92 72)" opacity="0.45" />
      <circle cx="248" cy="48" r="2.2" fill="rgb(36 92 72)" opacity="0.45" />
    </svg>
  );
}

function FloatingFlower({
  src,
  className,
  delay = 0,
}: {
  src: string;
  className: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={["pointer-events-none absolute z-0 select-none", className].join(" ")}
      initial={{ opacity: 0, scale: 0.9, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.72,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="relative h-full w-full drop-shadow-[0_12px_32px_rgb(36_92_72_/_0.26)]">
        <Image src={src} alt="" fill className="object-contain" sizes="200px" />
      </div>
    </motion.div>
  );
}

export function CoupleStorySection({ story }: TCoupleStorySectionProps) {
  const reduceMotion = useReducedMotion();
  const blend = SECTION_SCROLL_BLEND.couple;

  return (
    <motion.section
      aria-label={UI_STORY_ROADMAP_TITLE}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(168deg,#faf8f4_0%,#f3efe8_35%,#ebe4dc_70%,#e5ddd4_100%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.38]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(36 92 72 / 0.045) 1px, transparent 1px)",
          backgroundSize: "15px 15px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_50%_38%,rgb(255_253_249_/_0.88)_0%,transparent_58%),radial-gradient(circle_at_8%_25%,rgb(123_35_50_/_0.06),transparent_38%),radial-gradient(circle_at_92%_60%,rgb(36_92_72_/_0.07),transparent_40%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(70%,28rem)] w-[min(92%,22rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(123_35_50_/_0.07)_0%,transparent_68%)] blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(55%,22rem)] w-[min(80%,18rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(36_92_72_/_0.08)_0%,transparent_70%)] blur-xl"
        aria-hidden
      />

      <SectionScrollBlend top={blend.top} bottom={blend.bottom} />

      <FloatingFlower
        src="/assets/flowers/28.png"
        className="-left-3 top-10 h-28 w-28 opacity-[0.48] sm:-left-6 sm:top-12 sm:h-32 sm:w-32"
        delay={0}
      />
      <FloatingFlower
        src="/assets/flowers/31.png"
        className="-right-4 top-9 h-28 w-28 opacity-[0.46] sm:-right-7 sm:top-11 sm:h-32 sm:w-32"
        delay={0.12}
      />
      <FloatingFlower
        src="/assets/flowers/21.png"
        className="bottom-8 left-1 h-24 w-24 opacity-[0.42] sm:bottom-12 sm:left-3 sm:h-28 sm:w-28"
        delay={0.2}
      />
      <FloatingFlower
        src="/assets/flowers/22.png"
        className="bottom-6 right-1 h-28 w-28 opacity-[0.46] sm:bottom-10 sm:right-3 sm:h-30 sm:w-30"
        delay={0.28}
      />

      <div className="relative z-10 mx-auto w-full max-w-lg px-2 sm:px-5">
        <header className="relative z-[1] text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--inv-primary)]/78">
            {UI_STORY_ROADMAP_KICKER}
          </p>
          <h2 className="mt-3 text-[1.78rem] font-medium leading-[1.12] tracking-tight text-[var(--inv-accent)] [font-family:var(--font-display)] sm:text-[2.05rem]">
            {UI_STORY_ROADMAP_TITLE}
          </h2>
        </header>

        <div className="relative mx-auto mt-8 max-w-md">
          <StoryFlourish />
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.08 }}
            className="relative z-[1] mx-auto px-1 py-6 text-center text-[1.02rem] font-medium leading-[1.75] tracking-[0.01em] text-[var(--inv-accent)]/92 [font-family:var(--font-display)] sm:text-[1.12rem] sm:leading-[1.8]"
          >
            <span className="relative">
              <span
                className="pointer-events-none absolute -inset-x-1 -inset-y-2 -z-10 rounded-2xl bg-[linear-gradient(105deg,rgb(255_253_249_/_0.55),rgb(255_253_249_/_0.2),rgb(255_253_249_/_0.5))] blur-[0.5px]"
                aria-hidden
              />
              {story}
            </span>
          </motion.p>
          <div className="-mt-1">
            <StoryFlourish flipped />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
