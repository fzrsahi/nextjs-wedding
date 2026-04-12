"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import {
  UI_GALLERY_HOVER_HINT,
  UI_GALLERY_INTRO,
  UI_GALLERY_KICKER,
  UI_GALLERY_LIGHTBOX_CLOSE,
  UI_GALLERY_LIGHTBOX_NEXT,
  UI_GALLERY_LIGHTBOX_PREV,
  UI_GALLERY_TAP_TO_EXPAND,
  UI_GALLERY_TITLE,
} from "@/lib/constants/messages.id";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

type TGallerySectionProps = {
  imagePaths: string[];
};

/** Bunga ringan di sudut lightbox — kecil, satu jenis per sudut */
const LIGHTBOX_FLOWERS = [
  {
    src: "/assets/flowers/25.png",
    className: "-left-5 -top-5 -rotate-[18deg]",
    size: 68,
  },
  {
    src: "/assets/flowers/28.png",
    className: "-right-4 -top-4 rotate-[14deg]",
    size: 62,
  },
  {
    src: "/assets/flowers/29.png",
    className: "-left-3 -bottom-5 rotate-[10deg]",
    size: 58,
  },
  {
    src: "/assets/flowers/31.png",
    className: "-right-5 -bottom-4 -rotate-[12deg]",
    size: 64,
  },
] as const;

const CORNER_FLOWERS = [
  "/assets/flowers/24.png",
  "/assets/flowers/30.png",
  "/assets/flowers/22.png",
  "/assets/flowers/21.png",
] as const;

/** Bingkai minimal: empat sudut bunga sangat ringan */
function MinimalFloralFrame({
  children,
  accentSeed,
}: {
  children: ReactNode;
  accentSeed: number;
}) {
  const a = (n: number) => CORNER_FLOWERS[(accentSeed + n) % CORNER_FLOWERS.length];
  const corner =
    "pointer-events-none absolute z-[1] h-7 w-7 object-contain opacity-[0.18] sm:h-8 sm:w-8";
  return (
    <div className="relative flex min-h-0 flex-1 flex-col rounded-[3px] p-[9px] ring-1 ring-[rgb(36_92_72_/_0.1)] ring-inset">
      <div className="pointer-events-none absolute inset-[5px] rounded-[2px] border border-[var(--inv-primary)]/12" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a(0)} alt="" className={`${corner} -left-0.5 -top-0.5 -rotate-[14deg]`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a(1)} alt="" className={`${corner} -right-0.5 -top-0.5 rotate-[12deg]`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a(2)} alt="" className={`${corner} -bottom-0.5 -left-0.5 rotate-[8deg]`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a(3)} alt="" className={`${corner} -bottom-0.5 -right-0.5 -rotate-[10deg]`} />
      <div className="relative z-[2] flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2px] bg-[#e8e4df] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.45)]">
        {children}
      </div>
    </div>
  );
}

function chunkByFour<T>(items: T[]): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += 4) {
    chunks.push(items.slice(i, i + 4));
  }
  return chunks;
}

function LightboxFlower({
  src,
  className,
  size,
  delay,
  reduceMotion,
}: {
  src: string;
  className: string;
  size: number;
  delay: number;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.span
      className={["pointer-events-none absolute z-[2]", className].join(" ")}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 0.42, scale: 1 }}
      transition={{
        delay: reduceMotion ? 0 : 0.12 + delay,
        duration: reduceMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      aria-hidden
    >
      <motion.span
        className="block h-full w-full"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -3, 0], rotate: [0, 1.5, 0] }
        }
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-contain drop-shadow-md" />
      </motion.span>
    </motion.span>
  );
}

type TLightboxProps = {
  paths: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  reduceMotion: boolean | null;
  titleId: string;
};

