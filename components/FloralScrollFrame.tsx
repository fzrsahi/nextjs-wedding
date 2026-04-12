"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const FRAME_FLOWERS = [
  // atas (rapat, saling overlap)
  { src: "/assets/flowers/29.png", size: 84, left: "-2%", top: "-7%", delay: 0, rotate: -10 },
  { src: "/assets/flowers/24.png", size: 78, left: "8%", top: "-9%", delay: 0.03, rotate: -6 },
  { src: "/assets/flowers/31.png", size: 86, left: "19%", top: "-8%", delay: 0.06, rotate: -4 },
  { src: "/assets/flowers/25.png", size: 80, left: "31%", top: "-9%", delay: 0.09, rotate: -2 },
  { src: "/assets/flowers/28.png", size: 92, left: "43%", top: "-8%", delay: 0.12, rotate: 0 },
  { src: "/assets/flowers/21.png", size: 98, left: "56%", top: "-9%", delay: 0.15, rotate: 3 },
  { src: "/assets/flowers/22.png", size: 90, left: "69%", top: "-8%", delay: 0.18, rotate: 6 },
  { src: "/assets/flowers/30.png", size: 86, left: "82%", top: "-9%", delay: 0.21, rotate: 10 },

  // kiri (rapat)
  { src: "/assets/flowers/17.png", size: 108, left: "-13%", top: "5%", delay: 0.24, rotate: -14 },
  { src: "/assets/flowers/24.png", size: 78, left: "0%", top: "12%", delay: 0.27, rotate: -10 },
  { src: "/assets/flowers/28.png", size: 116, left: "-14%", top: "20%", delay: 0.3, rotate: -10 },
  { src: "/assets/flowers/25.png", size: 78, left: "0%", top: "28%", delay: 0.33, rotate: -8 },
  { src: "/assets/flowers/21.png", size: 124, left: "-13%", top: "37%", delay: 0.36, rotate: -8 },
  { src: "/assets/flowers/18.png", size: 74, left: "1%", top: "45%", delay: 0.39, rotate: -6 },
  { src: "/assets/flowers/26.png", size: 110, left: "-12%", top: "54%", delay: 0.42, rotate: -7 },
  { src: "/assets/flowers/22.png", size: 82, left: "0%", top: "63%", delay: 0.45, rotate: -5 },
  { src: "/assets/flowers/30.png", size: 110, left: "-11%", top: "72%", delay: 0.48, rotate: -7 },
  { src: "/assets/flowers/31.png", size: 84, left: "1%", top: "80%", delay: 0.51, rotate: -4 },

  // kanan (rapat)
  { src: "/assets/flowers/18.png", size: 108, left: "87%", top: "5%", delay: 0.26, rotate: 14 },
  { src: "/assets/flowers/29.png", size: 78, left: "95%", top: "12%", delay: 0.29, rotate: 10 },
  { src: "/assets/flowers/32.png", size: 116, left: "88%", top: "20%", delay: 0.32, rotate: 10 },
  { src: "/assets/flowers/31.png", size: 78, left: "95%", top: "28%", delay: 0.35, rotate: 8 },
  { src: "/assets/flowers/22.png", size: 124, left: "87%", top: "37%", delay: 0.38, rotate: 8 },
  { src: "/assets/flowers/28.png", size: 74, left: "78%", top: "45%", delay: 0.41, rotate: 6 },
  { src: "/assets/flowers/21.png", size: 110, left: "88%", top: "54%", delay: 0.44, rotate: 7 },
  { src: "/assets/flowers/25.png", size: 82, left: "79%", top: "63%", delay: 0.47, rotate: 5 },
  { src: "/assets/flowers/26.png", size: 110, left: "87%", top: "72%", delay: 0.5, rotate: 7 },
  { src: "/assets/flowers/17.png", size: 84, left: "79%", top: "80%", delay: 0.53, rotate: 6 },

  // bawah (rapat, nutup frame)
  { src: "/assets/flowers/24.png", size: 84, left: "-1%", top: "88%", delay: 0.56, rotate: -8 },
  { src: "/assets/flowers/31.png", size: 78, left: "11%", top: "90%", delay: 0.59, rotate: -6 },
  { src: "/assets/flowers/25.png", size: 84, left: "24%", top: "89%", delay: 0.62, rotate: -3 },
  { src: "/assets/flowers/28.png", size: 94, left: "38%", top: "90%", delay: 0.65, rotate: -1 },
  { src: "/assets/flowers/21.png", size: 98, left: "52%", top: "89%", delay: 0.68, rotate: 2 },
  { src: "/assets/flowers/22.png", size: 90, left: "66%", top: "90%", delay: 0.71, rotate: 5 },
  { src: "/assets/flowers/30.png", size: 86, left: "79%", top: "89%", delay: 0.74, rotate: 8 },
  { src: "/assets/flowers/29.png", size: 82, left: "91%", top: "88%", delay: 0.77, rotate: 10 },
] as const;

export function FloralScrollFrame() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[28] overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_0%,transparent_66%,black_82%,black_100%)]"
    >
      {FRAME_FLOWERS.map((flower, idx) => (
        <motion.div
          key={`${flower.src}-${idx}`}
          className="absolute will-change-transform"
          style={{
            left: flower.left,
            top: flower.top,
            width: flower.size,
            height: flower.size,
          }}
          initial={{ opacity: 0, y: 22, rotate: flower.rotate }}
          animate={
            reduceMotion
              ? { opacity: 0.92, y: 0, rotate: flower.rotate }
              : {
                  opacity: 0.92,
                  y: [0, -10, 0, 6, 0],
                  rotate: [flower.rotate, flower.rotate + 4, flower.rotate - 3, flower.rotate],
                  scale: [1, 1.02, 1],
                }
          }
          transition={{
            opacity: { duration: 0.55, delay: flower.delay },
            y: {
              duration: 7.2,
              delay: flower.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 8.4,
              delay: flower.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: 6.2,
              delay: flower.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <Image
            src={flower.src}
            alt=""
            width={flower.size}
            height={flower.size}
            className="object-contain opacity-90 drop-shadow-[0_10px_16px_rgba(16,24,40,0.2)]"
            aria-hidden
          />
        </motion.div>
      ))}
    </div>
  );
}
