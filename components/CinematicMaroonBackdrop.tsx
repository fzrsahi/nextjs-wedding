"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { RefObject } from "react";

/** Foto lembut + overlay maroon — sama pola cinematic / RSVP (tanpa frame PNG). */
export const CINEMATIC_MAROON_BG_IMAGE = "/assets/background/background3.webp";

type TCinematicMaroonBackdropProps = {
  scrollTargetRef: RefObject<HTMLElement | null>;
  reduceMotion: boolean | null;
};

export function CinematicMaroonBackdrop({
  scrollTargetRef,
  reduceMotion,
}: TCinematicMaroonBackdropProps) {
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start end", "end start"],
  });
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "5%"]);

  const bgMotionStyle = reduceMotion
    ? undefined
    : {
        scale: bgScale,
        y: bgY,
        willChange: "transform" as const,
      };

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <motion.img
        src={CINEMATIC_MAROON_BG_IMAGE}
        alt=""
        width={1920}
        height={1080}
        decoding="async"
        draggable={false}
        style={bgMotionStyle}
        className="absolute left-1/2 top-1/2 h-[min(135%,122vh)] w-full min-w-[105%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-center opacity-[0.42]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(168deg,rgb(52_18_26_/_0.94)_0%,rgb(123_35_50_/_0.91)_42%,rgb(42_14_22_/_0.96)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,rgb(251_251_250_/_0.09),transparent_55%),radial-gradient(ellipse_70%_55%_at_100%_85%,rgb(36_92_72_/_0.14),transparent_50%),radial-gradient(ellipse_60%_50%_at_0%_60%,rgb(123_35_50_/_0.25),transparent_45%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "radial-gradient(rgb(251 251 250 / 0.06) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
        aria-hidden
      />
    </div>
  );
}

/** Garis tipis atas/bawah section; `warm` = aksen emas (tema dresscode/RSVP). */
export function CinematicMaroonEdgeLines({ warm = false }: { warm?: boolean }) {
  const topVia = warm ? "via-[#c9a882]/35" : "via-[#fbfbfa]/25";
  const bottomVia = warm ? "via-[#c9a882]/28" : "via-[#fbfbfa]/18";
  return (
    <>
      <div className={`pointer-events-none absolute inset-x-0 top-0 z-[5] h-px bg-gradient-to-r from-transparent ${topVia} to-transparent`} />
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-px bg-gradient-to-r from-transparent ${bottomVia} to-transparent`} />
    </>
  );
}