function GalleryLightbox({
  paths,
  index,
  onClose,
  onPrev,
  onNext,
  reduceMotion,
  titleId,
}: TLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const src = paths[index];

  useEffect(() => {
    closeRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.24 }}
    >
      <button
        type="button"
        aria-label={UI_GALLERY_LIGHTBOX_CLOSE}
        className="absolute inset-0 bg-[#14110f]/90 backdrop-blur-md"
        onClick={onClose}
      />

      <motion.div
        className="relative z-10 mt-10 flex w-full max-w-[min(96vw,900px)] flex-col items-center sm:mt-0"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: reduceMotion ? 0 : 0.42,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={UI_GALLERY_LIGHTBOX_CLOSE}
          className="absolute -top-1 right-0 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white shadow-lg backdrop-blur-md transition hover:bg-black/50 sm:-right-1 sm:-top-1"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <div className="relative w-full rounded-[2px] bg-gradient-to-br from-[#faf6f1] via-[#f3ebe4] to-[#ebe3dc] p-2 shadow-[0_32px_90px_rgba(0,0,0,0.55)] ring-1 ring-white/30 sm:p-3">
          {LIGHTBOX_FLOWERS.map((f, i) => (
            <LightboxFlower
              key={f.src}
              src={f.src}
              className={f.className}
              size={f.size}
              delay={i * 0.05}
              reduceMotion={reduceMotion}
            />
          ))}
          <div className="pointer-events-none absolute inset-3 rounded-sm border border-[var(--inv-primary)]/25 sm:inset-4" />

          <div className="relative overflow-hidden rounded-sm bg-[#0c0b0b] px-2 pb-2 pt-2 sm:px-3 sm:pb-3 sm:pt-3">
            <div className="relative flex min-h-[200px] max-h-[min(76vh,640px)] w-full items-center justify-center">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: reduceMotion ? 0 : -14, filter: "blur(4px)" }}
                  transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="flex max-h-[min(76vh,640px)] w-full items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="max-h-[min(76vh,640px)] w-full max-w-full object-contain"
                    decoding="async"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {paths.length > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-4">
            <motion.button
              type="button"
              whileTap={{ scale: reduceMotion ? 1 : 0.9 }}
              onClick={onPrev}
              aria-label={UI_GALLERY_LIGHTBOX_PREV}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </motion.button>
            <span className="min-w-[4.5rem] text-center text-xs font-medium tracking-[0.2em] text-white/88">
              {index + 1} / {paths.length}
            </span>
            <motion.button
              type="button"
              whileTap={{ scale: reduceMotion ? 1 : 0.9 }}
              onClick={onNext}
              aria-label={UI_GALLERY_LIGHTBOX_NEXT}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-lg backdrop-blur-sm transition hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </motion.button>
          </div>
        ) : null}
      </motion.div>
    </motion.div>
  );
}

type TWallSlotProps = {
  src: string;
  globalIndex: number;
  accentSeed: number;
  reduceMotion: boolean | null;
  onOpen: (i: number) => void;
  className?: string;
  imgClassName?: string;
  variants: Variants;
};

function WallPhotoSlot({
  src,
  globalIndex,
  accentSeed,
  reduceMotion,
  onOpen,
  className,
  imgClassName,
  variants,
}: TWallSlotProps) {
  return (
    <motion.figure
      variants={variants}
      className={["relative h-full min-h-0 w-full", className].filter(Boolean).join(" ")}
      style={{ perspective: 1100 }}
    >
      <motion.button
        type="button"
        onClick={() => onOpen(globalIndex)}
        whileHover={
          reduceMotion
            ? undefined
            : { scale: 1.015, transition: { type: "spring", stiffness: 400, damping: 24 } }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.99 }}
        className="group relative flex h-full min-h-0 w-full flex-1 cursor-zoom-in flex-col text-left"
      >
        <MinimalFloralFrame accentSeed={accentSeed}>
          <div
            className={[
              "relative flex min-h-0 h-full w-full flex-col overflow-hidden",
              imgClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover object-center transition duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              loading={globalIndex < 6 ? "eager" : "lazy"}
              decoding="async"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.12)_50%,transparent_60%)] opacity-0 transition duration-700 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.18)_0%,transparent_45%)]" />
          </div>
        </MinimalFloralFrame>
        <span className="pointer-events-none absolute bottom-1 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.26em] text-[var(--inv-primary)]/35 opacity-0 transition group-hover:opacity-100">
          <span className="inline-block h-px w-2 bg-[var(--inv-primary)]/28" />
          {UI_GALLERY_HOVER_HINT}
          <span className="inline-block h-px w-2 bg-[var(--inv-primary)]/28" />
        </span>
      </motion.button>
    </motion.figure>
  );
}

