"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { SectionScrollBlend } from "@/components/SectionScrollBlend";
import { SECTION_SCROLL_BLEND } from "@/lib/section-scroll-blends";

export function VisualBlessingSection() {
  const blend = SECTION_SCROLL_BLEND.visual;
  return (
    <motion.section
      aria-label="Visual panel undangan"
      initial={{ opacity: 0, y: 20, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(168deg,#e8f0eb_0%,#f2ebe6_40%,#e5ebe7_78%,#dbe5e0_100%)] px-4 py-10 text-[var(--inv-ink)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgb(var(--inv-primary-rgb)/0.14),transparent_38%),radial-gradient(circle_at_86%_82%,rgb(var(--inv-accent-rgb)/0.14),transparent_40%),radial-gradient(ellipse_80%_50%_at_50%_0%,rgb(var(--inv-silver-rgb)/0.2),transparent_55%)]" />
      <SectionScrollBlend top={blend.top} bottom={blend.bottom} />
      <div className="pointer-events-none absolute -left-6 top-8 h-20 w-20 opacity-70">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/24.png" alt="" className="h-full w-full object-contain" />
      </div>
      <div className="pointer-events-none absolute -right-5 top-16 h-20 w-20 opacity-70">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/32.png" alt="" className="h-full w-full object-contain" />
      </div>
      <div className="pointer-events-none absolute -left-7 bottom-20 h-24 w-24 opacity-65">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/21.png" alt="" className="h-full w-full object-contain" />
      </div>
      <div className="pointer-events-none absolute -right-6 bottom-12 h-24 w-24 opacity-65">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/flowers/22.png" alt="" className="h-full w-full object-contain" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-2 py-2 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-[1.55rem] leading-tight text-[var(--inv-primary)] [font-family:var(--font-display)] sm:text-[1.8rem]">
            السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
          </p>
          <p className="mt-3 text-sm text-[var(--inv-ink-muted)]">
            Dengan memohon rahmat dan ridha Allah Subhanahu wa Ta&apos;ala,
            kami mempersembahkan putra-putri kami untuk memasuki ikatan suci
            pernikahan.
          </p>
          <div className="mx-auto mt-4 h-px w-52 bg-gradient-to-r from-transparent via-[#92a86a] to-transparent" />
        </motion.div>

        <div className="mt-10 space-y-9">
          <motion.article
            initial={{ opacity: 0, x: -28, y: 18 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="grid items-center gap-4 grid-cols-[160px_1fr] md:grid-cols-[190px_1fr]">
              <div className="relative mx-auto h-[210px] w-[160px] md:mx-0">
                <div className="absolute -inset-[5px] rounded-[2.8rem] bg-gradient-to-br from-[var(--inv-accent)]/30 via-[#92a86a]/15 to-[#92a86a]/30 blur-[1px]" />
                <div className="absolute inset-0 rounded-[2.6rem] border-[3px] border-[#92a86a]" />
                <div className="absolute inset-[3px] rounded-[2.45rem] border border-[var(--inv-accent)]/55" />
                <div className="absolute inset-[6px] rounded-[2.3rem] border border-[#92a86a]/60" />
                <div className="absolute inset-[11px] overflow-hidden rounded-[2rem] border border-[#92a86a]/45">
                  <Image
                    src="/assets/visual-blessing/man.jpeg"
                    alt="Foto calon mempelai pria"
                    width={720}
                    height={1080}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="pointer-events-none absolute -left-5 -top-3 h-11 w-11 opacity-85">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/flowers/24.png" alt="" className="h-full w-full object-contain" />
                </div>
                <div className="pointer-events-none absolute -right-4 bottom-2 h-10 w-10 opacity-85">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/flowers/29.png" alt="" className="h-full w-full object-contain" />
                </div>
                <div className="pointer-events-none absolute -right-5 top-9 h-8 w-8 opacity-75">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/flowers/31.png" alt="" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[0.64rem] uppercase tracking-[0.2em] text-[var(--inv-primary)]/75">
                  Calon Mempelai Pria
                </p>
                <h3 className="mt-1 text-[2rem] leading-none text-[var(--inv-accent)] [font-family:var(--font-display)]">
                  Fauzan
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--inv-ink-muted)]">
                  Putra dari Bapak [Nama Ayah] &amp; Ibu [Nama Ibu]
                </p>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, x: 28, y: 18 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            className="relative"
          >
            <div className="grid items-center gap-4 grid-cols-[1fr_160px] md:grid-cols-[1fr_190px]">
              <div className="text-center md:text-right">
                <p className="text-[0.64rem] uppercase tracking-[0.2em] text-[var(--inv-primary)]/75">
                  Calon Mempelai Wanita
                </p>
                <h3 className="mt-1 text-[2rem] leading-none text-[var(--inv-accent)] [font-family:var(--font-display)]">
                  Aca
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--inv-ink-muted)]">
                  Putri dari Bapak [Nama Ayah] &amp; Ibu [Nama Ibu]
                </p>
              </div>
              <div className="relative ml-auto h-[210px] w-[160px] md:ml-0">
                <div className="absolute -inset-[5px] rounded-[2.8rem] bg-gradient-to-br from-[var(--inv-accent)]/30 via-[#92a86a]/15 to-[#92a86a]/30 blur-[1px]" />
                <div className="absolute inset-0 rounded-[2.6rem] border-[3px] border-[#92a86a]" />
                <div className="absolute inset-[3px] rounded-[2.45rem] border border-[var(--inv-accent)]/55" />
                <div className="absolute inset-[6px] rounded-[2.3rem] border border-[#92a86a]/60" />
                <div className="absolute inset-[11px] overflow-hidden rounded-[2rem] border border-[#92a86a]/45">
                  <Image
                    src="/assets/visual-blessing/woman.jpeg"
                    alt="Foto calon mempelai wanita"
                    width={720}
                    height={1080}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="pointer-events-none absolute -left-5 bottom-0 h-11 w-11 opacity-85">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/flowers/31.png" alt="" className="h-full w-full object-contain" />
                </div>
                <div className="pointer-events-none absolute -right-4 -top-3 h-10 w-10 opacity-85">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/flowers/28.png" alt="" className="h-full w-full object-contain" />
                </div>
                <div className="pointer-events-none absolute -left-4 top-7 h-8 w-8 opacity-75">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/flowers/25.png" alt="" className="h-full w-full object-contain" />
                </div>
              </div>
            </div>
          </motion.article>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="mx-auto mt-10 max-w-2xl text-center text-sm text-[var(--inv-ink-muted)]"
        >
          Dengan penuh rasa syukur, kami memohon doa restu dan kehadiran
          Bapak/Ibu/Saudara/i pada momen bahagia pernikahan kami.
        </motion.p>
      </div>
    </motion.section>
  );
}