/** Template “dinding”: A3 | A4 + A4 | A3 — proporsi mirip referensi 90×65 */
function CompactGalleryWall({
  chunk,
  startIndex,
  wallIndex,
  reduceMotion,
  onOpen,
  wallSlotVariants,
  wallGroupVariants,
}: {
  chunk: string[];
  startIndex: number;
  wallIndex: number;
  reduceMotion: boolean | null;
  onOpen: (i: number) => void;
  wallSlotVariants: Variants;
  wallGroupVariants: Variants;
}) {
  const n = chunk.length;
  if (n === 0) return null;

  const wallMotionProps = {
    variants: wallGroupVariants,
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount: 0.12 as const },
  };

  if (n === 1) {
    return (
      <motion.div {...wallMotionProps} className="mx-auto w-full max-w-sm">
        <WallPhotoSlot
          src={chunk[0]!}
          globalIndex={startIndex}
          accentSeed={startIndex + wallIndex * 7}
          reduceMotion={reduceMotion}
          onOpen={onOpen}
          variants={wallSlotVariants}
          imgClassName="aspect-[30/42] min-h-[220px] sm:min-h-[260px]"
        />
      </motion.div>
    );
  }

  if (n === 2) {
    return (
      <motion.div
        {...wallMotionProps}
        className="mx-auto grid max-w-3xl grid-cols-2 gap-2 sm:gap-3"
      >
        {chunk.map((src, i) => (
          <WallPhotoSlot
            key={`${startIndex + i}-${src.slice(0, 48)}`}
            src={src}
            globalIndex={startIndex + i}
            accentSeed={startIndex + i + wallIndex}
            reduceMotion={reduceMotion}
            onOpen={onOpen}
            variants={wallSlotVariants}
            imgClassName="aspect-[21/30] min-h-[200px] sm:min-h-[240px]"
          />
        ))}
      </motion.div>
    );
  }

  if (n === 3) {
    return (
      <motion.div
        {...wallMotionProps}
        className="mx-auto grid max-w-4xl min-h-[280px] grid-cols-2 gap-2 sm:gap-3 md:min-h-[320px] md:grid-cols-[minmax(0,10fr)_minmax(0,7fr)] md:grid-rows-2"
      >
        <WallPhotoSlot
          src={chunk[0]!}
          globalIndex={startIndex}
          accentSeed={startIndex + wallIndex}
          reduceMotion={reduceMotion}
          onOpen={onOpen}
          variants={wallSlotVariants}
          className="col-start-1 row-start-1 md:row-span-2"
          imgClassName="aspect-[30/42] min-h-[200px] h-full md:min-h-0 md:aspect-auto md:h-full"
        />
        <WallPhotoSlot
          src={chunk[1]!}
          globalIndex={startIndex + 1}
          accentSeed={startIndex + 1 + wallIndex}
          reduceMotion={reduceMotion}
          onOpen={onOpen}
          variants={wallSlotVariants}
          className="col-start-2 row-start-1"
          imgClassName="aspect-[21/30] min-h-[180px] md:min-h-0 md:aspect-auto md:h-full"
        />
        <WallPhotoSlot
          src={chunk[2]!}
          globalIndex={startIndex + 2}
          accentSeed={startIndex + 2 + wallIndex}
          reduceMotion={reduceMotion}
          onOpen={onOpen}
          variants={wallSlotVariants}
          className="col-span-2 col-start-1 row-start-2 md:col-span-1 md:col-start-2 md:row-start-2"
          imgClassName="aspect-[21/30] min-h-[180px] md:min-h-0 md:aspect-auto md:h-full"
        />
      </motion.div>
    );
  }

  const [a, b, c, d] = chunk;
  return (
    <motion.div
      {...wallMotionProps}
      className={[
        "mx-auto grid w-full max-w-4xl gap-2 sm:gap-3",
        "grid-cols-2 auto-rows-fr min-h-[300px] sm:min-h-[340px]",
        "md:min-h-0 md:max-h-[min(72vh,560px)] md:aspect-[90/65]",
        "md:grid-cols-[minmax(0,10fr)_minmax(0,7fr)_minmax(0,10fr)] md:grid-rows-2",
      ].join(" ")}
    >
      <WallPhotoSlot
        src={a!}
        globalIndex={startIndex}
        accentSeed={startIndex + wallIndex * 5}
        reduceMotion={reduceMotion}
        onOpen={onOpen}
        variants={wallSlotVariants}
        className="col-start-1 row-start-1 row-span-1 md:row-span-2"
        imgClassName="aspect-[30/42] min-h-[140px] h-full md:aspect-auto md:min-h-0 md:h-full"
      />
      <WallPhotoSlot
        src={b!}
        globalIndex={startIndex + 1}
        accentSeed={startIndex + 1 + wallIndex * 5}
        reduceMotion={reduceMotion}
        onOpen={onOpen}
        variants={wallSlotVariants}
        className="col-start-2 row-start-1 md:col-start-2 md:row-start-1"
        imgClassName="aspect-[21/30] min-h-[130px] h-full md:aspect-auto md:min-h-0 md:h-full"
      />
      <WallPhotoSlot
        src={c!}
        globalIndex={startIndex + 2}
        accentSeed={startIndex + 2 + wallIndex * 5}
        reduceMotion={reduceMotion}
        onOpen={onOpen}
        variants={wallSlotVariants}
        className="col-start-1 row-start-2 md:col-start-2 md:row-start-2"
        imgClassName="aspect-[21/30] min-h-[130px] h-full md:aspect-auto md:min-h-0 md:h-full"
      />
      <WallPhotoSlot
        src={d!}
        globalIndex={startIndex + 3}
        accentSeed={startIndex + 3 + wallIndex * 5}
        reduceMotion={reduceMotion}
        onOpen={onOpen}
        variants={wallSlotVariants}
        className="col-start-2 row-start-2 md:col-start-3 md:row-span-2 md:row-start-1"
        imgClassName="aspect-[30/42] min-h-[140px] h-full md:aspect-auto md:min-h-0 md:h-full"
      />
    </motion.div>
  );
}

export function GallerySection({ imagePaths }: TGallerySectionProps) {
  const reduceMotion = useReducedMotion();
  const headingId = useId();
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const paths = imagePaths.filter(Boolean);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenIndex(null);
      }
      if (e.key === "ArrowLeft" && paths.length > 1) {
        e.preventDefault();
        setOpenIndex((i) => (i === null ? null : (i - 1 + paths.length) % paths.length));
      }
      if (e.key === "ArrowRight" && paths.length > 1) {
        e.preventDefault();
        setOpenIndex((i) => (i === null ? null : (i + 1) % paths.length));
      }
    },
    [openIndex, paths.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown, openIndex]);

  if (paths.length === 0) {
    return null;
  }

  const wallGroupVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };

  const wallSlotVariants: Variants = {
    hidden: {
      opacity: 0,
      y: reduceMotion ? 0 : 32,
      scale: reduceMotion ? 1 : 0.94,
      filter: reduceMotion ? "none" : "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0 : 0.52,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const walls = chunkByFour(paths);
  const blend = SECTION_SCROLL_BLEND.gallery;

  return (
    <motion.section
      aria-labelledby={headingId}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(175deg,#d8e5de_0%,#e8e2da_32%,#f0ebe4_65%,#f6f2ec_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_100%,rgb(var(--inv-primary-rgb)/0.08),transparent_50%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(36 92 72 / 0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <SectionScrollBlend top={blend.top} bottom={blend.bottom} />
      <div className="pointer-events-none absolute -left-20 top-24 h-48 w-48 opacity-[0.12] sm:top-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/21.png" alt="" className="h-full w-full object-contain" />
      </div>
      <div className="pointer-events-none absolute -right-16 bottom-32 h-44 w-44 opacity-[0.11]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/32.png" alt="" className="h-full w-full object-contain" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <header className="text-center">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[var(--inv-primary)]/78">
            {UI_GALLERY_KICKER}
          </p>
          <h2
            id={headingId}
            className="mt-2 text-[1.9rem] font-medium leading-[1.08] tracking-tight text-[var(--inv-accent)] [font-family:var(--font-display)] sm:text-[2.2rem]"
          >
            {UI_GALLERY_TITLE}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--inv-ink-muted)]">
            {UI_GALLERY_INTRO}
          </p>
          <p className="mt-4 text-[0.7rem] font-medium tracking-wide text-[var(--inv-primary)]/50">
            {UI_GALLERY_TAP_TO_EXPAND}
          </p>
        </header>

        <div className="relative mt-12 flex flex-col gap-14 sm:gap-16 md:gap-[4.5rem]">
          {walls.map((chunk, wallIndex) => (
            <CompactGalleryWall
              key={`gallery-wall-${wallIndex}-${chunk[0]?.slice(0, 48) ?? wallIndex}`}
              chunk={chunk}
              startIndex={wallIndex * 4}
              wallIndex={wallIndex}
              reduceMotion={reduceMotion}
              onOpen={setOpenIndex}
              wallGroupVariants={wallGroupVariants}
              wallSlotVariants={wallSlotVariants}
            />
          ))}
        </div>
      </div>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {openIndex !== null ? (
                <GalleryLightbox
                  key="gallery-lightbox"
                  paths={paths}
                  index={openIndex}
                  onClose={() => setOpenIndex(null)}
                  onPrev={() =>
                    setOpenIndex((idx) =>
                      idx === null ? null : (idx - 1 + paths.length) % paths.length,
                    )
                  }
                  onNext={() =>
                    setOpenIndex((idx) =>
                      idx === null ? null : (idx + 1) % paths.length,
                    )
                  }
                  reduceMotion={reduceMotion}
                  titleId={headingId}
                />
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </motion.section>
  );
}
